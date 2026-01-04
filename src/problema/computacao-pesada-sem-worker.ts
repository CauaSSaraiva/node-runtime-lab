import express from 'express';
const app = express();

// Função que SIMULA um processamento pesado (CPU Bound)
// Fibonacci recursivo é péssimo para performance
function fibonacci(n: number): number {
    if (n <= 1) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

app.get('/hello', (req, res) => {
  res.send("Rota Básica Acessada.");
});

app.get('/pesado/:numero', (req, res) => {
    const numero = parseInt(req.params.numero);
    console.log(`Iniciando cálculo para ${numero}.`);
    
    // Isso vai BLOQUEAR o Event Loop
    const resultado = fibonacci(numero);
    
    res.send(`Resultado Fibonacci de ${numero} é: ${resultado}`);
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));