window.onload = () => {
  const baseImg = document.querySelector(".base-wrapper img");
  if (!baseImg.complete) {
    baseImg.onload = () => initProcessing(baseImg);
  } else {
    initProcessing(baseImg);
  }

  function initProcessing(img) {
    const off = document.createElement("canvas");
    off.width = img.naturalWidth;
    off.height = img.naturalHeight;
    const offCtx = off.getContext("2d");
    offCtx.drawImage(img, 0, 0);
    const originalData = offCtx.getImageData(0, 0, off.width, off.height);

    const grayData = grayscale(originalData);

    document
      .querySelectorAll(".output-wrapper .single-output")
      .forEach((section) => {
        const title = section.querySelector("h2").innerText.toLowerCase();
        const imgTag = section.querySelector("img");
        const canvasResult = document.createElement("canvas");
        canvasResult.width = grayData.width;
        canvasResult.height = grayData.height;
        const ctx = canvasResult.getContext("2d");

        const render = (value) => {
          let result;
          if (title.includes("cinza")) {
            result = grayData;
          } else if (title.includes("preto e branco")) {
            result = threshold(grayData, 128);
          } else if (title.includes("quantização")) {
            result = quantize(grayData, value);
          } else if (title.includes("limiarização")) {
            result = threshold(grayData, value);
          } else if (title.includes("histograma")) {
            const histCanvas = drawHistogram(grayData);
            return imgTag.replaceWith(histCanvas);
          } else if (title.includes("passa alta")) {
            result = highPass(originalData);
          } else if (title.includes("passa baixa")) {
            result = blur(originalData, value || 1);
          }
          ctx.putImageData(result, 0, 0);
        };

        if (
          title.includes("quantização") ||
          title.includes("limiarização") ||
          title.includes("passa baixa")
        ) {
          let min, max, def;
          if (title.includes("quantização")) {
            min = 2;
            max = 16;
            def = 4;
          }
          if (title.includes("limiarização")) {
            min = 0;
            max = 255;
            def = 128;
          }
          if (title.includes("passa baixa")) {
            min = 1;
            max = 25;
            def = 1;
          }

          const slider = document.createElement("input");
          slider.type = "range";
          slider.min = min;
          slider.max = max;
          slider.value = def;
          slider.style.width = "100%";

          const label = document.createElement("span");
          label.textContent = ` (${def})`;

          slider.addEventListener("input", () => {
            const v = parseInt(slider.value, 10);
            render(v);
            label.textContent = ` (${v})`;
          });

          section.appendChild(slider);
          section.appendChild(label);
          render(def);
        } else {
          render();
        }

        imgTag.replaceWith(canvasResult);
      });
  }
};

function grayscale(data) {
  const out = new ImageData(
    new Uint8ClampedArray(data.data),
    data.width,
    data.height
  );
  for (let i = 0; i < out.data.length; i += 4) {
    const avg = (out.data[i] + out.data[i + 1] + out.data[i + 2]) / 3;
    out.data[i] = out.data[i + 1] = out.data[i + 2] = avg;
  }
  return out;
}

function threshold(data, t) {
  const out = new ImageData(
    new Uint8ClampedArray(data.data),
    data.width,
    data.height
  );
  for (let i = 0; i < out.data.length; i += 4) {
    const avg = (out.data[i] + out.data[i + 1] + out.data[i + 2]) / 3;
    const v = avg >= t ? 255 : 0;
    out.data[i] = out.data[i + 1] = out.data[i + 2] = v;
  }
  return out;
}

function quantize(data, levels) {
  const out = new ImageData(
    new Uint8ClampedArray(data.data),
    data.width,
    data.height
  );
  const step = 256 / levels;
  for (let i = 0; i < out.data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      out.data[i + c] = Math.floor(out.data[i + c] / step) * step;
    }
  }
  return out;
}

function blur(data, radius = 1) {
  const size = Math.max(1, Math.floor(radius));
  const kernel = Array(size)
    .fill()
    .map(() => Array(size).fill(1));
  return convolute(data, kernel, size * size);
}

function highPass(data) {
  return convolute(
    data,
    [
      [0, -1, 0],
      [-1, 4, -1],
      [0, -1, 0],
    ],
    1,
    true
  );
}

function convolute(data, kernel, divisor = 1, add128 = false) {
  const w = data.width,
    h = data.height,
    src = data.data;
  const dst = new Uint8ClampedArray(src.length);
  const kw = kernel[0].length,
    kh = kernel.length,
    half = Math.floor(kw / 2);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let r = 0,
        g = 0,
        b = 0;
      for (let ky = 0; ky < kh; ky++) {
        for (let kx = 0; kx < kw; kx++) {
          const px = x + kx - half,
            py = y + ky - half;
          if (px >= 0 && px < w && py >= 0 && py < h) {
            const idx = (py * w + px) * 4,
              wt = kernel[ky][kx];
            r += src[idx] * wt;
            g += src[idx + 1] * wt;
            b += src[idx + 2] * wt;
          }
        }
      }
      if (add128) {
        r = r / divisor + 128;
        g = g / divisor + 128;
        b = b / divisor + 128;
      } else {
        r /= divisor;
        g /= divisor;
        b /= divisor;
      }
      const i = (y * w + x) * 4;
      dst[i] = Math.max(0, Math.min(255, r));
      dst[i + 1] = Math.max(0, Math.min(255, g));
      dst[i + 2] = Math.max(0, Math.min(255, b));
      dst[i + 3] = src[i + 3];
    }
  }
  return new ImageData(dst, w, h);
}

function drawHistogram(data) {
  const hist = Array(256).fill(0);
  for (let i = 0; i < data.data.length; i += 4) {
    const avg = Math.floor(
      (data.data[i] + data.data[i + 1] + data.data[i + 2]) / 3
    );
    hist[avg]++;
  }
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 100;
  const ctx = c.getContext("2d");
  const m = Math.max(...hist);
  hist.forEach((v, i) => {
    const h = (v / m) * 100;
    ctx.fillRect(i, 100 - h, 1, h);
  });
  return c;
}
