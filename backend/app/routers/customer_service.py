from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from app.services.groq_service import groq_service

router = APIRouter(prefix="/api/customer-service", tags=["Atendimento"])

class SimulationRequest(BaseModel):
    customer_message: str = Field(
        ..., 
        description="Mensagem enviada pelo cliente",
        examples=["Gostaria de saber se o produto tem garantia e se vem com nota fiscal?"]
    )
    niche: str = Field(
        ..., 
        description="O nicho ou produto que está sendo vendido",
        examples=["Relógio Inteligente Smartwatch"]
    )
    tone: str = Field(
        "Profissional", 
        description="Tom de voz da resposta (Profissional, Amigável, Persuasivo)",
        examples=["Profissional"]
    )

class SimulationResponse(BaseModel):
    suggested_response: str
    tone_analysis: str
    objection_handling: str
    sales_arguments: list[str]

@router.post("/simulate", response_model=SimulationResponse, status_code=status.HTTP_200_OK)
async def simulate_customer_reply(request: SimulationRequest):
    """
    Simula o recebimento de uma mensagem do cliente e gera uma sugestão de resposta inteligente.
    """
    if not request.customer_message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A mensagem do cliente não pode estar vazia."
        )
    if not request.niche.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O nicho ou produto não pode estar vazio."
        )

    try:
        suggestion = await groq_service.generate_reply_suggestion(
            customer_message=request.customer_message,
            niche=request.niche,
            tone=request.tone
        )
        return suggestion
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
