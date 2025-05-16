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
      aplicarFiltroMediana();
      break;
    case "fun2":
      
      break;
    case "fun3":
      break;
    case "fun4":
      //applySobelFilter()
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

// Funcao para transformar o vetor de dados em uma matriz de pixels, onde cada pixel e um objeto com propriedades red, green, blue e gray
// pre-condicao: data e um vetor de dados de imagem e width e height sao as dimensoes da imagem
// pos-condicao: retorna uma matriz de pixels
function transformarVetorMatriz(data, largura, altura) {
  const matrix = [];
  for (let i = 0; i < altura; i++) {
    const row = [];
    for (let j = 0; j < largura; j++) {

      const index = (i * largura + j) * 4;
      const vermelho = data[index];
      const verde = data[index + 1];
      const azul = data[index + 2];
      const opacidade = 255;
      const pixel = {
        vermelho : vermelho,
        verde : verde,
        azul : azul,
        opacidade : opacidade,
      };

      row.push(pixel);
    }
    matrix.push(row);
  }
  return matrix;
}

function getMinMax(matrix) {
  let min = Infinity;
  let max = -Infinity;

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const val = matrix[i][j];
      if (val < min) min = val;
      if (val > max) max = val;
    }
  }

  return { min, max };
}

function convertFloat32ToUint8Clamped(output){
  const outputUint8Clamped = new Uint8ClampedArray(output.length);
  for (let i = 0; i < output.length; i++) {
    outputUint8Clamped[i] = output[i];
  }
  return outputUint8Clamped;
}

function encontrarMediana(matriz, i, j) {
  const valores = [];
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      const pixel = matriz[i + y][j + x];
      valores.push(pixel.vermelho);
    }
  }
  valores.sort((a, b) => a - b);
  const mediana = Math.round(valores[Math.floor(valores.length / 2)]);
  return mediana;
}

// Revisao de Conceito Basico
function aplicarEscalaCinza(vetorPixelsRGBA, pixelsConvertidos) {

    // Convercao para Escala de Cinza
    for(let i = 0; i < vetorPixelsRGBA.length; i += 4){
      
      valorEmCinza = 

        vetorPixelsRGBA[i] * 0.299 +   // Vermelho

        vetorPixelsRGBA[i + 1] * 0.587 + // Verde

        vetorPixelsRGBA[i + 2] * 0.114 // Azul      

      pixelsConvertidos[i] = pixelsConvertidos[i + 1] = pixelsConvertidos[i + 2] = valorEmCinza;

      // Nao estamos trabalhando com opacidade
      // Logo, configuramos para o valor maximo      
      pixelsConvertidos[i + 3] = 255; // Opacity
    }
}

function aplicarFiltroMediana() {
  const canvas = document.createElement("canvas");
  canvas.classList.add("styled-canva");
  const context = canvas.getContext("2d");
  const imagem = new Image();
  imagem.src = URL.createObjectURL(curFile);

  imagem.onload = () => {
    canvas.width = imagem.width;
    canvas.height = imagem.height;
    context.drawImage(imagem, 0, 0);
    const largura = canvas.width;
    const altura = canvas.height;
    const imageData = context.getImageData(0, 0, largura, altura);
    const vetorPixelsRGBA = imageData.data;
    const pixelsConvertidos = new Uint8ClampedArray(vetorPixelsRGBA.length);

    // -------------------- Convertendo o vetor extraido para escala de cinza -------------------- //
    aplicarEscalaCinza(vetorPixelsRGBA, pixelsConvertidos);

    // -------------------- A matriz recebe os pixels em escala de cinza ------------------------- //
    const matriz = transformarVetorMatriz(pixelsConvertidos, largura, altura);

    for (let i = 1; i < altura - 3; i++) {
      for (let j = 1; j < largura - 3; j++) {

        const mediana = encontrarMediana(matriz, i, j); 

        console.log(mediana);
        const index = ((i+1) * largura + (j+1)) * 4; 
        pixelsConvertidos[index] = mediana;      
        pixelsConvertidos[index + 1] = mediana;  
        pixelsConvertidos[index + 2] = mediana;  
        pixelsConvertidos[index + 3] = 255; // ignorando a opacidade 

        console.log(pixelsConvertidos[index]);
        console.log(pixelsConvertidos[index + 1]);
        console.log(pixelsConvertidos[index + 2]);
        console.log(pixelsConvertidos[index + 3]);
      }
    }

    const imagemResultante = new ImageData(pixelsConvertidos, largura, altura);
    context.putImageData(imagemResultante, 0, 0);
    preview.appendChild(canvas);

    const downloadContainer = document.querySelector(".download-container");
    downloadContainer.innerHTML = "";
    const downloadLink = createDownloadLink(canvas, "imagem-resultante-mediana.png");
    downloadContainer.appendChild(downloadLink);
  };
}

