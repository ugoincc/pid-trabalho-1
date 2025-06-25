import { curFile, preview, createDownloadLink } from "./common.js";

// Função auxiliar para converter para escala de cinza usando fórmula luma
function converte_escala_de_cinza(dadosImagem) {
  const dados = dadosImagem.data;
  const largura = dadosImagem.width;
  const altura = dadosImagem.height;

  // Array para armazenar os valores em escala de cinza
  const dadosCinza = new Uint8Array(largura * altura);

  // Conversão para escala de cinza usando fórmula luma
  for (let i = 0, j = 0; i < dados.length; i += 4, j++) {
    // Y = 0.299R + 0.587G + 0.114B
    dadosCinza[j] = Math.round(
      dados[i] * 0.299 + dados[i + 1] * 0.587 + dados[i + 2] * 0.114
    );
  }

  return dadosCinza;
}

// Função atualizada de escala de cinza
export function escala_de_cinza() {
  const tela = document.createElement("canvas");
  tela.classList.add("styled-canva");
  const contexto = tela.getContext("2d");
  const imagem = new Image();
  imagem.src = URL.createObjectURL(curFile);

  imagem.onload = () => {
    tela.width = imagem.width;
    tela.height = imagem.height;
    contexto.drawImage(imagem, 0, 0);

    const dadosImagem = contexto.getImageData(0, 0, tela.width, tela.height);
    const dados = dadosImagem.data;

    // Usa a função auxiliar para converter para escala de cinza
    const dadosCinza = converte_escala_de_cinza(dadosImagem);

    // Aplica os valores de escala de cinza à imagem
    for (let i = 0, j = 0; i < dados.length; i += 4, j++) {
      dados[i] = dadosCinza[j]; // Vermelho
      dados[i + 1] = dadosCinza[j]; // Verde
      dados[i + 2] = dadosCinza[j]; // Azul
      // Não alteramos o canal Alpha (i + 3)
    }

    contexto.putImageData(dadosImagem, 0, 0);
    preview.appendChild(tela);

    const containerDownload = document.querySelector(".download-container");
    containerDownload.innerHTML = "";
    const linkDownload = createDownloadLink(tela, "imagem_escala_cinza.png");
    containerDownload.appendChild(linkDownload);
  };
}

// Função atualizada de limiarização adaptativa gaussiana
export function LimiarizacaoGaussiana() {
  const tela = document.createElement("canvas");
  tela.classList.add("styled-canva");
  const contexto = tela.getContext("2d");
  const imagem = new Image();
  imagem.src = URL.createObjectURL(curFile);

  imagem.onload = () => {
    tela.width = imagem.width;
    tela.height = imagem.height;
    contexto.drawImage(imagem, 0, 0);

    const dadosImagem = contexto.getImageData(0, 0, tela.width, tela.height);
    const dados = dadosImagem.data;
    const largura = tela.width;
    const altura = tela.height;

    // Usa a função auxiliar para converter para escala de cinza
    const dadosCinza = converte_escala_de_cinza(dadosImagem);

    // Parâmetros para a limiarização adaptativa
    const tamanhoBloco = 11; // Tamanho da vizinhança (deve ser ímpar)
    const C = 2; // Constante subtraída da média ou média ponderada

    // Aplica limiarização adaptativa gaussiana
    for (let y = 0; y < altura; y++) {
      for (let x = 0; x < largura; x++) {
        const indicePixel = y * largura + x;
        const valorPixel = dadosCinza[indicePixel];

        // Calcula média ponderada gaussiana da vizinhança
        let somaPonderada = 0;
        let somaPesos = 0;

        const metadeTamanhoBloco = Math.floor(tamanhoBloco / 2);

        for (let ny = -metadeTamanhoBloco; ny <= metadeTamanhoBloco; ny++) {
          for (let nx = -metadeTamanhoBloco; nx <= metadeTamanhoBloco; nx++) {
            const vizinhoY = Math.min(Math.max(y + ny, 0), altura - 1);
            const vizinhoX = Math.min(Math.max(x + nx, 0), largura - 1);
            const indiceVizinho = vizinhoY * largura + vizinhoX;

            // Peso gaussiano baseado na distância
            const distancia = Math.sqrt(nx * nx + ny * ny);
            const sigma = tamanhoBloco / 3;
            const peso = Math.exp(
              -(distancia * distancia) / (2 * sigma * sigma)
            );

            somaPonderada += dadosCinza[indiceVizinho] * peso;
            somaPesos += peso;
          }
        }

        // Calcula o limiar como média ponderada - C
        const limiar = Math.round(somaPonderada / somaPesos) - C;

        // Aplica o limiar
        const valorSaida = valorPixel > limiar ? 255 : 0;

        // Define o mesmo valor para R, G e B
        const i = indicePixel * 4;
        dados[i] = valorSaida; // Vermelho
        dados[i + 1] = valorSaida; // Verde
        dados[i + 2] = valorSaida; // Azul
        // Não alteramos o canal Alpha (i + 3)
      }
    }

    contexto.putImageData(dadosImagem, 0, 0);
    preview.appendChild(tela);

    const containerDownload = document.querySelector(".download-container");
    containerDownload.innerHTML = "";
    const linkDownload = createDownloadLink(
      tela,
      "imagem_limiarizacao_adaptativa.png"
    );
    containerDownload.appendChild(linkDownload);
  };
}

