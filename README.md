# SalesIQ Copilot

SalesIQ Copilot é um projeto de demonstração que combina um backend Python com um frontend Next.js para suportar inteligência de mercado, atendimento a clientes e análise de produtos reais do Mercado Livre.

## O que este projeto faz

- Integra dados do Mercado Livre para gerar contexto de mercado real.
- Cria recomendações e resumos de produto com IA baseada em dados concretos.
- Oferece um chat Copilot para responder perguntas de clientes com base em contexto de venda.
- Inclui uma nova aba `Copilot` no frontend para iniciar atendimento assistido.

## Estrutura do repositório

- `backend/` - API FastAPI em Python, com rotas de atendimento, análise de mercado e Copilot.
- `frontend/` - App Next.js com interface de vendas, visualização de métricas e Copilot.
- `knowledge/` - Documentação de regras de métricas de mercado e contexto de vendas.

## Principais recursos

- `GET /` - status básico da API.
- `POST /api/copilot/init` - inicializa contexto do produto Mercado Livre.
- `POST /api/copilot/chat` - responde perguntas com base no contexto do produto.
- `Copilot page` no frontend para carregar produto, conversar e ver dados de confiança.

## Rodando o projeto

### Backend

1. Abra um terminal em `backend/`
2. Crie e ative seu ambiente Python (opcional, recomendado)
   - Windows: `python -m venv .venv` e `.\.venv\Scripts\activate`
   - macOS/Linux: `python3 -m venv .venv` e `source .venv/bin/activate`
3. Instale dependências:

```bash
pip install -r requirements.txt
```

4. Inicie o servidor:

```bash
python run.py
```

5. A API estará disponível em `http://127.0.0.1:8000`

### Frontend

1. Abra um terminal em `frontend/`
2. Instale dependências:

```bash
npm install
```

3. Execute o app:

```bash
npm run dev
```

4. Abra `http://localhost:3000`

## Configurações opcionais

- O backend carrega variáveis do arquivo `.env` em `backend/`.
- Você pode definir `HOST` e `PORT` para alterar o endereço do servidor.
- No desenvolvimento, o CORS está configurado para permitir o frontend local.

## Quando usar

Use este projeto para validar:

- Provas de conceito com integração Mercado Livre
- Demonstração de chat assistido com contexto real
- Prototipagem de ferramentas de vendas e atendimento

## Tecnologias usadas

- Backend: Python, FastAPI, Uvicorn, Pydantic, httpx, groq
- Frontend: Next.js, React, Tailwind CSS, Recharts

## Como contribuir

1. Abra uma issue descrevendo o que deseja melhorar.
2. Faça um fork e crie uma branch de feature.
3. Adicione mudanças e teste localmente.
4. Envie um pull request com uma descrição clara.

---

Se quiser, posso também melhorar o README do `frontend/README.md` para refletir a aplicação real e remover o conteúdo padrão do Next.js.