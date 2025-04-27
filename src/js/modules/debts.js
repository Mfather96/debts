import { addSeparator } from "../helpers/currency.helper";
import DataBaseService from "../services/dataBase.service";
import DebtsService from "../services/debts.service";
import AddNewModal from "./modal";

export default class Debts {
    constructor() {
        this.debts = [];
        this.root = document.querySelector('.root');
        this.addNewBtn = this.root.querySelector('.add-new');
        this.debtsService = new DebtsService();
        this.dataBaseService = new DataBaseService();
        this.modal = new AddNewModal();
    }

    async render() {
        this.debts = await this.debtsService.getDebts();

        this.root.querySelector('.loader').remove();
        this.addNewBtn.style.display = '';

        this.debts.forEach(debt => {
            if (!debt.markAsDebt) {
                this.root.querySelector('.not-debts__list').appendChild(this.createRow(debt));
            } else {
                this.root.querySelector('.debts__list').appendChild(this.createRow(debt));
            }
        })
        this.root.querySelector('.debts__list .list--title span').innerHTML = `
            (${this.debts.filter(debt => debt.markAsDebt).length})
        `

        this.root.querySelector('.not-debts__list .list--title span').innerHTML = `
            (${this.debts.filter(debt => !debt.markAsDebt).length})
        `
    }

    bindTriggers() {
        this.addNewBtn.addEventListener('click', () => {
            this.modal.openModal();
            this.modal.init();
        })

        Array.from(this.root.querySelectorAll('.debts__list')).forEach(list => {
            Array.from(list.children).forEach(debt => {
                debt.addEventListener('click', () => {
                    if (debt.querySelector('.buttons')) {
                        debt.querySelector('.buttons').classList.toggle('hide');
                    }
                })
            })
        })

        this.root.querySelector('.debts__wrapper').addEventListener('click', async (e) => {
            e.preventDefault();

            if (e.target) {
                let debtID;
                let debt;

                if (e.target.classList.contains('list--title')) {
                    e.target.parentNode.classList.toggle('opened');
                }

                if (e.target.closest('.debt-row')) {
                    debtID = e.target.closest('.debt-row').getAttribute('id');
                    debt = this.debtsService.getDebtById(debtID);
                }

                if (e.target.classList.contains('back-btn')) {
                    await this.dataBaseService.deleteDebt(debt);
                    location.reload();
                }

                if (e.target.classList.contains('over-btn')) {
                    debt.isOver
                        ? await this.dataBaseService.updateDebt(debt, {isOver: false})
                        : await this.dataBaseService.updateDebt(debt, {isOver: true});

                    location.reload();
                }

                if (e.target.classList.contains('edit-btn')) {
                    this.modal.openModal(true, debt);
                    this.modal.init();
                }
            }
        })
    }

    createRow(debt) {
        const div = document.createElement('div');
        div.classList.add('debt-row');
        div.setAttribute('id', debt.id)

        if (debt.isOver) {
            div.classList.add('over');

            div.innerHTML = `
                <div class="over-debt">Выплачен</div>
                <div class="row-first">
                    <span>${debt.name}</span>
                    <span class="blue-currency">${addSeparator(debt.remaining)} руб</span>
                </div>
                <div class="row-second">
                    <span>Платеж в месяц:</span>
                    <span class="green-currency">${addSeparator(debt.sumPerMonth)} руб</span>
                </div>
                <div class="buttons hide">
                    <div class="btn over-btn">Выплачен</div>
                    <div class="btn edit-btn">Редактировать</div>
                    <div class="btn back-btn">Удалить</div>
                </div>
            `
        } else {
            div.innerHTML = `
                <div class="row-first">
                    <span>${debt.name}</span>
                    <span class="blue-currency">${addSeparator(debt.remaining)} руб</span>
                </div>
                <div class="row-second">
                    <span>Платеж в месяц:</span>
                    <span class="green-currency">${addSeparator(debt.sumPerMonth)} руб</span>
                </div>
                <div class="buttons hide">
                    <div class="btn over-btn">Выплачен</div>
                    <div class="btn edit-btn">Редактировать</div>
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