export function filtroPassaAlta() {
  const tela = document.createElement("canvas");
  tela.classList.add("styled-canva");
  const contexto = tela.getContext("2d");
  const imagem = new Image();
  imagem.src = URL.createObjectURL(curFile);

  imagem.onload = () => {
    tela.width = imagem.width;
    tela.height = imagem.height;
    contexto.drawImage(imagem, 0, 0);

    const dadosImagem = contexto.getImageData(0, 0, tela.width, tela.height);
    const dados = dadosImagem.data;
    const largura = tela.width;
    const altura = tela.height;

    // Usa a função auxiliar para converter para escala de cinza
    const dadosCinza = converte_escala_de_cinza(dadosImagem);

    // Kernel do filtro passa-alta (filtro laplaciano)
    const mascara = [
      [0, -1, 0],
      [-1, 4, -1],
      [0, -1, 0],
    ];

    const tamanhoMascara = 3;
    const metadeMascara = Math.floor(tamanhoMascara / 2);

    // Aplica o filtro passa-alta (convolução com a máscara)
    for (let y = 0; y < altura; y++) {
      for (let x = 0; x < largura; x++) {
        let soma = 0;

        // Aplica a máscara
        for (let my = 0; my < tamanhoMascara; my++) {
          for (let mx = 0; mx < tamanhoMascara; mx++) {
            const pixelY = Math.min(
              Math.max(y + (my - metadeMascara), 0),
              altura - 1
            );
            const pixelX = Math.min(
              Math.max(x + (mx - metadeMascara), 0),
              largura - 1
            );

            const indicePixel = pixelY * largura + pixelX;
            const valorMascara = mascara[my][mx];

            soma += dadosCinza[indicePixel] * valorMascara;
          }
        }

        // Adiciona 128 para melhor visualização (áreas planas ficam cinza médio)
        soma = soma + 128;

        // Normaliza o resultado para evitar valores fora do intervalo [0, 255]
        const valorSaida = Math.min(Math.max(Math.round(soma), 0), 255);

        // Aplica o valor filtrado à imagem original
        const i = (y * largura + x) * 4;
        dados[i] = valorSaida; // Vermelho
        dados[i + 1] = valorSaida; // Verde
        dados[i + 2] = valorSaida; // Azul
        // Não alteramos o canal Alpha (i + 3)
      }
    }

    contexto.putImageData(dadosImagem, 0, 0);
    preview.appendChild(tela);

    const containerDownload = document.querySelector(".download-container");
    containerDownload.innerHTML = "";
    const linkDownload = createDownloadLink(
      tela,
      "imagem_filtro_passa_alta.png"
    );
    containerDownload.appendChild(linkDownload);
  };
}

export function filtroPassaAltaAltoReforco() {
  const canvas = document.createElement("canvas");
  canvas.classList.add("styled-canva");
  const contexto = canvas.getContext("2d");
  const imagem = new Image();
  imagem.src = URL.createObjectURL(curFile);

  imagem.onload = () => {
    // Configuração do canvas com dimensões da imagem
    canvas.width = imagem.width;
    canvas.height = imagem.height;
    contexto.drawImage(imagem, 0, 0);

    // Obtenção dos dados da imagem
    const dadosImagem = contexto.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );
    const dados = dadosImagem.data;
    const largura = canvas.width;
    const altura = canvas.height;

    // Conversão para escala de cinza
    const dadosCinza = converte_escala_de_cinza(dadosImagem);

    // Array para armazenar o resultado processado
    const dadosResultado = new Uint8Array(dadosCinza.length);

    // Definição do kernel do filtro laplaciano (passa-alta)
    const kernel = [
      [0, -1, 0],
      [-1, 4, -1],
      [0, -1, 0],
    ];

    const tamanhoKernel = 3;
    const meioKernel = Math.floor(tamanhoKernel / 2);

    // Fator de amplificação para o alto reforço (valor > 1)
    const fatorAmplificacao = 1.5; // Ajuste este valor para controlar o nível de reforço

    // Aplicação do filtro passa-alta de alto reforço
    for (let y = 0; y < altura; y++) {
      for (let x = 0; x < largura; x++) {
        // Índice do pixel atual
        const indicePixel = y * largura + x;

        // Valor original do pixel em escala de cinza
        const valorOriginal = dadosCinza[indicePixel];

        // Cálculo do componente laplaciano (detecção de bordas)
        let somaLaplaciano = 0;

        // Aplicação do kernel para calcular o componente de alta frequência
        for (let ky = 0; ky < tamanhoKernel; ky++) {
          for (let kx = 0; kx < tamanhoKernel; kx++) {
            // Coordenadas do pixel vizinho
            const pixelY = Math.min(
              Math.max(y + (ky - meioKernel), 0),
              altura - 1
            );
            const pixelX = Math.min(
              Math.max(x + (kx - meioKernel), 0),
              largura - 1
            );

            // Índice do pixel vizinho
            const indiceVizinho = pixelY * largura + pixelX;

            // Valor do kernel na posição atual
            const valorKernel = kernel[ky][kx];

            // Soma ponderada com o kernel
            somaLaplaciano += dadosCinza[indiceVizinho] * valorKernel;
          }
        }

        // Fórmula do filtro de alto reforço: g(x,y) = A*f(x,y) - laplaciano
        // Onde:
        // - f(x,y) é a imagem original
        // - laplaciano é o componente de alta frequência
        // - A é o fator de amplificação
        let valorReforçado = valorOriginal + fatorAmplificacao * somaLaplaciano;

        // Normalização do resultado (garantir valores entre 0 e 255)
        dadosResultado[indicePixel] = Math.min(
          Math.max(Math.round(valorReforçado), 0),
          255
        );
      }
    }

    // Aplica os valores calculados à imagem de saída
    for (let i = 0, j = 0; i < dados.length; i += 4, j++) {
      dados[i] = dadosResultado[j]; // Canal Vermelho
      dados[i + 1] = dadosResultado[j]; // Canal Verde
      dados[i + 2] = dadosResultado[j]; // Canal Azul
      // O canal Alfa (i + 3) não é alterado
    }

    // Mostra a imagem processada no canvas
    contexto.putImageData(dadosImagem, 0, 0);
    preview.appendChild(canvas);

    // Cria o link para download da imagem processada
    const downloadContainer = document.querySelector(".download-container");
    downloadContainer.innerHTML = "";
    const downloadLink = createDownloadLink(canvas, "imagem_alto_reforco.png");
    downloadContainer.appendChild(downloadLink);
  };
}

