import { addSeparator } from "../helpers/currency.helper";
import CalculatorService from "../services/calc.service";

export default class Total {
    constructor(root) {
        this.root = root;
        this.calcService = new CalculatorService();
    }

    async update() {
        const perMonth = await this.calcService.getTotalSumPerMonth();
        const remaining = await this.calcService.getTotalSumRemaining();
        const requiredSum = await this.calcService.getRequiredSum();
        const monthlySum = await this.calcService.getMonthlySum();
        const div = document.createElement('div');
        div.classList.add('total__wrapper');
        div.innerHTML = `
            <div class="total__per-month-wrp">
                <span>Всего в месяц:</span>
                <span class="green-currency">${addSeparator(perMonth)} руб</span>
            </div>
            <div class="total__per-month-wrp required">
                <span>Обязательные:</span>
                <span class="green-currency">${addSeparator(requiredSum)} руб</span>
            </div>
            <div class="total__per-month-wrp monthly">
                <span>Ежемесячные:</span>
                <span class="green-currency">${addSeparator(monthlySum)} руб</span>
            </div>
            <div class="total__remaining-wrp">
                <span>Остаток всего долга:</span>
                <span class="blue-currency">${addSeparator(remaining)} руб</span>
            </div>
        `;

        if (this.root.querySelector('.total__wrapper')) {
            this.root.querySelector('.total__wrapper').remove();
            this.root.appendChild(div);
        } else {
            this.root.appendChild(div);
        }
    }

    async init() {
        await this.calcService.init();
        this.update();
    }
}
