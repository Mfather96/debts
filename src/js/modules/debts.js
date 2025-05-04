import { addSeparator } from "../helpers/currency.helper";
import DataBaseService from "../services/dataBase.service";
import DebtsService from "../services/debts.service";
import AddNewModal from "./modal";

export default class Debts {
    constructor(root) {
        this.debts = [];
        this.root = root;
        this.addNewBtn = this.root.querySelector('.add-new');
        this.debtsService = new DebtsService();
        this.dataBaseService = new DataBaseService();
        this.modal = new AddNewModal();
    }

    async render() {
        this.root.querySelector('.loader').remove();
        this.root.querySelectorAll('.debts__list').forEach(list => {
            list.classList.remove('hide');
        })
        this.addNewBtn.style.display = '';

       this.prepareDebtsLists();
    }

    listenAddNewBtn() {
        this.addNewBtn.addEventListener('click', () => {
            this.modal.openModal();
        })
    }

    listenDebtsHandlers() {
        Array.from(this.root.querySelectorAll('.debts__list')).forEach(list => {
            Array.from(list.children).forEach(debt => {
                debt.addEventListener('click', async (e) => {
                    let debtID;
                    let debtData;

                    if (debt.getAttribute('id')) {
                        debtID = debt.getAttribute('id');
                        debtData = this.debtsService.getDebtById(debtID);
                    }

                    if (debt.querySelector('.buttons')) {
                        debt.querySelector('.buttons').classList.toggle('hide');
                    }

                    if (debt.classList.contains('list--title')) {
                        debt.parentNode.classList.toggle('opened');
                    }

                    if (e.target.classList.contains('back-btn')) {
                        await this.dataBaseService.deleteDebt(debtData);
                        location.reload();
                    }

                    if (e.target.classList.contains('over-btn')) {
                        debtData.isOver
                            ? await this.dataBaseService.updateDebt(debtData, {isOver: false})
                            : await this.dataBaseService.updateDebt(debtData, {isOver: true});

                        location.reload();
                    }

                    if (e.target.classList.contains('edit-btn')) {
                        this.modal.openModal(true, debtData);
                    }
                })
            })
        })
    }

    bindTriggers() {
        this.listenAddNewBtn();
        this.listenDebtsHandlers();
    }

    prepareDebtsLists(tab = 'actual') {
        this.filterDebts(tab);
    }

    filterDebts(tab) {
        let filteredDebts = this.debts.filter(debt => tab === 'done' ? debt.isOver : !debt.isOver);

        if (tab !== 'done') {
            this.root.querySelector('.not-debts__list').innerHTML = `
                 <div class="list--title">Ежемесячные расходы <span></span></div>
            `;
            this.root.querySelector('.debts__list').innerHTML = `
                <div class="list--title">Обязательные долги <span></span></div>        
            `;

            filteredDebts.forEach(debt => {
                if (!debt.markAsDebt) {
                    this.root.querySelector('.not-debts__list').appendChild(this.createRow(debt));
                } else {
                    this.root.querySelector('.debts__list').appendChild(this.createRow(debt));
                }
            })

            this.root.querySelector('.debts__list .list--title span').innerHTML = `
                (${filteredDebts.filter(debt => debt.markAsDebt).length})
            `
    
            this.root.querySelector('.not-debts__list .list--title span').innerHTML = `
                (${filteredDebts.filter(debt => !debt.markAsDebt).length})
            `
        } else {
            this.root.querySelector('.debts__list').innerHTML = '';
            this.root.querySelector('.not-debts__list').innerHTML = '';

            filteredDebts.forEach(debtDone => {
                this.root.querySelector('.not-debts__list').appendChild(this.createRow(debtDone));
            })
        }


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
                    <div class="btn over-btn">Выплачен</div>
                    <div class="btn edit-btn">Редактировать</div>
                    <div class="btn back-btn">Удалить</div>
                </div>
            `

        return div;
    }

    async init() {
        this.debts = await this.debtsService.getDebts();
        await this.render();

        this.bindTriggers();
    }
}
