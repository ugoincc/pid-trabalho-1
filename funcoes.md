# 📒 Documentacao de Funcoes

# ♦ Passa-Baixa Mediana

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



