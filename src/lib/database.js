import { supabase, isSupabaseConfigured } from '../supabase';

const STORAGE_KEY = 'student-finance-transactions';

const readLocalTransactions = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
};

const writeLocalTransactions = (transactions) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
};

const sortByDate = (transactions) =>
  [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

const shouldUseLocalFallback = (error) => {
  const message = String(error?.message || error || '').toLowerCase();

  return (
    message.includes("could not find the table") ||
    message.includes('schema cache') ||
    message.includes('relation') ||
    message.includes('does not exist') ||
    message.includes('permission denied') ||
    message.includes('row-level security') ||
    message.includes('jwt') ||
    message.includes('auth') ||
    message.includes('not authenticated')
  );
};

const createLocalTransaction = (transaction) => ({
  ...transaction,
  id: crypto.randomUUID(),
  created_at: new Date().toISOString(),
});

export const db = {
  transactions: {
    async getAll(userId) {
      if (!isSupabaseConfigured || !supabase) {
        return sortByDate(readLocalTransactions().filter((tx) => tx.user_id === userId));
      }

      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false });

        if (error) throw error;
        return data;
      } catch (error) {
        if (shouldUseLocalFallback(error)) {
          return sortByDate(readLocalTransactions().filter((tx) => tx.user_id === userId));
        }
        throw error;
      }
    },

    async create(transaction) {
      if (!isSupabaseConfigured || !supabase) {
        const nextTransaction = createLocalTransaction(transaction);
        const transactions = readLocalTransactions();
        writeLocalTransactions([nextTransaction, ...transactions]);
        return nextTransaction;
      }

      try {
        const { data, error } = await supabase
          .from('transactions')
          .insert([transaction])
          .select();

        if (error) throw error;
        return data[0];
      } catch (error) {
        if (shouldUseLocalFallback(error)) {
          const nextTransaction = createLocalTransaction(transaction);
          const transactions = readLocalTransactions();
          writeLocalTransactions([nextTransaction, ...transactions]);
          return nextTransaction;
        }
        throw error;
      }
    },

    async update(id, updates) {
      if (!isSupabaseConfigured || !supabase) {
        const transactions = readLocalTransactions().map((transaction) =>
          transaction.id === id ? { ...transaction, ...updates } : transaction
        );
        writeLocalTransactions(transactions);
        return transactions.find((transaction) => transaction.id === id);
      }

      try {
        const { data, error } = await supabase
          .from('transactions')
          .update(updates)
          .eq('id', id)
          .select();

        if (error) throw error;
        return data[0];
      } catch (error) {
        if (shouldUseLocalFallback(error)) {
          const transactions = readLocalTransactions().map((transaction) =>
            transaction.id === id ? { ...transaction, ...updates } : transaction
          );
          writeLocalTransactions(transactions);
          return transactions.find((transaction) => transaction.id === id);
        }
        throw error;
      }
    },

    async delete(id) {
      if (!isSupabaseConfigured || !supabase) {
        writeLocalTransactions(readLocalTransactions().filter((transaction) => transaction.id !== id));
        return true;
      }

      try {
        const { error } = await supabase
          .from('transactions')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return true;
      } catch (error) {
        if (shouldUseLocalFallback(error)) {
          writeLocalTransactions(readLocalTransactions().filter((transaction) => transaction.id !== id));
          return true;
        }
        throw error;
      }
    },

    async getByCategory(userId) {
      if (!isSupabaseConfigured || !supabase) {
        return readLocalTransactions()
          .filter((transaction) => transaction.user_id === userId)
          .reduce((acc, curr) => {
            if (!acc[curr.category]) acc[curr.category] = 0;
            acc[curr.category] += parseFloat(curr.amount);
            return acc;
          }, {});
      }

      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('category, amount, type')
          .eq('user_id', userId);

        if (error) throw error;

        return data.reduce((acc, curr) => {
          if (!acc[curr.category]) acc[curr.category] = 0;
          acc[curr.category] += parseFloat(curr.amount);
          return acc;
        }, {});
      } catch (error) {
        if (shouldUseLocalFallback(error)) {
          return readLocalTransactions()
            .filter((transaction) => transaction.user_id === userId)
            .reduce((acc, curr) => {
              if (!acc[curr.category]) acc[curr.category] = 0;
              acc[curr.category] += parseFloat(curr.amount);
              return acc;
            }, {});
        }
        throw error;
      }
    }
  }
};
