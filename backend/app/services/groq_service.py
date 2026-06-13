import json
from typing import Dict, Any
from groq import Groq
from app.core.config import settings

class GroqService:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self._client = None

    @property
    def client(self) -> Groq:
        if not self._client:
            if not self.api_key or self.api_key == "gsk_your_key_here":
                raise ValueError(
                    "Chave de API do Groq (GROQ_API_KEY) não configurada no arquivo .env. "
                    "Por favor, configure-a para utilizar as funcionalidades de IA."
                )
            self._client = Groq(api_key=self.api_key)
        return self._client

    def _load_knowledge_file(self, filename: str) -> str:
        filepath = settings.KNOWLEDGE_DIR / filename
        if filepath.exists():
            try:
                return filepath.read_text(encoding="utf-8")
            except Exception:
                pass
        if filename == "sales_context.md":
            return (
                "Estrutura da Resposta: 1. Empatia/Saudação, 2. Argumentos de Vendas, 3. CTA Claro.\n"
                "Tons: Profissional, Amigável, Persuasivo."
            )
        elif filename == "market_metrics_rules.md":
            return (
                "Concorrência: Baixa (<5 sellers), Média (5-15), Alta (16-30), Saturada (>30).\n"
                "Preço de entrada: Próximo à média, oferecendo kits ou frete grátis."
            )
        return ""

    async def generate_reply_suggestion(
        self, customer_message: str, niche: str, tone: str
    ) -> Dict[str, Any]:
        sales_context = self._load_knowledge_file("sales_context.md")
        system_prompt = f"""
Você é um especialista em vendas de e-commerce e atendimento ao cliente. 
Sua tarefa é analisar a mensagem de um cliente e sugerir a melhor resposta de vendas baseada no nicho e tom escolhidos.

Nichos/Produto do Vendedor: {niche}
Tom de voz selecionado: {tone}

Diretrizes de Atendimento (da base de conhecimento):
{sales_context}

Você DEVE responder obrigatoriamente em formato JSON com a seguinte estrutura:
{{
  "suggested_response": "A resposta exata sugerida para o vendedor copiar e colar (em português brasileiro).",
  "tone_analysis": "Uma explicação curta de por que esse tom foi adequado.",
  "objection_handling": "Como você contornou as objeções implícitas na dúvida do cliente.",
  "sales_arguments": ["Argumento 1", "Argumento 2", "Argumento 3"]
}}
        """
        user_prompt = f"Mensagem enviada pelo cliente: \"{customer_message}\""
        try:
            completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                model="llama-3.3-70b-versatile",
                response_format={"type": "json_object"},
                temperature=0.7,
                max_tokens=1000
            )
            return json.loads(completion.choices[0].message.content)
        except Exception as e:
            raise RuntimeError(f"Erro ao chamar a API da Groq: {str(e)}")

    async def analyze_market_metrics(self, metrics: Dict[str, Any]) -> Dict[str, Any]:
        metrics_rules = self._load_knowledge_file("market_metrics_rules.md")
        brands_text = ", ".join(metrics.get("top_brands", [])) or "Não identificadas"
        attributes_text = ""
        for attr in metrics.get("key_attributes", []):
            values = ", ".join(attr.get("values", []))
            attributes_text += f"- {attr['name']}: {values}\n"
        related = metrics.get("related_categories", [])
        related_text = ", ".join([c["name"] for c in related]) or "Nenhuma"

        system_prompt = f"""
Você é um analista de inteligência de mercado sênior focado em e-commerce brasileiro.
Dados coletados no Mercado Livre para o nicho "{metrics['query']}":
- Categoria principal: {metrics.get('category_name', 'N/A')}
- Hierarquia: {metrics.get('category_path', 'N/A')}
- Total de itens ativos: {metrics.get('total_items_in_market', 0):,}
- Categorias relacionadas: {related_text}
- Principais marcas: {brands_text}
- Atributos técnicos:
{attributes_text}

Regras: {metrics_rules}

Responda APENAS em JSON:
{{
  "competition_level": "Baixa" ou "Média" ou "Alta" ou "Saturado",
  "competition_analysis": "Análise sobre volume, marcas e concentração.",
  "ideal_price_range": "Faixa recomendada (ex: R$ 150,00 - R$ 300,00).",
  "price_strategy": "Justificativa da faixa.",
  "opportunities": ["Oportunidade 1", "Oportunidade 2", "Oportunidade 3"],
  "commercial_approach": "Sugestão prática de título, diferenciais e atributos."
}}
        """
        try:
            completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Gere a análise para: '{metrics['query']}'"}
                ],
                model="llama-3.3-70b-versatile",
                response_format={"type": "json_object"},
                temperature=0.5,
                max_tokens=1500
            )
            return json.loads(completion.choices[0].message.content)
        except Exception as e:
            raise RuntimeError(f"Erro ao gerar inteligência de mercado: {str(e)}")

    async def summarize_product_context(self, context: Dict[str, Any]) -> str:  # ✅ dentro da classe
        brands_text = ", ".join(context.get("top_brands", [])) or "Não identificadas"
        attributes_text = ""
        for attr in context.get("key_attributes", []):
            values = ", ".join(attr.get("values", []))
            attributes_text += f"- {attr['name']}: {values}\n"

        prompt = f"""
Com base nos dados reais do Mercado Livre, gere um resumo conciso (3-4 frases)
sobre o produto abaixo para orientar um vendedor no atendimento ao cliente.

Produto: {context.get('query')}
Categoria: {context.get('category_name')} ({context.get('category_path')})
Total de itens no mercado: {context.get('total_items_in_market', 0):,}
Principais marcas: {brands_text}
Atributos técnicos:
{attributes_text}

Seja direto e útil. Responda apenas o resumo, sem títulos ou formatação extra.
"""
        try:
            completion = self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama-3.3-70b-versatile",
                temperature=0.4,
                max_tokens=300
            )
            return completion.choices[0].message.content.strip()
        except Exception as e:
            raise RuntimeError(f"Erro ao gerar resumo: {str(e)}")

    async def answer_with_context(  # ✅ dentro da classe
        self, question: str, context: Dict[str, Any], tone: str
    ) -> Dict[str, Any]:
        brands_text = ", ".join(context.get("top_brands", [])) or "Não identificadas"
        attributes_text = ""
        for attr in context.get("key_attributes", []):
            values = ", ".join(attr.get("values", []))
            attributes_text += f"- {attr['name']}: {values}\n"

        system_prompt = f"""
Você é um assistente de vendas especializado no produto: {context.get('query')}.

DADOS REAIS DO PRODUTO (fonte: Mercado Livre):
- Categoria: {context.get('category_name')}
- Hierarquia: {context.get('category_path')}
- Volume de mercado: {context.get('total_items_in_market', 0):,} itens ativos
- Principais marcas: {brands_text}
- Atributos técnicos reais:
{attributes_text}

REGRAS OBRIGATÓRIAS:
1. Responda APENAS com base nos dados acima
2. Se não puder responder com esses dados, diga claramente que não tem essa informação
3. Nunca invente especificações, preços ou características
4. Tom da resposta: {tone}

Responda em JSON:
{{
  "answer": "Resposta para o cliente em português brasileiro",
  "sources": ["Atributo 1 usado", "Atributo 2 usado"],
  "confidence": "Alta" ou "Média" ou "Baixa"
}}
"""
        try:
            completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": question}
                ],
                model="llama-3.3-70b-versatile",
                response_format={"type": "json_object"},
                temperature=0.3,
                max_tokens=800
            )
            return json.loads(completion.choices[0].message.content)
        except Exception as e:
            raise RuntimeError(f"Erro ao responder com contexto: {str(e)}")


groq_service = GroqService()  # ✅ sempre por último