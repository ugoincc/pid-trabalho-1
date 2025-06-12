import {
  curFile,
  secondaryFile,
  preview,
  createDownloadLink,
} from "./common.js";

function getImg(curFile = curFile) {
  const canvas = document.createElement("canvas");
  canvas.classList.add("styled-canva");
  const context = canvas.getContext("2d");
  const img = new Image();
  img.src = URL.createObjectURL(curFile);
  return { canvas, context, img };
}

function toGrayScale(imageData) {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = data[i + 1] = data[i + 2] = avg;
  }
  return imageData;
}

export function processImageOperation(operationType) {
  if (!curFile || !secondaryFile) {
    console.log("Selecione **duas** imagens para a função.");
    return;
  }

  const { canvas: canvas1, context: context1, img: img1 } = getImg(curFile);
  const {
    canvas: canvas2,
    context: context2,
    img: img2,
  } = getImg(secondaryFile);

  let imagesLoaded = 0;

  const checkAndProcess = () => {
    imagesLoaded++;
    if (imagesLoaded === 2) {
      preview.innerHTML = "";

      canvas1.width = img1.width;
      canvas1.height = img1.height;
      context1.drawImage(img1, 0, 0);

      canvas2.width = img2.width;
      canvas2.height = img2.height;
      context2.drawImage(img2, 0, 0);

      if (img1.width !== img2.width || img1.height !== img2.height) {
        console.error(
          "Erro: As imagens devem ter as mesmas dimensões para esta operação. Redimensione-as ou selecione imagens de mesmo tamanho."
        );
        return;
      }

      const outCanvas = document.createElement("canvas");
      outCanvas.classList.add("styled-canva");
      const outCtx = outCanvas.getContext("2d");

      outCanvas.width = img1.width;
      outCanvas.height = img1.height;

      const imageData1 = context1.getImageData(
        0,
        0,
        outCanvas.width,
        outCanvas.height
      );
      const imageData2 = context2.getImageData(
        0,
        0,
        outCanvas.width,
        outCanvas.height
      );
      const resultImageData = outCtx.createImageData(
        outCanvas.width,
        outCanvas.height
      );

      const pixels1 = imageData1.data;
      const pixels2 = imageData2.data;
      const resultPixels = resultImageData.data;

      let operationTitle = "";
      let filenameSuffix = "";

      for (let i = 0; i < pixels1.length; i += 4) {
        const r1 = pixels1[i];
        const g1 = pixels1[i + 1];
        const b1 = pixels1[i + 2];
        const a1 = pixels1[i + 3];

        const r2 = pixels2[i];
        const g2 = pixels2[i + 1];
        const b2 = pixels2[i + 2];

        switch (operationType) {
          case "sum":
            resultPixels[i] = Math.round((r1 + r2) / 2);
            resultPixels[i + 1] = Math.round((g1 + g2) / 2);
            resultPixels[i + 2] = Math.round((b1 + b2) / 2);
            resultPixels[i + 3] = a1;
            operationTitle = "Resultado da Soma (Redução de Ruído):";
            filenameSuffix = "sum_image(noise_reduction).png";
            break;
          case "sub":
            resultPixels[i] = Math.abs(r1 - r2);
            resultPixels[i + 1] = Math.abs(g1 - g2);
            resultPixels[i + 2] = Math.abs(b1 - b2);
            resultPixels[i + 3] = a1;
            operationTitle = "Resultado da Subtração:";
            filenameSuffix = "sub_image.png";
            break;
          case "multiply":
            resultPixels[i] = Math.round((r1 * r2) / 255);
            resultPixels[i + 1] = Math.round((g1 * g2) / 255);
            resultPixels[i + 2] = Math.round((b1 * b2) / 255);
            resultPixels[i + 3] = a1;
            operationTitle =
              "Resultado da Multiplicação (Correção de Sombreamento):";
            filenameSuffix = "multiplied_image(shading_correction).png";
            break;
          case "divide":
            const divisorR = r2 === 0 ? 1e-6 : r2;
            const divisorG = g2 === 0 ? 1e-6 : g2;
            const divisorB = b2 === 0 ? 1e-6 : b2;
            resultPixels[i] = Math.round((r1 / divisorR) * 255);
            resultPixels[i + 1] = Math.round((g1 / divisorG) * 255);
            resultPixels[i + 2] = Math.round((b1 / divisorB) * 255);
            resultPixels[i + 3] = a1;
            operationTitle = "Resultado da Divisão:";
            filenameSuffix = "divided_image.png";
            break;
          default:
            console.error("Tipo de operação desconhecido.");
            return;
        }
      }

      outCtx.putImageData(resultImageData, 0, 0);

      const title1 = document.createElement("p");
      title1.textContent = "Imagem Principal:";
      title1.className = "text-center font-bold text-gray-700 w-full";
      preview.appendChild(title1);
      preview.appendChild(canvas1);

      const title2 = document.createElement("p");
      title2.textContent = "Imagem Secundária:";
      title2.className = "text-center font-bold text-gray-700 w-full mt-4";
      preview.appendChild(title2);
      preview.appendChild(canvas2);

      const titleResult = document.createElement("p");
      titleResult.textContent = operationTitle;
      titleResult.className = "text-center font-bold text-gray-700 w-full mt-4";
      preview.appendChild(titleResult);
      preview.appendChild(outCanvas);

      console.log(`${operationTitle.replace(":", "")} aplicada.`);
      createDownloadLink(outCanvas, filenameSuffix);
    }
  };

  img1.onload = checkAndProcess;
  img1.onerror = () => {
    console.log("Erro ao carregar a imagem principal.");
  };
  img2.onload = checkAndProcess;
  img2.onerror = () => {
    console.log("Erro ao carregar a imagem secundária.");
  };
}

