## Limiarização

A **limiarização** é uma técnica de processamento de imagens utilizada para segmentar uma imagem em regiões de interesse com base em um determinado valor de limiar. Essa técnica permite a separação de objetos do fundo da imagem, facilitando a análise e extração de informações relevantes.

O conceito central da limiarização consiste em definir um valor de corte (limiar) a partir do qual os pixels da imagem são classificados em apenas dois valores: **0** (preto) ou **255** (branco). Os pixels com intensidade maior que o limiar são convertidos em branco (255), enquanto os que têm intensidade menor ou igual ao limiar são convertidos em preto (0).

---

## Limiarização Adaptativa

Diferentemente da limiarização global, a **limiarização adaptativa** divide a imagem em pequenas regiões, calculando um valor de limiar específico para cada uma delas. Isso torna a técnica mais eficaz em imagens com **iluminação irregular**.

### Tipos de Limiarização Adaptativa

#### - Limiarização por Média

Nesse método, o limiar local é calculado pela **média simples** dos valores de intensidade dos pixels dentro da vizinhança definida.

**Sensibilidade a Ruído:**  
Pode ser mais sensível a ruídos e outliers, já que todos os pixels da vizinhança têm o mesmo peso no cálculo da média.

#### - Limiarização Gaussiana

A limiarização gaussiana utiliza uma **média ponderada** com base em uma função gaussiana. Os pixels mais próximos ao centro da vizinhança recebem pesos maiores, enquanto os mais distantes têm menos influência.

**Funcionamento:**
- Para cada pixel, define-se uma vizinhança ao seu redor.
- Calcula-se uma média ponderada dos pixels, com maior peso nos centrais.
- Compara-se o valor do pixel central com esse limiar local.
- Repete-se o processo para cada pixel da imagem.

**Robustez a Ruído:**  
É mais robusta a ruídos e outliers do que a limiarização por média, pois o peso reduzido dos pixels distantes minimiza sua influência no resultado.

# Escala de Cinza

## Composição de Imagens Coloridas

Uma **imagem colorida** é composta por **três canais de cor**:
- **Vermelho (R)**
- **Verde (G)**
- **Azul (B)**

## Funcionamento da Escala de Cinza

### O que a escala de cinza faz?

A escala de cinza transforma um pixel colorido em um único valor numérico que representa o nível de brilho (luminosidade).

**Exemplo:**
Um pixel colorido `[123, 85, 201]` (onde R = 123, G = 85, B = 201) seria convertido para um valor aproximado de `115` em escala de cinza.

### Método de Conversão

A conversão é realizada através de uma média ponderada que considera a sensibilidade do olho humano a cada canal de cor.

#### Fórmula de Luma

```
cinza = 0.299 * R + 0.587 * G + 0.114 * B
```

Esta fórmula atribui diferentes pesos a cada canal de cor:
- O canal verde recebe o maior peso (0.587) devido à maior sensibilidade do olho humano a esta cor
- O canal vermelho recebe um peso intermediário (0.299)
- O canal azul recebe o menor peso (0.114)

Ao aplicar essa ponderação, a escala de cinza resultante preserva melhor a percepção humana de luminosidade da imagem original.

