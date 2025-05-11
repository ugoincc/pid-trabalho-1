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
      invert_color();
      break;
    case "fun2":
      applyRobertsFilter();
      break;
    case "fun3":
      applyFunction3();
      break;
    case "fun4":
      applyFunction4();
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
function transformDataVectorToMatrix(data, width, height) {
  const matrix = [];
  for (let i = 0; i < height; i++) {
    const row = [];
    for (let j = 0; j < width; j++) {

      const index = (i * width + j) * 4;
      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      const gray = 0.299 * red + 0.587 * green + 0.114 * blue;

      const pixel = {
        red: red,
        green: green,
        blue: blue,
        gray: gray,
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

function invert_color() {
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

    // Inverte as cores
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i]; // Red
      data[i + 1] = 255 - data[i + 1]; // Green
      data[i + 2] = 255 - data[i + 2]; // Blue
    }

    context.putImageData(imageData, 0, 0);
    preview.appendChild(canvas);

    const downloadContainer = document.querySelector(".download-container");
    downloadContainer.innerHTML = "";
    const downloadLink = createDownloadLink(canvas, "processed_image.png");
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

function applyFunction3() {
  const alteredImg = document.createElement("img");
  alteredImg.src = URL.createObjectURL(curFile);
  alteredImg.alt = alteredImg.title;
  preview.appendChild(alteredImg);
  const para = document.createElement("p");
  para.textContent = "Função 3 aplicada!";
  preview.appendChild(para);
}

function applyFunction4() {
  const alteredImg = document.createElement("img");
  alteredImg.src = URL.createObjectURL(curFile);
  alteredImg.alt = alteredImg.title;
  preview.appendChild(alteredImg);
  const para = document.createElement("p");
  para.textContent = "Função 4 aplicada!";
  preview.appendChild(para);
}
