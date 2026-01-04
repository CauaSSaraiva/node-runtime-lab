/**
 * OBJETIVO: Demonstrar a prioridade de execução no Event Loop do Node.js.
 * * ORDEM TEÓRICA ESPERADA:
 * 1. Síncrono (Mainline)
 * 2. process.nextTick (Microtask - Alta prioridade)
 * 3. Promise.then (Microtask)
 * 4. setTimeout (Macrotask - Timers)
*/

console.log("A - Inicio (Síncrono)");

setTimeout(() => {
  console.log("B - setTimeout (Macrotask / Timer Phase)");
}, 0);

Promise.resolve().then(() => {
  console.log("C - Promise (Microtask Queue)");
});

process.nextTick(() => {
  console.log("D - process.nextTick (Microtask Queue - Prioritária)");
});

console.log("E - Fim (Síncrono)");

// Para rodar: npx ts-node src/fundamentals/event-loop.ts
