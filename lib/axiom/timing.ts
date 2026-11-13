export function startTimer(): number {
    return performance.now();
}

export function getDurationMs(start: number): number {
    return Math.round(performance.now() - start);
}
