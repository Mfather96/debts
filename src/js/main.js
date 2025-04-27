import Debts from "./modules/debts"
import Total from "./modules/total";

window.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('.root');
    new Debts(root).init();
    new Total(root).init();
})
