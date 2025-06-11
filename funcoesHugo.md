## Transformação Logarítmica

### Efeitos Visuais Esperados:

- Áreas originalmente escuras ficam mais claras e detalhadas.

- Áreas originalmente claras mudam pouco.

- O contraste geral é redistribuído, favorecendo regiões de baixa intensidade.

## Operações Aritméticas

### Soma

A adição de imagens é feita pixel a pixel. Cada pixel da nova imagem é o resultado da soma dos pixels correspondentes nas imagens originais.

#### Finalidades:

- Mesclar Imagens

- Aumentar a Nitidez

- Reduzir Ruído

- Realçar Detalhes

### Subtração

Calcula a diferença de intensidade de pixel entre duas imagens de entrada. O resultado é o valor absoluto da diferença para evitar valores negativos.

#### Finalidades:

- Detecção de movimento

- Detecção de alterações

- Remoção de fundo

- Realce de características específicas

### Multiplicação

Multiplica os valores de intensidade de pixel de uma imagem pelos valores de pixel de outra imagem (pixel a pixel).

#### Finalidade:

- Correção de sombreamento: Compensar a iluminação não uniforme. Multiplicar a imagem original por uma imagem de "fundo claro" normalizada pode corrigir sombreamentos indesejados.

### Divisão

Divide os valores de intensidade de pixel pelos valores de pixel de outra imagem (pixel a pixel). Assim como na multiplicação, é importante lidar com divisões por zero, substituindo-as por um pequeno valor.

#### Finalidades:

- Normalização de iluminação

- Realce de textura

### Histograma (Escala de Cinza)

Um histograma é uma representação gráfica da distribuição de tons (ou cores) em uma imagem. Ele mostra quantos pixels têm um determinado valor de intensidade.

- Eixo X (horizontal): Representa os valores de intensidade dos pixels. Para imagens em escala de cinza, esses valores geralmente variam de 0 (preto puro) a 255 (branco puro).

- Eixo Y (vertical): Representa o número de pixels (ou a frequência) que possuem aquele valor de intensidade.

#### Finalidade:

- Análise da distribuição de brilho e contraste: Um histograma pode revelar se uma imagem é muito clara, muito escura, tem baixo contraste (pouca variação de tons) ou alto contraste.

### Equalização de Histograma

Equalizar é realçar o contraste da imagem de modo que detalhes que não eram perceptíveis anteriormente se tornem visíveis após a equalização.

Após a equalização, os dados no histograma aparecerão espalhados e a imagem terá um novo contraste.
