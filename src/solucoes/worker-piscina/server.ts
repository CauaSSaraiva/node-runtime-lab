import express, { Request, Response } from "express";
import { Piscina } from "piscina";
import path from "path";

const app = express();

const piscina = new Piscina({
  filename: path.resolve(__dirname, "worker.ts"),
  execArgv: ["-r", "ts-node/register"],
});


app.get("/hello", (req, res) => {
  res.send("Rota Básica Acessada.");
});

app.get("/pesado/:numero", async (req, res) => {
  const numero = parseInt(req.params.numero);

  if (isNaN(numero)) {
    return res.status(400).send("Número inválido");
  }

  try {
    console.log(`Recebido pedido para fibonacci(${numero})`);

    const resultado = await piscina.run(numero);

    res.send(`Resultado: ${resultado}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro no worker");
  }
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));

// ATENÇÃO!!!!!
// Comunicação entre Threads: A comunicação entre a main thread e o Web Worker é assíncrona e baseada em mensagens,
// o que pode exigir um design cuidadoso para evitar condições de corrida ou outros problemas de concorrência.