function drawHistogram(imageData) {
  const hist = Array(256).fill(0);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const avg = Math.floor(
      (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3
    );
    hist[avg]++;
  }

  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 100;
  const ctx = c.getContext("2d");

  // Normalize and draw histogram
  const m = Math.max(...hist);
  hist.forEach((v, i) => {
    const h = (v / m) * c.height;
    ctx.fillStyle = "#000";
    ctx.fillRect(i, c.height - h, 1, h);
  });

  return c;
}

export function histogram() {
  const { canvas, context, img } = getImg(curFile);

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);

    let imageDataOriginalGray = toGrayScale(
      context.getImageData(0, 0, canvas.width, canvas.height)
    );

    let imageDataEqualized = equalizeHistogram(imageDataOriginalGray);

    const histCanvasEqualized = drawHistogram(imageDataEqualized);
    const histCanvasOriginal = drawHistogram(imageDataOriginalGray);

    const newCanvas = document.createElement("canvas");
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;
    const newCtx = newCanvas.getContext("2d");
    newCtx.putImageData(imageDataEqualized, 0, 0);

    preview.innerHTML = "";
    preview.appendChild(canvas);
    preview.appendChild(histCanvasOriginal);

    preview.appendChild(newCanvas);
    preview.appendChild(histCanvasEqualized);
  };
}

function equalizeHistogram(imageData) {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const totalPixels = width * height;
  const L = 256;

  const hist = Array(L).fill(0);
  for (let i = 0; i < data.length; i += 4) {
    const grayValue = data[i];
    hist[grayValue]++;
  }

  const cdf = Array(L).fill(0);
  cdf[0] = hist[0];
  for (let i = 1; i < L; i++) {
    cdf[i] = cdf[i - 1] + hist[i];
  }

  let cdfMin = 0;
  for (let i = 0; i < L; i++) {
    if (cdf[i] > 0) {
      cdfMin = cdf[i];
      break;
    }
  }

  const mapping = Array(L).fill(0);
  for (let i = 0; i < L; i++) {
    mapping[i] = Math.floor(
      ((cdf[i] - cdfMin) / (totalPixels - cdfMin)) * (L - 1)
    );
    if (mapping[i] < 0) mapping[i] = 0;
    if (mapping[i] > L - 1) mapping[i] = L - 1;
  }

  const newImageData = new ImageData(width, height);
  const newData = newImageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const originalGrayValue = data[i];
    const equalizedGrayValue = mapping[originalGrayValue];

    newData[i] = equalizedGrayValue;
    newData[i + 1] = equalizedGrayValue;
    newData[i + 2] = equalizedGrayValue;
    newData[i + 3] = data[i + 3];
  }

  return newImageData;
}

export function log() {
  const { canvas, context, img } = getImg(curFile);

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);

    let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const c = 255 / Math.log(1 + 255);

    for (let i = 0; i < data.length; i += 4) {
      data[i] = c * Math.log(1 + data[i]);
      data[i + 1] = c * Math.log(1 + data[i + 1]);
      data[i + 2] = c * Math.log(1 + data[i + 2]);
    }

    context.putImageData(imageData, 0, 0);
    preview.appendChild(canvas);
    createDownloadLink(canvas, "processed_image.png");
  };
}
