import fs from "fs";

/**
 * OBJETIVO:
 * Demonstrar como o Event Loop do Node.js gerencia a ordem das filas
 * microtasks e diferentes fases do loop (Timers, Poll e Check),
 *
 * FLUXO GERAL:
 *
 * 1. Código Síncrono (Mainline)
 *    - Executa imediatamente no Call Stack.
 *
 * 2. Microtasks
 *    - process.nextTick
 *    - Promise.then
 *    Executam sempre logo após o código síncrono e
 *    antes de qualquer fase do Event Loop.
 *
 * 3. Fases do Event Loop:
 *    - Timers
 *      Callbacks de setTimeout / setInterval cujo tempo expirou.
 *
 *    - Poll
 *      Callbacks de operações de I/O (ex: fs.readFile),
 *      executados SOMENTE quando o I/O realmente termina.
 *
 *    - Check
 *      Callbacks de setImmediate, executados quando o loop
 *      atinge a fase Check, independentemente de haver I/O pronto.
 *
 * OBSERVAÇÃO IMPORTANTE:
 * - A fase Poll só ocorre se houver callbacks de I/O prontos.
 * - Como a leitura de arquivo (I/O) leva tempo, a fase Poll estava vazia na primeira passagem do loop. 
 * - Por isso, Check (setImmediate) pode executar antes do Poll.
 */

console.log("A - Código síncrono (mainline)");

setTimeout(() => {
  console.log("B - Timers phase (setTimeout)");
}, 0);

setImmediate(() => {
  console.log("C - Check phase (setImmediate)");
});

fs.readFile(__filename, () => {
  console.log("D - Poll phase (fs.readFile)");
});

process.nextTick(() => {
  console.log("E - Microtask (process.nextTick)");
});

Promise.resolve().then(() => {
  console.log("F - Microtask (Promise.then)");
});

console.log("G - Fim do código síncrono");

// // Para rodar: npx ts-node src/fundamentais/event-loop.ts