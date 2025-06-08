# 📒 Documentação de Funções

# ♦ Passa-Baixa Mediana
- **Conceito Principal:** Reduzir ruído preservando bordas (especialmente útil contra ruídos do tipo "sal e pimenta").

## 🥾 Passo a Passo

### 1) O filtro Mediana utiliza uma **janela (máscara)** deslizante, geralmente de tamanho **3x3**:

- **Janela 3x3:**

          [10 20 30]
          [10 10 10]
          [40 30 30]
  ---
  ### 2) A janela é aplicada item por item da seguinte forma:

- **1º Passo:** Coletar os **9 valores** da vizinhança (janela 3x3).
  
- **2º Passo:** Ordenar os valores coletados:


- **3º Passo:** Selecionar o valor **mediano** (valor do meio).  
  → Para 9 valores: a mediana é o **5º valor** da lista ordenada.

Exemplo:

          [10 20 30]
          [10 X  10]
          [40 30 30]
          
X = Valor a Substituir
          
# ♦ Roberts
- Conceito Principal: Realçar Bordas
## 🥾 Passo a Passo:
### 1) O filtro de Roberts utiliza duas máscaras/kernel (2x2):

- Kernel 1

          K1 = [+1 0]
               [0 -1]

- Kernel 2

          K2 = [0 +1]
               [-1 0]

## 2) Ele é aplicado item por item da seguinte forma:

- Vamos exemplificar uma matriz 2x2 que deverá ser processada:

          Ex1 = [10 200]
                [10 200]

- O kernel 1 é aplicado

          [10*(1) 200*(0)]
          [10*(0) 200*(-1)]
          
          [10 0  ]
          [0 -200]

          N1 = 10 + 0 + 0 -200
          N1 = -190

- O kernel 2 é aplicado

          [10*(0) 200*(1)]
          [10*(-1) 200*(0)]
          
          [0    200]
          [-10  0  ]

          N2 = 0 + 200 - 10 + 0
          N2 = 190

- Os valores de N1 e N2 são aplicados para a seguinte fórmula:

          Resultado = √(N1)^2 +(N2)^2

- O valor resultante passa a ser 268.7. Assim, os valores envolta são perdidos

               Matriz Resultante -> [268.7]


# ♦ Prewitt
- **Conceito Principal:** Realçar bordas em imagens (detecção de bordas horizontais e verticais).

---

## 🥾 Passo a Passo

### 1) O filtro Prewitt utiliza duas máscaras/kernel (3x3):

- **Kernel Horizontal (Gx):**
          [-1 0 1]
          [-1 0 1]
          [-1 0 1]

- **Kernel Vertical (Gy):**
          [1   1  1]
          [ 0  0  0]
          [-1 -1 -1]
  
### 2) Aplicação das Máscaras
          Exemplo:
          [10 20 30]
          [10 10 10]
          [40 30 30]
          
---

### Aplicação do Kernel Horizontal (Gx):
          [10 * -1 20 * 0 30 * 1] → [-10 0 30]
          [10 * -1 10 * 0 10 * 1] → [-10 0 10]
          [40 * -1 30 * 0 30 * 1] → [-40 0 30]

- Soma total:
-10 + 0 + 30 + (-10) + 0 + 10 + (-40) + 0 + 30 = 10

**Gx = 10**

---

### Aplicação do Kernel Vertical (Gy):
          [10 * -1 20 * -1 30 * -1] → [-10 -20 -30]
          [10 * 0 10 * 0 10 * 0] → [ 0 0 0]
          [40 * 1 30 * 1 30 * 1] → [ 40 30 30]

- Soma total:
  **Gy = 40**

---

### 🧮 Cálculo da Magnitude do Gradiente
Resultado = √(Gx² + Gy²)
= √(10² + 40²)
= √(100 + 1600)
= √1700 ≈ 41.23

---
### Resultado:
          [10 20 30]      [10 20    30]
          [10 X  10]   →  [10 41.23 10]
          [40 30 30]      [40 30    30]


# ♦ Sobel

- Conceito Principal: Realçar Bordas
## 🥾 Passo a Passo:
### 1) O filtro Sobel utiliza duas máscaras/kernel (3x3):

- Kernel 1

          K1 = [-1 0 1]
               [-2 0 2]
               [-1 0 1]

- Kernel 2

          K1 = [-1 -2 -1]
               [ 0  0  0]
               [ 1  2  1]

## 2) Ele é aplicado item por item da seguinte forma:

- Vamos exemplificar uma matriz 3x3 que deverá ser processada:

          Ex1 = [10 20 30]
                [10 10 10]
                [40 30 30]

- O kernel 1 horizontal é aplicado

          [10 * -1    20 * 0    30 * 1]   →   [-10     0    30]
          [10 * -2    10 * 0    10 * 2]   →   [-20     0    20]
          [40 * -1    30 * 0    30 * 1]   →   [-40     0    30]

          -10 + 0 + 30 + (-20) + 0 + 20 + (-40) + 0 + 30 = **10**


- O kernel 2 vertical é aplicado

          [10 * -1    20 * -2   30 * -1]   →   [-10   -40   -30]
          [10 * 0     10 * 0    10 * 0]    →   [  0     0     0 ]
          [40 * 1     30 * 2    30 * 1]    →   [ 40    60    30]

          -10 + (-40) + (-30) + 0 + 0 + 0 + 40 + 60 + 30 = **50**


- Os valores de N1 e N2 são aplicados para a seguinte fórmula:

          Resultado = √(N1)^2 +(N2)^2

- O valor resultante passa a ser 50.99. Assim, os valores envolta são perdidos

               Matriz Resultante -> [50.99]

# ♦ Log



