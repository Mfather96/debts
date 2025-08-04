import DebtsService from "../services/debts.service";

export default class CalculatorService {
    constructor() {
        this.allDebts = [];
        this.debtsService = new DebtsService();
    }

    async init() {
        console.log('2');

        this.allDebts = await this.debtsService.getDebts();
    }

    getTotalSumPerMonth() {
        return this.allDebts.filter(debt => !debt.isOver).reduce((sum, debt) => sum + debt.sumPerMonth, 0);
    }

    getTotalSumRemaining() {
        return this.allDebts.filter(debt => !debt.isOver).reduce((sum, debt) => sum + debt.remaining, 0);
    }

    getRequiredSum() {
        return this.allDebts.filter(debt => !debt.isOver && debt.markAsDebt).reduce((sum, debt) => sum + debt.sumPerMonth, 0);
    }

    getMonthlySum() {
        return this.allDebts.filter(debt => !debt.isOver && !debt.markAsDebt).reduce((sum, debt) => sum + debt.sumPerMonth, 0);
    }
}
