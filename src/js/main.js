import AddNewModal from "./modules/modal";
import Debts from "./modules/debts"
import Total from "./modules/total";

window.addEventListener('DOMContentLoaded', () => {
    new Debts().init();
    // new AddNewModal().init();
    new Total().init();
})
