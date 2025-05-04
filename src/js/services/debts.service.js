import DataBaseService from '../services/dataBase.service';
import { addSeparator } from "../helpers/currency.helper";

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

    createRow(debt) {
        const div = document.createElement('div');
        div.classList.add('debt-row');
        div.setAttribute('id', debt.id)
        debt.isOver ? div.classList.add('over') : '';

        div.innerHTML = `
                ${debt.isOver ? '<div class="over-debt">Выплачен</div>' : ''}
                <div class="row-first">
                    <span>${debt.name}</span>
                    <span class="blue-currency">${addSeparator(debt.remaining)} руб</span>
                </div>
                <div class="row-second">
                    <span>Платеж в месяц:</span>
                    <span class="green-currency">${addSeparator(debt.sumPerMonth)} руб</span>
                </div>
                <div class="buttons hide">
                    ${!debt.isOver 
                        ? '<div class="btn over-btn">Выплачен</div>'
                        : '<div class="btn over-btn get-back">Все еще должен</div>'
                    }
                    <div class="btn edit-btn">Редактировать</div>
                    <div class="btn back-btn">Удалить</div>
                </div>
            `

        return div;
    }
}
