# Processamento de Imagens (HTML + JS)

<strong>Autores:</strong>

- [Hugo Cordeiro](https://github.com/ugoincc)
- [Kelyton Lacerda](https://github.com/Kelyton21)
- [Renan Batalha](https://github.com/renanBatalha)

## Descrição

Este projeto demonstra filtros e técnicas de processamento de imagens usando Canvas em JavaScript puro.

Os filtros abordados neste trabalho são:

1. Limiarização (Threshold)
2. Escala de Cinza
3. Passa-Alta básico
4. Passa-Alta Alto reforço
5. Passa-Baixa Média (Básico)
6. Passa-Baixa Mediana
7. Operador de Roberts
8. Operador de Prewitt
9. Operador de Sobel
10. Tranformação Logarítmica
11. Operações Aritméticas
    a. Soma
    b. Subtração
    c. Multiplicação
    d. Divisão
12. Histograma (Escala de cinza)
13. Equalização de Histograma

## Estrutura

As funções de filtro e manipulação de imagem estão separadas em módulos (i.e './scriptHugo') <i>main.js</i> contém o controlador para chamada das funções e <i>common.js</i> com as funções auxiliares para <i>inputs</i> e <i>download</i> das imagens processadas.

Documentação e informações sobre cada módulo são encontrados nos arquivos <i>'funcoes[nome].md'</i>.

    /
    ├─ index.html<br/>
    ├─ css/<br/>
    │ └─ styles.css<br/>
    ├─ common.js<br/>
    ├─ main.js/<br/>
    ├─ scriptKelyton.js<br/>
    ├─ funcoesKelyton.md<br/>
    ├─ scriptRenan.js<br/>
    ├─ funcoesRenan.md<br/>
    ├─ scriptHugo.js<br/>
    ├─ funcoesHugo.md<br/>
    └─ readMe.md<br/>

## Como rodar

Não abrir index.html diretamente, navegadores bloqueiam por padrão a leitura de pixels quando a imagem vem de `file://`. Por isso use um servidor HTTP local:

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
