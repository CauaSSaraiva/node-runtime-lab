
export default (n: number) => {
    return calcularFibonacci(n);
};

function calcularFibonacci(n: number): number {
    if (n <= 1) return n;
    return calcularFibonacci(n - 1) + calcularFibonacci(n - 2);
}

