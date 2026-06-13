const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ── Copiloto Integrado ────────────────────────────────────────────────────

export interface KeyAttributeCopilot {
  name: string;
  values: string[];
}

export interface ProductContext {
  query: string;
  category_id?: string;
  category_name?: string;
  category_path?: string;
  total_items_in_market: number;
  top_brands: string[];
  key_attributes: KeyAttributeCopilot[];
}

export interface InitResponse {
  context: ProductContext;
  summary: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  confidence?: string;
}

export interface ChatRequest {
  question: string;
  context: ProductContext;
  tone: string;
}

export interface ChatResponse {
  answer: string;
  sources: string[];
  confidence: string;
}
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

export interface RelatedCategory {
  id: string;
  name: string;
}

export interface KeyAttribute {
  name: string;
  values: string[];
}

export interface MarketMetrics {
  query: string;
  category_id?: string;
  category_name?: string;
  category_path?: string;
  total_items_in_market: number;
  related_categories: RelatedCategory[];
  top_brands: string[];
  key_attributes: KeyAttribute[];
  total_attributes: number;
  error?: string;
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
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Accept': 'application/json' },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Falha ao buscar dados do mercado.');
    }
    return response.json();
  },

  async initCopilot(query: string): Promise<InitResponse> {
    const response = await fetch(`${API_BASE_URL}/api/copilot/init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Falha ao carregar contexto do produto.');
    }
    return response.json();
  },

  async chatWithContext(data: ChatRequest): Promise<ChatResponse> {
    const response = await fetch(`${API_BASE_URL}/api/copilot/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Falha ao processar resposta.');
    }
    return response.json();
  },
};