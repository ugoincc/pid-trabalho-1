# Processamento de Imagens (HTML + JS)

Este projeto demonstra filtros de imagem (escala de cinza, limiarização, quantização, histograma, passa‑alta e passa‑baixa) usando Canvas e sliders em JavaScript puro.

## Estrutura

/
├─ index.html
├─ script.js
├─ css/
│ └─ styles.css
└─ assets/
└─ imagemBase.jpg
└─ placeholder.jpg

## Como rodar

-- Não abrir index.html diretamente, navegadores bloqueiam por padrão a leitura de pixels quando a imagem vem de `file://`. Por isso use um servidor HTTP local:

### 1. Python 3

```bash
# no diretório do projeto:
python3 -m http.server 8000

# acesse em: http://localhost:8000
```

### 2. Node.js

### no diretório do projeto:

npx serve .

### abra no navegador:

http://localhost:5000 (ou a porta indicada pelo serve no console)

### 3. http-server (Node.js, instalação global)

npm install -g http-server

### depois:

http-server -c-1

### visite:

http://localhost:8080

### 4. Live Server (VS Code)

1 - Abra a pasta no VS Code
2 - Instale a extensão Live Server
3 - Clique em "Go Live" no canto inferior direito
4 - O navegador abrirá com a URL do servidor

## Opções:

Para alterar a imagem a ser processada, referenciar o endereço da imagem na linha indicada dentro de "index.html";
Alguns filtros possuem sliders para alterar os parâmetros de visualização;
