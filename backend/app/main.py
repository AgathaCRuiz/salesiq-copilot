from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import customer_service, market_analysis, copilot 

app = FastAPI(
    title="SalesIQ Copilot API",
    description="Backend para suporte a atendimento ao cliente e inteligência de mercado no e-commerce.",
    version="1.0.0"
)

# Configura CORS para permitir conexões do frontend local (Next.js rodando na porta 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em desenvolvimento, permite todas as origens. No entanto, é seguro limitar para o localhost do front se desejado.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclui os roteadores de módulos
app.include_router(customer_service.router)
app.include_router(market_analysis.router)
app.include_router(copilot.router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "SalesIQ Copilot API",
        "docs_url": "/docs"
    }
