
# Node.js - Runtime Lab

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

Este repositório é um laboratório prático focado em demonstrar e entender a **Arquitetura Node.js, Concorrência e Performance**.

O objetivo é demonstrar, através de código, como o Node.js funciona "por baixo dos panos" e gerencia tarefas assíncronas, onde ocorrem gargalos (CPU-bound) e como resolvê-los utilizando **Worker Threads** e **Thread Pools** em um ambiente puramente **TypeScript**.

## Conceitos Abordados

- **Event Loop:** Prioridade de "execução" e como Node realiza operações sem bloquear mesmo sendo Single-threaded.
- **Libuv:** A C library que implementa o loop de eventos do Node.js e todos os comportamentos assíncronos.
- **Single Thread:** Demonstração prática do travamento da Main Thread e de que Node.js é de thread única.
- **Worker Threads:** A solução para rodar código JavaScript pesado em paralelo (CPU-bound) sem travar a API. (exemplo Nativo e Gerenciado)
- **TypeScript Runtime:** Configuração para execução de arquivos `.ts` em threads isoladas.

---

## Estrutura do Projeto

```
/src
├── /fundamentais         # Experimentos sobre a arquitetura interna do Node
│   ├── event-loop.ts     # Node realizando operações de forma não-bloqueante e ordem.
│   ├── single-thread.ts  # Demonstração de congelamento e thread único
│   └── libuv.ts   # Funcionamento do Thread Pool interno (C++)
│
├── /problema   # Problema que pode surgir devido ao funcionamento do Node.js
│   └── computacao-pesada-sem-worker.ts  # Não responde a outras requisições
│
└── /solucoes               # Implementações de Servidores Express
    ├── /worker-basico   # Solução usando módulo nativo 'worker_threads'
    └── /worker-piscina  # Solução otimizada usando Thread Pool ('piscina')
```

##  Explicação

### 1. O Problema do Bloqueio

O Node.js é single-threaded. Tarefas pesadas de CPU (como cálculos matemáticos recursivos) impedem o **Event Loop** de aceitar novas requisições.

* Veja em: `src/fundamentais/single-thread.ts`
* Veja exemplo do problema em: `src/problema/computacao-pesada-sem-worker.ts`

### 2. O Libuv

Muitos desenvolvedores desconhecem que operações de sistema (como `fs` ou `crypto`) rodam fora da Main Thread através do **Libuv**, que gerencia tanto o Event Loop quanto um Thread Pool limitado. Porém, elas ainda são limitadas pelo tamanho do pool (Padrão: 4 threads).

> "Node.js runs JavaScript code in the Event Loop (initialization and callbacks), and offers a Worker Pool to handle expensive tasks like file I/O. [...]
>
> In Node.js there are two types of threads: one Event Loop (aka the main loop, main thread, event thread, etc.), and a pool of k Workers in a Worker Pool (aka the threadpool). [...]
>
> The Worker Pool of Node.js is implemented in libuv, which exposes a general task submission API."
>
> — [Node.js Docs: Don't Block the Event Loop](https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop)

* Veja em: `src/fundamentais/libuv.ts`

### 3. Worker Threads com TypeScript (Runtime)

Para resolver gargalos de processamento JavaScript (onde o Libuv não atua), utilizamos Worker Threads.

Um desafio comum ao usar Workers com TypeScript é que o arquivo do worker (`.ts`) não é interpretado nativamente pelo Node.
Neste projeto, utilizei `execArgv` para injetar o `ts-node/register` em tempo de execução. Isso permite que a Main Thread e os Workers compartilhem código TypeScript sem necessidade de build prévio para essa demonstração.

```typescript
// Exemplo de injeção de runtime no Worker
  const worker = new Worker(path.resolve(__dirname, "./worker.ts"), {
    workerData: { numero },
    execArgv: ["-r", "ts-node/register"] // Habilita TS
  });
```

---

## Como Executar

Certifique-se de ter o Node.js instalado.

1. **Instale as dependências:**
```bash
npm install
```


2. **Execute os experimentos fundamentais:**
```bash
# Teste do Event Loop (Entendendo as fases)
npx ts-node src/fundamentais/event-loop.ts

# Teste do Libuv
npx ts-node src/fundamentais/libuv.ts
```


3. **Rode os Servidores (API):**
```bash
# Versão com Worker Nativo
npx ts-node src/solucoes/worker-basico/server.ts

# Versão com Piscina (Recomendado)
npx ts-node src/solucoes/worker-piscina/server.ts
```


4. **Teste a API:**
Abra o navegador ou terminal:
* Rota Básica (Hello): `http://localhost:3000/hello` (Sempre rápido)
* Cálculo Pesado: `http://localhost:3000/pesado/42` (Processado em background)
