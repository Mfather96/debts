import DataBaseService from '../services/dataBase.service';

export default class DebtsService {
    constructor() {
        this.dataBaseService = new DataBaseService();
        this.debts = [];
    }

    async getDebts() {
        return this.debts = await this.dataBaseService.getDebts();
    }

    getDebtByName(name) {
        if (!this.debts.length) {
            return;
        }

        const debt = this.debts.filter(debt => debt.name === name);
        return debt[0];
    }
}
