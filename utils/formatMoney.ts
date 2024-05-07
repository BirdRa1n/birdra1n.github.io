function formatMoneyFloat(value: number): string {
    return `R$ ${value.toFixed(2)}`;
}

export default formatMoneyFloat;