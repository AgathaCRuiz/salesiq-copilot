from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from app.services.ml_service import ml_service
from app.services.groq_service import groq_service

router = APIRouter(prefix="/api/market-analysis", tags=["Inteligência de Mercado"])


class RelatedCategory(BaseModel):
    id: str
    name: str


class KeyAttribute(BaseModel):
    name: str
    values: List[str]


class MarketMetrics(BaseModel):
    query: str
    category_id: Optional[str] = None
    category_name: Optional[str] = None
    category_path: Optional[str] = None
    total_items_in_market: int = 0
    related_categories: List[RelatedCategory] = []
    top_brands: List[str] = []
    key_attributes: List[KeyAttribute] = []
    total_attributes: int = 0
    error: Optional[str] = None


class MarketAnalysisReport(BaseModel):
    competition_level: str
    competition_analysis: str
    ideal_price_range: str
    price_strategy: str
    opportunities: List[str]
    commercial_approach: str


class MarketAnalysisResponse(BaseModel):
    metrics: MarketMetrics
    analysis: MarketAnalysisReport


@router.get("/search", response_model=MarketAnalysisResponse, status_code=status.HTTP_200_OK)
async def search_and_analyze_market(
    q: str = Query(..., min_length=2, description="Termo de busca (ex: smartwatch)")
):
    """
    Busca dados reais no Mercado Livre e gera relatório inteligente de mercado.
    """
    try:
        # 1. Busca dados no ML
        metrics = await ml_service.search_market_data(q)

        # 2. Categoria não encontrada
        if metrics.get("error"):
            return {
                "metrics": metrics,
                "analysis": {
                    "competition_level": "Indeterminado",
                    "competition_analysis": metrics["error"],
                    "ideal_price_range": "N/A",
                    "price_strategy": "Sem dados suficientes.",
                    "opportunities": [],
                    "commercial_approach": "Tente refinar sua busca."
                }
            }

        # 3. IA analisa os dados
        analysis = await groq_service.analyze_market_metrics(metrics)

        return {
            "metrics": metrics,
            "analysis": analysis
        }

    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))