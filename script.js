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
      aplicarFiltroRoberts();
      break;
    case "fun3":
      aplicarFiltroPrewitt()
      break;
    case "fun4":
      aplicarFiltroSobel();
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

// Funcao para encontrar o valor maximo e minimo de uma matriz
// pre-condicao: matriz e uma matriz de pixels
// pos-condicao: retorna o valor maximo e minimo da matriz
// A funcao percorre a matriz e encontra o valor maximo e minimo
function encontrarMaximoMinimo(matriz) {
  let valorMinimo = matriz[0][0];
  let valorMaximo = matriz[0][0];

  for (let i = 0; i < matriz.length; i++) {
    for (let j = 0; j < matriz[i].length; j++) {
      const valor = matriz[i][j];
      if (valor < valorMinimo) {
        valorMinimo = valor;
      }
      if (valor > valorMaximo) {
        valorMaximo = valor;
      }
    }
  }

  return { valorMinimo, valorMaximo };
}

// Funcao para converter o vetor de dados de Float32 para Uint8ClampedArray
// pre-condicao: data e um vetor de dados de imagem
// pos-condicao: retorna uma matriz de pixels em do tipo Uint8ClampedArray
function converterFloat32ParaUint8Clamped(output){
  const outputUint8Clamped = new Uint8ClampedArray(output.length);
  for (let i = 0; i < output.length; i++) {
    outputUint8Clamped[i] = output[i];
  }
  return outputUint8Clamped;
}

// Funcao para encontrar a mediana de um pixel em uma matriz 5x5
// pre-condicao: matriz e uma matriz de pixels e i e j sao as coordenadas do pixel
// pos-condicao: retorna a mediana dos valores dos pixels vizinhos
function encontrarMediana(matriz, i, j) {
  const valores = [];
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      const pixel = matriz[i + y][j + x];
      valores.push(pixel.vermelho);
    }
  }
  valores.sort((a, b) => a - b);
  const mediana = Math.round(valores[Math.floor(valores.length / 2)]);
  return mediana;
}

// Funcao para aplicar o filtro de escala de cinza
// pre-condicao: vetorPixelsRGBA e um vetor de dados de imagem e pixelsConvertidos e um vetor de dados de imagem vazio
// pos-condicao: retorna o vetor de dados de imagem convertido para escala de cinza
// A funcao percorre o vetor de dados de imagem e aplica a formula de conversao para escala de cinza
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

// Funcao para aplicar o filtro de mediana
// pre-condicao: Nenhuma
// pos-condicao: Aplica o filtro de mediana na imagem e exibe o resultado
// A funcao percorre a imagem e aplica o filtro de mediana em cada pixel
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

    for (let i = 1; i < altura -4; i++) {
      for (let j = 1; j < largura - 4; j++) {

        const mediana = encontrarMediana(matriz, i, j); 

        const index = ((i+1) * largura + (j+1)) * 4; 
        pixelsConvertidos[index] = mediana;      
        pixelsConvertidos[index + 1] = mediana;  
        pixelsConvertidos[index + 2] = mediana;  
        pixelsConvertidos[index + 3] = 255; // ignorando a opacidade 
      }
    }

    const imagemResultante = new ImageData(pixelsConvertidos, largura, altura);
    context.putImageData(imagemResultante, 0, 0);
    preview.appendChild(canvas);

    const downloadContainer = document.querySelector(".download-container");
    downloadContainer.innerHTML = "";
    const downloadLink = createDownloadLink(canvas, "imagem-filtrada-mediana.png");
    downloadContainer.appendChild(downloadLink);
  };
}

