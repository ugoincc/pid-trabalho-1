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