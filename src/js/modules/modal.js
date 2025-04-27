import DataBaseService from "../services/dataBase.service";

export default class AddNewModal {
    constructor() {
        this.modal = document.querySelector('.modal');
        this.btn = document.querySelector('.add-new');
        this.form = null;
        this.modalClose = this.modal.querySelector('.modal__close');
        this.dataBaseService = new DataBaseService();
    }

    bindTriggers() {
        this.modalClose.addEventListener('click', () => this.closeModal(), {once: true})
    }

    openModal(isEdit = false, debt = null) {
        this.modal.style.display = 'block';
        this.modal.querySelector('.modal__content').appendChild(this.createForm(isEdit, debt));

        this.form = this.modal.querySelector('form');
        if (isEdit) {
            this.postFormData(isEdit, debt);
        } else {
            this.postFormData();
        }

        this.bindTriggers();
    }

    postFormData(isUpdated = false, debt = null) {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (this.validateForm(this.form)) {
                return;
            }

            const data = Object.fromEntries(new FormData(this.form));
            data.markAsDebt = this.form.querySelector('input[type="checkbox"]').checked;

            if (!isUpdated) {
                await this.dataBaseService.postDebt(data)
                location.reload();
            } else {
                await this.dataBaseService.updateDebt(debt, data)
                location.reload();
            }
        })

    }

    closeModal() {
        this.modal.style.display = '';
        this.form.reset();
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input');

        const isHasEmpty = Array.from(inputs).every(inp => inp.value);

        if (!isHasEmpty) {
            return true;
        } else {
            form.querySelector('.form__submit').disabled = true;
            return false;
        }
    }

    createForm(isEditForm = false, debt = null) {
        if (this.form) {
            this.form.remove();
        }

        const form = document.createElement('form');
        form.classList.add('modal__form');
        form.setAttribute('action', '#');
        form.setAttribute('method', 'POST');

        this.modal.querySelector('.modal__title').textContent = isEditForm
            ? 'Отредактируем-ка'
            : 'Создаём новый долг';

        form.innerHTML =  `
            <form action="#" method="POST" class="modal__form">
                <label for="debtName">Название</label>
                <input class="form__control"
                    type="text"
                    name="name"
                    id="debtName"
                    ${isEditForm ? `value="${debt.name}"` : ''}>

                <label for="remaining">Сколько осталось</label>
                <input class="form__control"
                    type="number"
                    name="remaining"
                    id="remaining"
                    ${isEditForm ? `value="${debt.remaining}"`: ''}>

                <label for="sumPerMonth">Сколько в месяц</label>
                <input class="form__control"
                    type="number"
                    name="sumPerMonth"
                    id="sumPerMonth"
                    ${isEditForm ? `value="${debt.sumPerMonth}"`: ''}>

                <div class="checkbox">
                    <input id="markAsDebt"
                        type="checkbox"
                        name="markAsDebt"
                        ${isEditForm && debt.markAsDebt ? 'checked': ''}>
                    <label for="markAsDebt">Отметить как долг</label>
                </div>

                <div class="form__submit-wrp"><button class="form__submit" type="submit">Сохранить</button></div>
            </form>
        `

        return form;
    }
}