// Funcao para aplicar o filtro de Roberts
// pre-condicao: Nenhuma
// pos-condicao: Aplica o filtro de Roberts na imagem e exibe o resultado
// A funcao percorre a imagem e aplica o filtro de Roberts em cada pixel
function aplicarFiltroRoberts() {
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
    const pixelsConvertidos = new Float32Array(vetorPixelsRGBA.length);

    // -------------------- Convertendo o vetor extraido para escala de cinza -------------------- //
    aplicarEscalaCinza(vetorPixelsRGBA, pixelsConvertidos);
    // -------------------- A matriz recebe os pixels em escala de cinza ------------------------- //

    const matrix = transformarVetorMatriz(pixelsConvertidos, largura, altura);

    const kernel1 = [
      [-1, 0],
      [0, 1],
    ];

    const kernel2 = [
      [0, -1],
      [1, 0],
    ];

    const matrizRoberts = [];
    for (let i = 0; i < altura - 1; i++) {
      const row = [];
      for(let j = 0; j < largura - 1; j++){
      
        const G1 = (
        // mainDiagonal1
        matrix[i][j].vermelho * kernel1[0][0] +
        // secondaryDiagonal1   
        matrix[i][j + 1].vermelho * kernel1[0][1] +
        // secondaryDiagonal2
        matrix[i + 1][j].vermelho * kernel1[1][0] +
        // mainDiagonal2
        matrix[i + 1][j + 1].vermelho * kernel1[1][1]
        )
        
        const G2 = (
        // mainDiagonal1
        matrix[i][j].vermelho * kernel2[0][0] +
        // secondaryDiagonal1   
        matrix[i][j + 1].vermelho * kernel2[0][1] +
        // secondaryDiagonal2
        matrix[i + 1][j].vermelho * kernel2[1][0] +
        // mainDiagonal2
        matrix[i + 1][j + 1].vermelho * kernel2[1][1]
        )

        const valorResultante = Math.sqrt(G1 ** 2 + G2 ** 2);

        row.push(valorResultante);
      }
      matrizRoberts.push(row);    
    }
    
    const { valorMinimo: valorMinimoRoberts, valorMaximo: valorMaximoRoberts } = encontrarMaximoMinimo(matrizRoberts);

    const divisor = valorMaximoRoberts - valorMinimoRoberts || 1;

    for (let i = 0; i < matrizRoberts.length; i++) {
      for (let j = 0; j < matrizRoberts[0].length ; j++) {
        const magnitude = matrizRoberts[i][j];
        const valorNormalizado = Math.round(((magnitude - valorMinimoRoberts) / divisor) * 255);

        const index = (i * largura + j) * 4;
        pixelsConvertidos[index] = pixelsConvertidos[index + 1] = pixelsConvertidos[index + 2] = valorNormalizado;
        pixelsConvertidos[index + 3] = 255; 
      }
    }

    const saida = converterFloat32ParaUint8Clamped(pixelsConvertidos);

    const imagemResultante = new ImageData(saida, largura, altura);
    context.putImageData(imagemResultante, 0, 0);
    preview.appendChild(canvas);

    const downloadContainer = document.querySelector(".download-container");
    downloadContainer.innerHTML = "";
    const downloadLink = createDownloadLink(canvas, "imagem-filtrada-roberts.png");
    downloadContainer.appendChild(downloadLink);
  };
}

// Funcao para aplicar a convolucao em uma matriz
// pre-condicao: kernel e uma matriz de convolucao e matrix e uma matriz de pixels
// pos-condicao: retorna o valor da convolucao
// A funcao percorre a matriz e aplica a convolucao em cada pixel
function aplicarCorrelacao(kernel, matrix, x, y){
    let acumulator = 0;
    const tam = 3;
    for(let i = 0; i < tam; i++){
      for(let j = 0; j < tam; j++){
        acumulator += kernel[i][j] * matrix[i + y][j + x].vermelho;
      }
    }
    return acumulator;
}