function applyRobertsFilter() {
  const canvas = document.createElement("canvas");
  canvas.classList.add("styled-canva");
  const context = canvas.getContext("2d");
  const img = new Image();
  img.src = URL.createObjectURL(curFile);

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);

    const width = canvas.width;
    const height = canvas.height;

    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;
    const output = new Uint8ClampedArray(data.length);
    const matrix = transformDataVectorToMatrix(data, width, height);

    const kernel1 = [
      [-1, 0],
      [0, 1],
    ];

    const kernel2 = [
      [0, -1],
      [1, 0],
    ];

    const magnitudeMatrix = [];
    for (let i = 0; i < height - 1; i++) {
      const row = [];
      for(let j = 0; j < width - 1; j++){
      
        const G1 = (
        // mainDiagonal1
        matrix[i][j].gray * kernel1[0][0] +
        // secondaryDiagonal1   
        matrix[i][j + 1].gray * kernel1[0][1] +
        // secondaryDiagonal2
        matrix[i + 1][j].gray * kernel1[1][0] +
        // mainDiagonal2
        matrix[i + 1][j + 1].gray * kernel1[1][1]
        )
        
        const G2 = (
        // mainDiagonal1
        matrix[i][j].gray * kernel2[0][0] +
        // secondaryDiagonal1   
        matrix[i][j + 1].gray * kernel2[0][1] +
        // secondaryDiagonal2
        matrix[i + 1][j].gray * kernel2[1][0] +
        // mainDiagonal2
        matrix[i + 1][j + 1].gray * kernel2[1][1]
        )

        const magnitude = Math.sqrt(G1 ** 2 + G2 ** 2);

        row.push(magnitude);
      }
      magnitudeMatrix.push(row);    
    }
    
    const { min: minMagnitude, max: maxMagnitude } = getMinMax(magnitudeMatrix);
    const divisor = maxMagnitude - minMagnitude || 1;

    for (let i = 0; i < magnitudeMatrix.length; i++) {
      for (let j = 0; j < magnitudeMatrix[0].length ; j++) {
        const magnitude = magnitudeMatrix[i][j];
        const normalized = Math.round(((magnitude - minMagnitude) / divisor) * 255);

        const index = (i * width + j) * 4;
        output[index] = output[index + 1] = output[index + 2] = normalized;
        output[index + 3] = 255; 
      }
    }

    const resultImage = new ImageData(output, width, height);
    context.putImageData(resultImage, 0, 0);
    preview.appendChild(canvas);

    const downloadContainer = document.querySelector(".download-container");
    downloadContainer.innerHTML = "";
    const downloadLink = createDownloadLink(canvas, "roberts_filtered.png");
    downloadContainer.appendChild(downloadLink);
  };
}

function convolve(kernel, matrix, x, y){
    let acumulator = 0;
    const tam = 3;
    for(let i = 0; i < tam; i++){
      for(let j = 0; j < tam; j++){
        acumulator += kernel[i][j] * matrix[i + y][j + x].gray;
      }
    }
    return acumulator;
}

function applySobelFilter() {
  const canvas = document.createElement("canvas");
  canvas.classList.add("styled-canva");
  const context = canvas.getContext("2d");
  const img = new Image();
  img.src = URL.createObjectURL(curFile);

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);

    const width = canvas.width;
    const height = canvas.height;

    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;
    const output = new Uint8ClampedArray(data.length);
    const matrix = transformDataVectorToMatrix(data, width, height);

    const kernel1 = [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1],
    ];

    const kernel2 = [
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1],
    ];

    const magnitudeMatrix = [];
    for (let i = 0; i < height - 2; i++) {
      const row = [];
      for(let j = 0; j < width - 2; j++){
        const G1 = convolve(kernel1, matrix, j, i);

        const G2 = convolve(kernel2, matrix, j, i);
        
        const magnitude = Math.sqrt(G1 ** 2 + G2 ** 2);

        row.push(magnitude);
      }
      magnitudeMatrix.push(row);    
    }
    
    const { min: minMagnitude, max: maxMagnitude } = getMinMax(magnitudeMatrix);
    const divisor = maxMagnitude - minMagnitude || 1;

    for (let i = 0; i < magnitudeMatrix.length; i++) {
      for (let j = 0; j < magnitudeMatrix[0].length ; j++) {
        const magnitude = magnitudeMatrix[i][j];
        const normalized = Math.round(((magnitude - minMagnitude) / divisor) * 255);

        const index = (i * width + j) * 4;
        output[index] = output[index + 1] = output[index + 2] = normalized;
        output[index + 3] = 255; 
      }
    }

    const resultImage = new ImageData(output, width, height);
    context.putImageData(resultImage, 0, 0);
    preview.appendChild(canvas);

    const downloadContainer = document.querySelector(".download-container");
    downloadContainer.innerHTML = "";
    const downloadLink = createDownloadLink(canvas, "sobel_filtered.png");
    downloadContainer.appendChild(downloadLink);
  };
}



