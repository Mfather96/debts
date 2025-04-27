import DataBaseService from "../services/dataBase.service";

export default class AddNewModal {
    constructor() {
        this.modal = document.querySelector('.modal');
        this.btn = document.querySelector('.add-new');
        this.form = document.querySelector('form');
        this.modalClose = this.modal.querySelector('.modal__close');
        this.dataBaseService = new DataBaseService();
    }

    bindTriggers() {
        this.modalClose.addEventListener('click', () => {
            console.log('clicked');

            this.closeModal();
        })
    }

    openModal(isEdit = false, debt = null) {
        this.modal.style.display = 'block';
        this.modal.querySelector('.modal__content').appendChild(this.createForm(isEdit, debt));

        if (isEdit) {
            this.postFormData(isEdit, debt);
        } else {
            this.postFormData();
        }
    }

    postFormData(isUpdated = false, debt = null) {
        const form = this.modal.querySelector('form');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (this.validateForm(form)) {
                return;
            }

            const data = Object.fromEntries(new FormData(form));
            data.markAsDebt = form.querySelector('input[type="checkbox"]').checked;

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
        this.modal.querySelector('form').reset();
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
        if (this.modal.querySelector('form')) {
            this.modal.querySelector('form').remove();
        }

        const form = document.createElement('form');
        form.classList.add('modal__form');
        form.setAttribute('action', '#');
        form.setAttribute('method', 'POST');

        if (isEditForm && debt) {
            this.modal.querySelector('.modal__title').textContent = 'Отредактируем-ка';
            form.innerHTML =  `
                <form action="#" method="POST" class="modal__form">
                    <label for="debtName">Название</label>
                    <input class="form__control" type="text" name="name" id="debtName" value="${debt.name}">

                    <label for="remaining">Сколько осталось</label>
                    <input class="form__control" type="number" name="remaining" id="remaining" value="${debt.remaining}">

                    <label for="sumPerMonth">Сколько в месяц</label>
                    <input class="form__control" type="number" name="sumPerMonth" id="sumPerMonth" value="${debt.sumPerMonth}">

                    <div class="checkbox">
                        <input id="markAsDebt" type="checkbox" name="markAsDebt" ${debt.markAsDebt ? 'checked': ''}>
                        <label for="markAsDebt">Отметить как долг</label>
                    </div>

                    <div class="form__submit-wrp"><button class="form__submit" type="submit">Сохранить</button></div>
                </form>
            `
        } else {
            this.modal.querySelector('.modal__title').textContent = 'Создаём новый долг';
            form.innerHTML = `
                <form action="#" method="POST" class="modal__form">
                    <label for="debtName">Название</label>
                    <input class="form__control" type="text" name="name" id="debtName">

                    <label for="remaining">Сколько осталось</label>
                    <input class="form__control" type="number" name="remaining" id="remaining">

                    <label for="sumPerMonth">Сколько в месяц</label>
                    <input class="form__control" type="number" name="sumPerMonth" id="sumPerMonth">

                    <div class="checkbox">
                        <input id="markAsDebt" type="checkbox" name="markAsDebt">
                        <label for="markAsDebt">Отметить как долг</label>
                    </div>

                    <div class="form__submit-wrp"><button class="form__submit" type="submit">Сохранить</button></div>
                </form>
            `
        }

        return form;
    }

    init() {
        this.bindTriggers();
    }
}
