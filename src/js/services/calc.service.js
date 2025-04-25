import DebtsService from "../services/debts.service";

export default class CalculatorService {
    constructor() {
        this.allDebts = [];
        this.debtsService = new DebtsService();
    }

    async getTotalSumPerMonth() {
        this.allDebts = await this.debtsService.getDebts();

        return this.allDebts.filter(debt => !debt.isOver).reduce((sum, debt) => sum + debt.sumPerMonth, 0);
    }

    async getTotalSumRemaining() {
        this.allDebts = await this.debtsService.getDebts();

        return this.allDebts.filter(debt => !debt.isOver).reduce((sum, debt) => sum + debt.remaining, 0);
    }


}
