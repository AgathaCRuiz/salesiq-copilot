from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
from app.services.ml_service import ml_service
from app.services.groq_service import groq_service

router = APIRouter(prefix="/api/copilot", tags=["Copiloto Integrado"])


# ── Modelos ──────────────────────────────────────────────────────────────────

class KeyAttribute(BaseModel):
    name: str
    values: List[str]


class ProductContext(BaseModel):
    query: str
    category_id: Optional[str] = None
    category_name: Optional[str] = None
    category_path: Optional[str] = None
    total_items_in_market: int = 0
    top_brands: List[str] = []
    key_attributes: List[KeyAttribute] = []


class InitRequest(BaseModel):
    query: str


class InitResponse(BaseModel):
    context: ProductContext
    summary: str  # resumo gerado pela IA sobre o produto


class ChatRequest(BaseModel):
    question: str
    context: ProductContext
    tone: str = "Profissional"


class ChatResponse(BaseModel):
    answer: str
    sources: List[str]  # quais atributos reais foram usados na resposta
    confidence: str     # Alta / Média / Baixa — baseado nos dados disponíveis


# ── Endpoints ────────────────────────────────────────────────────────────────

@router.post("/init", response_model=InitResponse, status_code=status.HTTP_200_OK)
async def init_product_context(request: InitRequest):
    """
    Passo 1: Vendedor define o produto/nicho.
    Busca dados reais no ML e retorna o contexto para o chat.
    """
    try:
        # Busca dados reais no ML
        market_data = await ml_service.search_market_data(request.query)

        if market_data.get("error"):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Produto não encontrado: {market_data['error']}"
            )

        # Monta contexto estruturado
        context = ProductContext(
            query=request.query,
            category_id=market_data.get("category_id"),
            category_name=market_data.get("category_name"),
            category_path=market_data.get("category_path"),
            total_items_in_market=market_data.get("total_items_in_market", 0),
            top_brands=market_data.get("top_brands", []),
            key_attributes=[
                KeyAttribute(name=a["name"], values=a["values"])
                for a in market_data.get("key_attributes", [])
            ]
        )

        # IA gera resumo do produto baseado nos dados reais
        summary = await groq_service.summarize_product_context(context.model_dump())

        return InitResponse(context=context, summary=summary)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/chat", response_model=ChatResponse, status_code=status.HTTP_200_OK)
async def chat_with_context(request: ChatRequest):
    """
    Passo 2: Cliente faz perguntas.
    Groq responde baseado nos dados reais do ML, não inventa.
    """
    try:
        response = await groq_service.answer_with_context(
            question=request.question,
            context=request.context.model_dump(),
            tone=request.tone
        )
        return response

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )