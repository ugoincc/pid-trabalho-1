# 📒 Documentacao de Funcoes

### Passa-Baixa Mediana

## Roberts
## 🥾 Passo a Passo:
### 1) O filtro de Roberts utiliza duas máscaras/kernel (2x2):

- Kernel 1

          K1 = [+1 0]
               [0 -1]

- Kernel 2

          K2 = [0 +1]
               [-1 0]

## 2) Ele é aplicado item por item da seguinte forma:

- Vamos exemplificar uma matriz 4x4 que deverá ser processada:

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
          
          [0    200 ]
          [-10  0   ]

          N2 = 0 + 200 - 10 + 0
          N2 = 190

- Os valores de N1 e N2 são aplicados para a seguinte fórmula:

     Resultado = √(N1)^2 +(N2)^2

- O valor resultante passa a ser 268.7. Assim, os valores envolta são perdidos

               Matriz Resultante -> [268.7]


### Prewitt

### Sobel

### Log



