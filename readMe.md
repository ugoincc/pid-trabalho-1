# Processamento de Imagens (HTML + JS)

Este projeto demonstra filtros de imagem (escala de cinza, limiarização, quantização, histograma, passa‑alta e passa‑baixa) usando Canvas e sliders em JavaScript puro.

## Estrutura

/
├─ index.html<br/>
├─ script.js<br/>
├─ css/<br/>
│ └─ styles.css<br/>
└─ assets/<br/>
└─ imagemBase.jpg<br/>
└─ placeholder.jpg<br/>

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

1 - Abra a pasta no VS Code<br/>
2 - Instale a extensão Live Server<br/>
3 - Clique em "Go Live" no canto inferior direito<br/>
4 - O navegador abrirá com a URL do servidor

## Opções:

Para alterar a imagem a ser processada, referenciar o endereço da imagem na linha indicada dentro de "index.html"; <br/>
Alguns filtros possuem sliders para alterar os parâmetros de visualização;
