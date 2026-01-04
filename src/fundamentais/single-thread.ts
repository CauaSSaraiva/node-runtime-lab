/**
 * OBJETIVO: Provar que loops pesados na thread principal bloqueiam
 * funções assíncronas como setTimeout.
*/

console.log("1. Início do script");

setTimeout(() => {
  console.log("Isso aqui deveria rodar rápido (mas vai atrasar)");
}, 10);


console.log("2. Iniciando bloqueio de CPU (For Gigante)...");
const start = Date.now();

/** 
 * Uma Tarefa pesada em CPU
 *  o Node.js NÃO consegue fazer mais nada enquanto estiver preso aqui.
 *  nem responder requisições HTTP, nem rodar timers.
*/
for (let i = 0; i < 5e9; i++) {
}

const end = Date.now();
console.log(`3. Bloqueio acabou. Levou ${(end - start) / 1000} segundos.`);

// Para rodar: npx ts-node src/fundamentals/single-thread.ts
