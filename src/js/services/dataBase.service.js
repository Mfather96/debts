import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://kbtluehjnmasvysihriw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtidGx1ZWhqbm1hc3Z5c2locml3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MzY5ODgsImV4cCI6MjA2MTAxMjk4OH0.Xo7h8-9LRp6JrzY7Z2T4TFgGRG8urXZyp3U7laAV-sQ';
const supabase = createClient(supabaseUrl, supabaseKey);

export default class DataBaseService {
    constructor() {}

    async getDebts() {
        const data = await supabase.from('debts').select('*');
        return data.data;
    }

    async postDebt(debt) {
        await supabase.from('debts').upsert([{
            name: debt.name,
            remaining: +debt.remaining,
            sumPerMonth: +debt.sumPerMonth,
            isOver: false,
            markAsDebt: debt.markAsDebt,
        }]);
    }

    async updateDebt(debt, newValue) {
        await supabase.from('debts')
            .update(newValue)
            .match({id: debt.id});
    }

    async deleteDebt(debt) {
        await supabase.from('debts')
            .delete()
            .match({name: debt.name});
    }
}
