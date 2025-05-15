const input = document.querySelector("#imagem");
const preview = document.querySelector(".single-output");

let curFile = null;

input.addEventListener("change", () => {
  curFile = input.files[0];
  updateImageDisplay();
});

functionSelector.addEventListener("change", () => {
  if (curFile) {
    const selectedFunction = functionSelector.value;
    handleImageFunction(selectedFunction);
  } else {
    alert("Selecione uma imagem antes de aplicar uma operação.");
  }
});

function updateImageDisplay() {
  preview.innerHTML = "";
  const curFile = input.files[0];
  if (!curFile) {
    const para = document.createElement("p");
    para.textContent = "Arquivo não selecionado";
    preview.appendChild(para);
  } else {
    const outputImg = document.createElement("img");
    outputImg.src = URL.createObjectURL(curFile);
    outputImg.alt = outputImg.title;
    preview.appendChild(outputImg);
  }
}

function handleImageFunction(selectedFunction) {
  preview.innerHTML = "";
  switch (selectedFunction) {
    case "fun1":
      LimiarizacaoGaussiana();
      break;
    case "fun2":
      escala_de_cinza();
      break;
    case "fun3":
      filtroPassaAlta();
      break;
    case "fun4":
      filtroPassaAltaAltoReforco();
      break;
    case "fun5":
      filtroPassaBaixaMedia();
      break;
    default:
      const para = document.createElement("p");
      para.textContent = "Nenhuma função selecionada.";
      preview.appendChild(para);
  }
}

function createDownloadLink(canvas, filename = "imagem.png") {
  const downloadLink = document.createElement("a");
  downloadLink.href = canvas.toDataURL();
  downloadLink.download = filename;
  downloadLink.textContent = "Download da Imagem";
  downloadLink.classList = "custom-button";

  return downloadLink;
}

// Função auxiliar para converter para escala de cinza usando fórmula luma
function converte_escala_de_cinza(imageData) {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  
  // Array para armazenar os valores em escala de cinza
  const grayData = new Uint8Array(width * height);
  
  // Conversão para escala de cinza usando fórmula luma
  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    // Y = 0.299R + 0.587G + 0.114B
    grayData[j] = Math.round(data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
  }
  
  return grayData;
}

// Função atualizada de escala de cinza
function escala_de_cinza() {
  const canvas = document.createElement("canvas");
  canvas.classList.add("styled-canva");
  const context = canvas.getContext("2d");
  const img = new Image();
  img.src = URL.createObjectURL(curFile);
  
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);
    
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Usa a função auxiliar para converter para escala de cinza
    const grayData = converte_escala_de_cinza(imageData);
    
    // Aplica os valores de escala de cinza à imagem
    for (let i = 0, j = 0; i < data.length; i += 4, j++) {
      data[i] = grayData[j];     // Red
      data[i + 1] = grayData[j]; // Green
      data[i + 2] = grayData[j]; // Blue
      // Não alteramos o canal Alpha (i + 3)
    }
    
    context.putImageData(imageData, 0, 0);
    preview.appendChild(canvas);
    
    const downloadContainer = document.querySelector(".download-container");
    downloadContainer.innerHTML = "";
    const downloadLink = createDownloadLink(canvas, "grayscale_image.png");
    downloadContainer.appendChild(downloadLink);
  };
}

// Função atualizada de limiarização adaptativa gaussiana
function LimiarizacaoGaussiana() {
  const canvas = document.createElement("canvas");
  canvas.classList.add("styled-canva");
  const context = canvas.getContext("2d");
  const img = new Image();
  img.src = URL.createObjectURL(curFile);
  
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);
    
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;
    
    // Usa a função auxiliar para converter para escala de cinza
    const grayData = converte_escala_de_cinza(imageData);
    
    // Parâmetros para a limiarização adaptativa
    const blockSize = 11; // Tamanho da vizinhança (deve ser ímpar)
    const C = 2; // Constante subtraída da média ou média ponderada
    
    // Aplica limiarização adaptativa gaussiana
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixelIndex = y * width + x;
        const pixelValue = grayData[pixelIndex];
        
        // Calcula média ponderada gaussiana da vizinhança
        let weightedSum = 0;
        let weightSum = 0;
        
        const halfBlockSize = Math.floor(blockSize / 2);
        
        for (let ny = -halfBlockSize; ny <= halfBlockSize; ny++) {
          for (let nx = -halfBlockSize; nx <= halfBlockSize; nx++) {
            const neighborY = Math.min(Math.max(y + ny, 0), height - 1);
            const neighborX = Math.min(Math.max(x + nx, 0), width - 1);
            const neighborIndex = neighborY * width + neighborX;
            
            // Peso gaussiano baseado na distância
            const distance = Math.sqrt(nx * nx + ny * ny);
            const sigma = blockSize / 3;
            const weight = Math.exp(-(distance * distance) / (2 * sigma * sigma));
            
            weightedSum += grayData[neighborIndex] * weight;
            weightSum += weight;
          }
        }
        
        // Calcula o limiar como média ponderada - C
        const threshold = Math.round(weightedSum / weightSum) - C;
        
        // Aplica o limiar
        const outputValue = pixelValue > threshold ? 255 : 0;
        
        // Define o mesmo valor para R, G e B
        const i = pixelIndex * 4;
        data[i] = outputValue;     // Red
        data[i + 1] = outputValue; // Green
        data[i + 2] = outputValue; // Blue
        // Não alteramos o canal Alpha (i + 3)
      }
    }
    
    context.putImageData(imageData, 0, 0);
    preview.appendChild(canvas);
    
    const downloadContainer = document.querySelector(".download-container");
    downloadContainer.innerHTML = "";
    const downloadLink = createDownloadLink(canvas, "adaptive_threshold_image.png");
    downloadContainer.appendChild(downloadLink);
  };
}


