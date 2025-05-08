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
      applyFunction2();
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

function applyFunction2() {
  const alteredImg = document.createElement("img");
  alteredImg.src = URL.createObjectURL(curFile);
  alteredImg.alt = alteredImg.title;
  preview.appendChild(alteredImg);
  const para = document.createElement("p");
  para.textContent = "Função 2 aplicada!";
  preview.appendChild(para);
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
