import express, { Request, Response } from "express";
const app = express();
import { Worker } from "worker_threads";
import path from "path";


app.get("/hello", (req, res) => {
  res.send("Rota Básica Acessada.");
});

app.get("/pesado/:numero", (req: Request, res: Response) => {
  const numero = parseInt(req.params.numero);

  //  Cria o Worker apontando para o arquivo separado
  //  Passa o "workerData" (o dado inicial)
  const worker = new Worker(path.resolve(__dirname, "./worker.ts"), {
    workerData: { numero },
    execArgv: ["-r", "ts-node/register"]
  });

  // Fica ouvindo: Quando o worker terminar, ele manda uma mensagem
  worker.on("message", (resultado: number) => {
    res.json({ numero, resultado });
  });

  // Se der erro (ex: worker caiu), avisa
  worker.on("error", (err: Error) => {
    res.status(500).json({ error: err.message });
  });
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));

// ATENÇÃO!!!!!
// Comunicação entre Threads: A comunicação entre a main thread e o Web Worker é assíncrona e baseada em mensagens,
// o que pode exigir um design cuidadoso para evitar condições de corrida ou outros problemas de concorrência.

