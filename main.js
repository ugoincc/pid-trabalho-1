import { processImageOperation, log, histogram } from "./scriptHugo.js";
import {
  LimiarizacaoGaussiana,
  escala_de_cinza,
  filtroPassaAlta,
  filtroPassaAltaAltoReforco,
  filtroPassaBaixaMedia,
} from "./scriptKelyton.js";
import {
  aplicarFiltroMediana,
  aplicarFiltroPrewitt,
  aplicarFiltroRoberts,
  aplicarFiltroSobel,
} from "./scriptRenan.js";

export function handleImageFunction(selectedFunction) {
  const preview = document.querySelector(".single-output");

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
    case "fun6":
      aplicarFiltroMediana();
      break;
    case "fun7":
      aplicarFiltroRoberts();
      break;
    case "fun8":
      aplicarFiltroPrewitt();
      break;
    case "fun9":
      aplicarFiltroSobel();
      break;
    case "fun10":
      log();
      break;
    case "fun11":
      processImageOperation("sum");
      break;
    case "fun12":
      processImageOperation("sub");
      break;
    case "fun13":
      processImageOperation("multiply");
      break;
    case "fun14":
      processImageOperation("divide");
      break;
    case "fun15":
      histogram();
      break;
    default:
      const msg = document.createElement("p");
      msg.textContent = "Nenhuma função selecionada.";
      preview.appendChild(msg);
  }
}
