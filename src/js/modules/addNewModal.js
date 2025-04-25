import DataBaseService from "../services/dataBase.service";

export default class AddNewModal {
    constructor() {
        this.btn = document.querySelector('.add-new');
        this.form = document.querySelector('form');
        this.modalClose = document.querySelector('.modal__close');
        this.formSubmit = document.querySelector('.form__submit');
        this.modal = document.querySelector('.modal');
        this.dataBaseService = new DataBaseService();
    }

    bindTriggers() {
        this.btn.addEventListener('click', () => {
            this.openModal();
        })

        this.postFormData();

        this.modalClose.addEventListener('click', () => {
            this.closeModal();
        })
    }

    openModal() {
        this.modal.style.display = 'block';
    }

    postFormData() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (this.validateForm()) {
                return;
            }

            const data = new FormData(this.form);
            await this.dataBaseService.postDebt(Object.fromEntries(data))

            location.reload();
        })

    }

    closeModal() {
        this.modal.style.display = '';
        this.form.reset();
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input');

        const isHasEmpty = Array.from(inputs).every(inp => inp.value);

        if (!isHasEmpty) {
            return true;
        } else {
            this.formSubmit.disabled = true;
            return false;
        }
    }

    init() {
        this.bindTriggers();
    }
}
