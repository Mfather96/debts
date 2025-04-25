import DataBaseService from "../services/dataBase.service";
import DebtsService from "../services/debts.service";

export default class Debts {
    constructor() {
        this.debts = [];
        this.root = document.querySelector('.root');
        this.debtsService = new DebtsService();
        this.dataBaseService = new DataBaseService();
    }

    async render() {
        this.debts = await this.debtsService.getDebts();

        this.root.querySelector('.loader').remove();
        this.root.querySelector('.add-new').style.display = '';

        this.debts.forEach(debt => {
            this.root.querySelector('.debts__wrapper').prepend(this.createRow(debt));
        })
    }

    bindTriggers() {
        Array.from(this.root.children).forEach(debt => {
            debt.addEventListener('click', () => {
                debt.querySelector('.buttons').classList.toggle('hide');
            })
        })

        this.root.addEventListener('click', async (e) => {
            e.preventDefault();

            if (e.target) {
                let debtName = e.target.closest('.debt-row').querySelector('.row-first span').textContent;

                if (e.target.classList.contains('back-btn')) {
                    let debt = this.debtsService.getDebtByName(debtName);


                    await this.dataBaseService.deleteDebt(debt);
                    location.reload();

                }

                if (e.target.classList.contains('over-btn')) {
                    let debt = this.debtsService.getDebtByName(debtName);
                    debt.isOver
                        ? await this.dataBaseService.updateDebt(debt, {isOver: false})
                        : await this.dataBaseService.updateDebt(debt, {isOver: true});

                    location.reload();
                }
            }
        })
    }

    createRow(debt) {
        const div = document.createElement('div');
        div.classList.add('debt-row');

        if (debt.isOver) {
            div.classList.add('over');

            div.innerHTML = `
                <div class="over-debt">Выплачен</div>
                <div class="row-first">
                    <span>${debt.name}</span>
                    <span>${debt.remaining} руб</span>
                </div>
                <div class="row-second">
                    <span>Платеж в месяц:</span>
                    <span>${debt.sumPerMonth} руб</span>
                </div>
                <div class="buttons hide">
                    <div class="btn over-btn">Выплачен</div>
                    <div class="btn back-btn">Удалить</div>
                </div>
            `
        } else {
            div.innerHTML = `
                <div class="row-first">
                    <span>${debt.name}</span>
                    <span>${debt.remaining} руб</span>
                </div>
                <div class="row-second">
                    <span>Платеж в месяц:</span>
                    <span>${debt.sumPerMonth} руб</span>
                </div>
                <div class="buttons hide">
                    <div class="btn over-btn">Выплачен</div>
                    <div class="btn back-btn">Удалить</div>
                </div>
            `
        }

        return div;
    }

    async init() {
        await this.render();

        this.bindTriggers();
    }
}
