import CalculatorService from "../services/calc.service";

export default class Total {
    constructor() {
        this.root = document.querySelector('.root');
        this.calcService = new CalculatorService();
    }

    async update() {
        const perMonth = await this.calcService.getTotalSumPerMonth();
        const remaining = await this.calcService.getTotalSumRemaining();
        const div = document.createElement('div');
        div.classList.add('total__wrapper');
        div.innerHTML = `
            <div class="total__per-month-wrp">
                <span>Всего в месяц:</span>
                <span>${perMonth} руб</span>
            </div>
            <div class="total__remaining-wrp">
                <span>Остаток всего долга:</span>
                <span>${remaining} руб</span>
            </div>
        `;

        if (this.root.querySelector('.total__wrapper')) {
            this.root.querySelector('.total__wrapper').remove();
            this.root.appendChild(div);
        } else {
            this.root.appendChild(div);
        }
    }

    init() {
        this.update();
    }
}
