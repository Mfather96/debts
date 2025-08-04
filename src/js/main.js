import Debts from "./modules/debts"
import Total from "./modules/total";
import CalculatorService from "./services/calc.service";

window.addEventListener('DOMContentLoaded', async () => {
    const root = document.querySelector('.root');
    const tabs = document.querySelector('.tabs');

    const debts = new Debts(root);
    debts.init();

    await new Total(root).init();

    tabs.addEventListener('click', (e) => {
        let target = e.target;

        Array.from(tabs.children).forEach(tab => tab.classList.remove('active'));
        e.target.classList.add('active');
        if (target && target.classList.contains('done-tab')) {
            debts.prepareDebtsLists('done');
        } else {
            debts.prepareDebtsLists();
        }
        debts.listenDebtsHandlers();
    })
})
