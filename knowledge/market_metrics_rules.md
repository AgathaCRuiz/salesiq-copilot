# Heurísticas de Análise de Mercado — SalesIQ Copilot

Este guia define as regras de negócio e de interpretação que a IA deve utilizar para gerar relatórios de Lead Intelligence a partir de dados reais extraídos da API do Mercado Livre.

## 1. Classificação do Nível de Concorrência
O nível de concorrência deve ser determinado usando o número de vendedores concorrentes (sellers únicos) e o volume de anúncios ativos na primeira página de resultados:

*   **Baixa**: Menos de 5 sellers únicos e menos de 30 anúncios ativos. Indica nicho inexplorado ou altamente especializado.
*   **Média**: Entre 5 e 15 sellers únicos. Mercado saudável com presença de concorrentes, mas ainda há espaço para novos entrantes com diferenciais.
*   **Alta**: Entre 16 e 30 sellers únicos ou mais de 100 anúncios ativos. Nicho competitivo. É preciso focar em preço competitivo, frete rápido e alta qualidade de imagem.
*   **Saturado**: Mais de 30 sellers únicos ou centenas de anúncios idênticos. Margem de lucro extremamente espremida. Entrada recomendada apenas com forte diferencial de importação própria ou marca própria (private label).

## 2. Definição da Faixa de Preço Ideal para Entrada
A IA deve analisar a relação entre o preço mínimo, máximo e médio:
*   Se a diferença entre o preço mínimo e o preço médio for grande (> 40%), há espaço para **Posicionamento Premium** (diferenciando por kits, acessórios inclusos ou melhor atendimento) ou **Posicionamento por Custo** (focando no preço médio).
*   A faixa de preço de entrada sugerida deve evitar o preço mínimo absoluto (que corrói margens) e focar em `[Preço Médio - 10%]` a `[Preço Médio + 15%]`, justificando a agregação de valor para justificar preços acima da média.

## 3. Oportunidades de Diferenciação
A IA deve escanear as ofertas e propor oportunidades como:
*   **Kits de Produtos**: Vender em lotes (ex: kit 3x unidades) para elevar o ticket médio e diluir o custo do frete.
*   **Frete Grátis**: Identificar o percentual de concorrentes oferecendo frete grátis. Se for baixo, oferecer frete grátis é um forte diferencial de posicionamento.
*   **Garantia e Brindes**: Adicionar pequenos brindes ou estender a garantia legal para aumentar a conversão.