function filtroPassaAlta() {
  const canvas = document.createElement("canvas");
  canvas.classList.add("styled-canva");
  const context = canvas.getContext("2d");
  const img = new Image();
  img.src = URL.createObjectURL(curFile);
  
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);
    
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;
    
    // Usa a função auxiliar para converter para escala de cinza
    const grayData = converte_escala_de_cinza(imageData);
    
    // Kernel do filtro passa-alta (filtro laplaciano)
    const kernel = [
      [0, -1, 0],
      [-1, 4, -1],
      [0, -1, 0]
    ];
    
    const kernelSize = 3;
    const kernelHalf = Math.floor(kernelSize / 2);
    
    // Aplica o filtro passa-alta (convolução com o kernel)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let sum = 0;
        
        // Aplica o kernel
        for (let ky = 0; ky < kernelSize; ky++) {
          for (let kx = 0; kx < kernelSize; kx++) {
            const pixelY = Math.min(Math.max(y + (ky - kernelHalf), 0), height - 1);
            const pixelX = Math.min(Math.max(x + (kx - kernelHalf), 0), width - 1);
            
            const pixelIndex = pixelY * width + pixelX;
            const kernelValue = kernel[ky][kx];
            
            sum += grayData[pixelIndex] * kernelValue;
          }
        }
        
        // Adiciona 128 para melhor visualização (áreas planas ficam cinza médio)
        sum = sum + 128;
        
        // Normaliza o resultado para evitar valores fora do intervalo [0, 255]
        const outputValue = Math.min(Math.max(Math.round(sum), 0), 255);
        
        // Aplica o valor filtrado à imagem original
        const i = (y * width + x) * 4;
        data[i] = outputValue;     // Red
        data[i + 1] = outputValue; // Green
        data[i + 2] = outputValue; // Blue
        // Não alteramos o canal Alpha (i + 3)
      }
    }
    
    context.putImageData(imageData, 0, 0);
    preview.appendChild(canvas);
    
    const downloadContainer = document.querySelector(".download-container");
    downloadContainer.innerHTML = "";
    const downloadLink = createDownloadLink(canvas, "highpass_filter_image.png");
    downloadContainer.appendChild(downloadLink);
  };
}

function filtroPassaAltaAltoReforco() {
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
    const dadosImagem = contexto.getImageData(0, 0, canvas.width, canvas.height);
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
      [0, -1, 0]
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
            const pixelY = Math.min(Math.max(y + (ky - meioKernel), 0), altura - 1);
            const pixelX = Math.min(Math.max(x + (kx - meioKernel), 0), largura - 1);
            
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
        let valorReforçado = fatorAmplificacao * valorOriginal - somaLaplaciano;
        
        // Normalização do resultado (garantir valores entre 0 e 255)
        dadosResultado[indicePixel] = Math.min(Math.max(Math.round(valorReforçado), 0), 255);
      }
    }
    
    // Aplica os valores calculados à imagem de saída
    for (let i = 0, j = 0; i < dados.length; i += 4, j++) {
      dados[i] = dadosResultado[j];     // Canal Vermelho
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

function filtroPassaBaixaMedia() {
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
    const dadosImagem = contexto.getImageData(0, 0, canvas.width, canvas.height);
    const dados = dadosImagem.data;
    const largura = canvas.width;
    const altura = canvas.height;
    
    // Conversão para escala de cinza (opcional, dependendo da aplicação)
    const dadosCinza = converte_escala_de_cinza(dadosImagem);
    
    // Array para armazenar o resultado processado
    const dadosResultado = new Uint8Array(dadosCinza.length);
    
    // Definição do tamanho do kernel (aumentar para maior suavização)
    const tamanhoKernel = 5; // Kernel 5x5 para exemplo
    const meioKernel = Math.floor(tamanhoKernel / 2);
    
    // Criação do kernel de média (todos os valores têm peso igual)
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
        // Índice do pixel atual
        const indicePixel = y * largura + x;
        
        // Cálculo da média dos pixels vizinhos
        let somaVizinhos = 0;
        
        // Aplicação do kernel para calcular a média
        for (let ky = 0; ky < tamanhoKernel; ky++) {
          for (let kx = 0; kx < tamanhoKernel; kx++) {
            // Coordenadas do pixel vizinho
            const pixelY = Math.min(Math.max(y + (ky - meioKernel), 0), altura - 1);
            const pixelX = Math.min(Math.max(x + (kx - meioKernel), 0), largura - 1);
            
            // Índice do pixel vizinho
            const indiceVizinho = pixelY * largura + pixelX;
            
            // Valor do kernel na posição atual
            const valorKernel = kernel[ky][kx];
            
            // Soma ponderada com o kernel
            somaVizinhos += dadosCinza[indiceVizinho] * valorKernel;
          }
        }
        
        // Armazena o valor médio calculado
        dadosResultado[indicePixel] = Math.round(somaVizinhos);
      }
    }
    
    // Aplica os valores calculados à imagem de saída
    for (let i = 0, j = 0; i < dados.length; i += 4, j++) {
      dados[i] = dadosResultado[j];     // Canal Vermelho
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
    const downloadLink = createDownloadLink(canvas, "imagem_passa_baixa.png");
    downloadContainer.appendChild(downloadLink);
  };
}