// Funcao para aplicar o filtro de Prewitt
// pre-condicao: Nenhuma
// pos-condicao: Aplica o filtro de Prewitt na imagem e exibe o resultado
// A funcao percorre a imagem e aplica o filtro de Prewitt em cada pixel
function aplicarFiltroPrewitt() {
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
    const pixelsConvertidos = new Float32Array(vetorPixelsRGBA.length);
    
    // -------------------- Convertendo o vetor extraido para escala de cinza -------------------- //
    aplicarEscalaCinza(vetorPixelsRGBA, pixelsConvertidos);
    // -------------------- A matriz recebe os pixels em escala de cinza ------------------------- //

    const matriz = transformarVetorMatriz(pixelsConvertidos, largura, altura);

    const kernel1 = [
      [-1, 0, 1],
      [-1, 0, 1],
      [-1, 0, 1],
    ];

    const kernel2 = [
      [1,   1,  1],
      [0,   0,  0],
      [-1, -1, -1],
    ];

    const matrizPrewitt = [];
    for (let i = 0; i < altura - 2; i++) {
      const linha = [];
      for(let j = 0; j < largura - 2; j++){
        const G1 = aplicarCorrelacao(kernel1, matriz, j, i);

        const G2 = aplicarCorrelacao(kernel2, matriz, j, i);
        
        const magnitude = Math.sqrt(G1 ** 2 + G2 ** 2);


        linha.push(magnitude);
      }
      matrizPrewitt.push(linha);    
    }
    
    const { valorMinimo: valorMinimoPrewitt, valorMaximo: valorMaximoPrewitt } = encontrarMaximoMinimo(matrizPrewitt);

    const divisor = valorMaximoPrewitt - valorMinimoPrewitt || 1;

    for (let i = 0; i < matrizPrewitt.length; i++) {
      for (let j = 0; j < matrizPrewitt[0].length ; j++) {
        const magnitude = matrizPrewitt[i][j];
        const valorNormalizado = Math.round(((magnitude - valorMinimoPrewitt) / divisor) * 255);

        const index = (i * largura + j) * 4;
        pixelsConvertidos[index] = pixelsConvertidos[index + 1] = pixelsConvertidos[index + 2] = valorNormalizado;
        pixelsConvertidos[index + 3] = 255; 
      }
    }

    const saida = converterFloat32ParaUint8Clamped(pixelsConvertidos);

    const imagemResultante = new ImageData(saida, largura, altura);
    context.putImageData(imagemResultante, 0, 0);
    preview.appendChild(canvas);

    const downloadContainer = document.querySelector(".download-container");
    downloadContainer.innerHTML = "";
    const downloadLink = createDownloadLink(canvas, "imagem-resultante-prewitt.png");
    downloadContainer.appendChild(downloadLink);
  }
}

// Funcao para aplicar o filtro de Sobel
// pre-condicao: Nenhuma
// pos-condicao: Aplica o filtro de Sobel na imagem e exibe o resultado
// A funcao percorre a imagem e aplica o filtro de Sobel em cada pixel
function aplicarFiltroSobel() {
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
    const pixelsConvertidos = new Float32Array(vetorPixelsRGBA.length);
    
    // -------------------- Convertendo o vetor extraido para escala de cinza -------------------- //
    aplicarEscalaCinza(vetorPixelsRGBA, pixelsConvertidos);
    // -------------------- A matriz recebe os pixels em escala de cinza ------------------------- //

    const matriz = transformarVetorMatriz(pixelsConvertidos, largura, altura);

    const kernel1 = [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1],
    ];

    const kernel2 = [
      [-1, -2, -1],
      [0,   0,  0],
      [1,   2,  1],
    ];

    const matrizSobel = [];
    for (let i = 0; i < altura - 2; i++) {
      const linha = [];
      for(let j = 0; j < largura - 2; j++){
        const G1 = aplicarCorrelacao(kernel1, matriz, j, i);

        const G2 = aplicarCorrelacao(kernel2, matriz, j, i);
        
        const magnitude = Math.sqrt(G1 ** 2 + G2 ** 2);


        linha.push(magnitude);
      }
      matrizSobel.push(linha);    
    }
    
    const { valorMinimo: valorMinimoSobel, valorMaximo: valorMaximoSobel } = encontrarMaximoMinimo(matrizSobel);

    const divisor = valorMaximoSobel - valorMinimoSobel || 1;

    for (let i = 0; i < matrizSobel.length; i++) {
      for (let j = 0; j < matrizSobel[0].length ; j++) {
        const magnitude = matrizSobel[i][j];
        const valorNormalizado = Math.round(((magnitude - valorMinimoSobel) / divisor) * 255);

        const index = (i * largura + j) * 4;
        pixelsConvertidos[index] = pixelsConvertidos[index + 1] = pixelsConvertidos[index + 2] = valorNormalizado;
        pixelsConvertidos[index + 3] = 255; 
      }
    }

    const saida = converterFloat32ParaUint8Clamped(pixelsConvertidos);

    const imagemResultante = new ImageData(saida, largura, altura);
    context.putImageData(imagemResultante, 0, 0);
    preview.appendChild(canvas);

    const downloadContainer = document.querySelector(".download-container");
    downloadContainer.innerHTML = "";
    const downloadLink = createDownloadLink(canvas, "imagem-resultante-sobel.png");
    downloadContainer.appendChild(downloadLink);
  };
}



