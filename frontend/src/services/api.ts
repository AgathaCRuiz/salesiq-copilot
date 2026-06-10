const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface SimulationRequest {
  customer_message: string;
  niche: string;
  tone: string;
}

export interface SimulationResponse {
  suggested_response: string;
  tone_analysis: string;
  objection_handling: string;
  sales_arguments: string[];
}

export interface ProductItem {
  id: string | null;
  title: string | null;
  price: number | null;
  permalink: string | null;
  thumbnail: string | null;
  sold_quantity: number;
  free_shipping: boolean;
  condition: string;
}

export interface MarketMetrics {
  query: string;
  total_listings: number;
  sample_size: number;
  min_price: number;
  max_price: number;
  avg_price: number;
  unique_sellers: number;
  free_shipping_ratio: number;
  top_products: ProductItem[];
}

export interface MarketAnalysisReport {
  competition_level: string;
  competition_analysis: string;
  ideal_price_range: string;
  price_strategy: string;
  opportunities: string[];
  commercial_approach: string;
}

export interface MarketAnalysisResponse {
  metrics: MarketMetrics;
  analysis: MarketAnalysisReport;
}

export const api = {
  async simulateCustomerReply(data: SimulationRequest): Promise<SimulationResponse> {
    const response = await fetch(`${API_BASE_URL}/api/customer-service/simulate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Falha ao simular atendimento.');
    }

    return response.json();
  },

  async searchAndAnalyzeMarket(query: string): Promise<MarketAnalysisResponse> {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(`${API_BASE_URL}/api/market-analysis/search?q=${encodedQuery}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Falha ao buscar dados do mercado.');
    }

    return response.json();
  },
};
