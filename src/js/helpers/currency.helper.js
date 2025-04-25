export function addSeparator(num) {
    return num.toString()
        .split('')
        .reverse()
        .map((digit, i) => (i) % 3 === 0 && i > 1 ? digit + '.' : digit)
        .reverse()
        .join('');
}
