import DataBaseService from '../services/dataBase.service';

export default class DebtsService {
    constructor() {
        this.dataBaseService = new DataBaseService();
        this.debts = [];
    }

    async getDebts() {
        return this.debts = await this.dataBaseService.getDebts();
    }

    getDebtById(id) {
        if (!this.debts.length) {
            return;
        }

        const debt = this.debts.filter(debt => debt.id === id);
        return debt[0];
    }
}