export function filtroPassaBaixaMedia() {
  const canvas = document.createElement("canvas");
  canvas.classList.add("styled-canva");
  const contexto = canvas.getContext("2d");
  const imagem = new Image();
  imagem.src = URL.createObjectURL(curFile);

  imagem.onload = () => {
    
    canvas.width = imagem.width;
    canvas.height = imagem.height;
    contexto.drawImage(imagem, 0, 0);

    
    const dadosImagem = contexto.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );
    const dados = dadosImagem.data;
    const largura = canvas.width;
    const altura = canvas.height;

    
    const dadosCinza = converte_escala_de_cinza(dadosImagem);

    
    const dadosResultado = new Uint8Array(dadosCinza.length);

    // Definição do tamanho do kernel (aumentar para maior suavização)
    const tamanhoKernel = 5; // Kernel 5x5 para exemplo
    const meioKernel = Math.floor(tamanhoKernel / 2);

    // Criação do kernel de média 
    const kernel = [];
    const pesoTotal = tamanhoKernel * tamanhoKernel;
    const pesoIndividual = 1 / pesoTotal; // Normalização para manter brilho original

    for (let y = 0; y < tamanhoKernel; y++) {
      kernel.push([]);
      for (let x = 0; x < tamanhoKernel; x++) {
        kernel[y].push(pesoIndividual);
      }
    }

    // Aplicação do filtro de média
    for (let y = 0; y < altura; y++) {
      for (let x = 0; x < largura; x++) {
        
        const indicePixel = y * largura + x;

        // Cálculo da média dos pixels vizinhos
        let somaVizinhos = 0;

        // Aplicação do kernel para calcular a média
        for (let ky = 0; ky < tamanhoKernel; ky++) {
          for (let kx = 0; kx < tamanhoKernel; kx++) {
            // Coordenadas do pixel vizinho
            const pixelY = Math.min(
              Math.max(y + (ky - meioKernel), 0),
              altura - 1
            );
            const pixelX = Math.min(
              Math.max(x + (kx - meioKernel), 0),
              largura - 1
            );

            
            const indiceVizinho = pixelY * largura + pixelX;

            
            const valorKernel = kernel[ky][kx];

            
            somaVizinhos += dadosCinza[indiceVizinho] * valorKernel;
          }
        }

        // Armazena o valor médio calculado
        dadosResultado[indicePixel] = Math.round(somaVizinhos);
      }
    }

    // Aplica os valores calculados à imagem de saída
    for (let i = 0, j = 0; i < dados.length; i += 4, j++) {
      dados[i] = dadosResultado[j]; // Canal Vermelho
      dados[i + 1] = dadosResultado[j]; // Canal Verde
      dados[i + 2] = dadosResultado[j]; // Canal Azul
      
    }

    
    contexto.putImageData(dadosImagem, 0, 0);
    preview.appendChild(canvas);

   
    const downloadContainer = document.querySelector(".download-container");
    downloadContainer.innerHTML = "";
    const downloadLink = createDownloadLink(canvas, "imagem_passa_baixa.png");
    downloadContainer.appendChild(downloadLink);
  };
}
