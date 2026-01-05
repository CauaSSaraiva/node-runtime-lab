/**
 * OBJETIVO: Demonstrar o funcionamento do Thread Pool do Libuv.
 * O Node.js delega operações de I/O (como FS) ou CPU Bound de C++ (como criptografia)
 * para o Libuv, que usa um pool de threads (padrão = 4 threads).
*/

import crypto from "crypto";

const start = Date.now();

const doHash = (id: number) => {
  // pbkdf2 é uma função de criptografia que roda no Thread Pool do Libuv
  crypto.pbkdf2("senha", "sal", 100000, 512, "sha512", () => {
    const end = Date.now();
    console.log(`Hash ${id} finalizado em: ${end - start}ms`);
  });
};

console.log("Iniciando 6 chamadas de Hash (Padrão ThreadPool = 4)");

/**
 * Vamos chamar 6 vezes.
 * O esperado: As 4 primeiras terminam quase juntas.
 * As 2 últimas levam quase o dobro do tempo (pois esperaram vaga).
*/
doHash(1);
doHash(2);
doHash(3);
doHash(4);
doHash(5);
doHash(6);

// Para rodar: npx ts-node src/fundamentais/libuv.ts
