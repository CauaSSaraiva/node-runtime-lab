import { parentPort, workerData } from "worker_threads";

interface WorkerPayload {
    numero: number;
}

const data = workerData as WorkerPayload;

console.log("O que chegou no Worker:", workerData, "TIPO:", typeof workerData.numero);

// A lógica "suja" e pesada fica isolada aqui
function calcularFibonacci(n: number): number {
  if (n <= 1) return n;
  return calcularFibonacci(n - 1) + calcularFibonacci(n - 2);
}

const resultado = calcularFibonacci(data.numero);

// Devolve o resultado para quem chamou (Main Thread)
if (parentPort) {
  parentPort.postMessage(resultado);
}
