import json
import os
from typing import Dict, Any
from groq import Groq
from app.core.config import settings

class GroqService:
    def __init__(self):
        # Inicializa o cliente apenas se a chave estiver configurada
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
        """
        Carrega o conteúdo de um arquivo da base de conhecimento.
        Se não existir, retorna um texto padrão para evitar falhas.
        """
        filepath = settings.KNOWLEDGE_DIR / filename
        if filepath.exists():
            try:
                return filepath.read_text(encoding="utf-8")
            except Exception:
                pass
        
        # Fallbacks embutidos caso os arquivos de conhecimento sumam
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
        """
        Gera uma sugestão de resposta inteligente para o atendimento ao cliente,
        usando contexto de vendas e tom selecionado.
        """
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
  "suggested_response": "A resposta exata sugerida para o vendedor copiar e colar (em português brasileiro). Deve incluir saudações adequadas, argumentos de valor específicos para o nicho, resolver objeções e terminar com um CTA atraente.",
  "tone_analysis": "Uma explicação curta de por que esse tom foi adequado e como ele foi implementado nesta resposta.",
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
            response_text = completion.choices[0].message.content
            return json.loads(response_text)
        except Exception as e:
            raise RuntimeError(f"Erro ao chamar a API da Groq: {str(e)}")

    async def analyze_market_metrics(self, metrics: Dict[str, Any]) -> Dict[str, Any]:
        """
        Interpreta métricas brutas da API do Mercado Livre e gera um relatório
        estruturado de Lead Intelligence usando as heurísticas de análise de mercado.
        """
        metrics_rules = self._load_knowledge_file("market_metrics_rules.md")

        system_prompt = f"""
Você é um analista de inteligência de mercado sênior focado em e-commerce.
Sua tarefa é interpretar as métricas agregadas da API pública do Mercado Livre e gerar um relatório estratégico para um vendedor que deseja entrar nesse nicho.

Métricas coletadas no Mercado Livre para o nicho "{metrics['query']}":
- Preço Médio: R$ {metrics['avg_price']}
- Preço Mínimo: R$ {metrics['min_price']}
- Preço Máximo: R$ {metrics['max_price']}
- Total de anúncios ativos estimados no ML: {metrics['total_listings']}
- Amostra analisada na primeira página: {metrics['sample_size']} anúncios
- Quantidade de Sellers concorrendo na amostra: {metrics['unique_sellers']}
- Taxa de anúncios com Frete Grátis na amostra: {int(metrics['free_shipping_ratio'] * 100)}%

Regras e diretrizes de interpretação de mercado (da base de conhecimento):
{metrics_rules}

Você DEVE responder obrigatoriamente em formato JSON com a seguinte estrutura:
{{
  "competition_level": "Baixa" ou "Média" ou "Alta" ou "Saturado",
  "competition_analysis": "Análise detalhada sobre os vendedores concorrentes, concorrência direta e concentração de anúncios.",
  "ideal_price_range": "Uma faixa de preço específica recomendada para entrada (ex: R$ 120,00 - R$ 145,00).",
  "price_strategy": "Justificativa da faixa de preço escolhida baseada nos preços mínimo, máximo e médio da concorrência.",
  "opportunities": ["Oportunidade 1 (ex: kits/combos)", "Oportunidade 2 (ex: explorar frete grátis)", "Oportunidade 3"],
  "commercial_approach": "Sugestão prática de abordagem comercial (ex: como redigir o título do anúncio, fotos, diferenciais que devem ser destacados no anúncio para se destacar)."
}}
        """

        try:
            completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Gere a análise para o nicho de produto: '{metrics['query']}'"}
                ],
                model="llama-3.3-70b-versatile",
                response_format={"type": "json_object"},
                temperature=0.5,
                max_tokens=1500
            )
            response_text = completion.choices[0].message.content
            return json.loads(response_text)
        except Exception as e:
            raise RuntimeError(f"Erro ao gerar a inteligência de mercado na Groq: {str(e)}")

groq_service = GroqService()
