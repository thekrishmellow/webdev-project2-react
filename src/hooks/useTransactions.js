import { useState, useEffect, useCallback } from 'react';
import { db } from '../lib/database';
import { useAuth } from '../context/useAuth';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchTransactions = useCallback(async () => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      setError(null);
      const data = await db.transactions.getAll(user.id);
      setTransactions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addTransaction = async (transaction) => {
    try {
      const newTx = await db.transactions.create({
        ...transaction,
        user_id: user?.id || 'local-student-user'
      });
      setTransactions(prev => [newTx, ...prev]);
      return { data: newTx, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await db.transactions.delete(id);
      setTransactions(prev => prev.filter(tx => tx.id !== id));
      return { error: null };
    } catch (err) {
      return { error: err.message };
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadTransactions = async () => {
      if (!user) {
        if (!cancelled) {
          setTransactions([]);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        setError(null);
        const data = await db.transactions.getAll(user.id);
        if (!cancelled) {
          setTransactions(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadTransactions();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const now = new Date();
  const currentMonthTransactions = transactions.filter((tx) => {
    const txDate = new Date(tx.date);
    return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
  });

  const totalBalance = transactions.reduce((acc, tx) => {
    return tx.type === 'income' ? acc + parseFloat(tx.amount) : acc - parseFloat(tx.amount);
  }, 0);

  const monthlySpending = currentMonthTransactions
    .filter(tx => tx.type === 'expense')
    .reduce((acc, tx) => acc + parseFloat(tx.amount), 0);

  const monthlyIncome = currentMonthTransactions
    .filter(tx => tx.type === 'income')
    .reduce((acc, tx) => acc + parseFloat(tx.amount), 0);

  const monthlyBudget = 800;
  const availableThisMonth = monthlyBudget + monthlyIncome;
  const budgetRemaining = availableThisMonth - monthlySpending;
  const savingsRate = monthlyIncome > 0 ? Math.round(((monthlyIncome - monthlySpending) / monthlyIncome) * 100) : 0;

  const expenseTransactions = currentMonthTransactions.filter((tx) => tx.type === 'expense');
  const averageExpense = expenseTransactions.length > 0
    ? expenseTransactions.reduce((acc, tx) => acc + parseFloat(tx.amount), 0) / expenseTransactions.length
    : 0;

  const topCategory = Object.entries(
    expenseTransactions.reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + parseFloat(tx.amount);
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None yet';

  return {
    transactions,
    loading,
    error,
    addTransaction,
    deleteTransaction,
    refresh: fetchTransactions,
    stats: {
      totalBalance,
      monthlySpending,
      monthlyIncome,
      monthlyBudget,
      availableThisMonth,
      budgetRemaining,
      savingsRate,
      averageExpense,
      topCategory,
    }
  };
};
