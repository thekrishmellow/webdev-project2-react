import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

const buildLocalInsights = (transactions) => {
  const expenses = transactions.filter((transaction) => transaction.type === 'expense');
  const income = transactions.filter((transaction) => transaction.type === 'income');

  const totalSpent = expenses.reduce((sum, transaction) => sum + Number(transaction.amount), 0);
  const totalIncome = income.reduce((sum, transaction) => sum + Number(transaction.amount), 0);

  const topCategory = Object.entries(
    expenses.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + Number(transaction.amount);
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1])[0];

  const averageExpense = expenses.length > 0 ? totalSpent / expenses.length : 0;
  const balance = totalIncome - totalSpent;

  return {
    summary: `You logged ${expenses.length} expense entries and spent $${totalSpent.toFixed(2)}. Your current tracked balance is $${balance.toFixed(2)}, which gives you a clear picture of what is left for food, travel, and study needs.`,
    insights: [
      topCategory
        ? `${topCategory[0]} is your biggest spending category at $${topCategory[1].toFixed(2)}. Start there if you want the fastest savings win.`
        : 'Add a few expenses to reveal your biggest spending category.',
      averageExpense > 0
        ? `Your average expense is $${averageExpense.toFixed(2)}. Small repeated purchases around that amount are worth reviewing weekly.`
        : 'Once you log more entries, you will see your average spend per purchase.',
      balance >= 0
        ? 'You are still operating within your tracked income. Try moving a fixed amount into savings after each income entry.'
        : 'Your expenses are ahead of your tracked income. A weekly cap for food, transport, or entertainment would help rebalance the month.',
    ],
  };
};

const parseInsightResponse = (text) => {
  const fencedMatch = text.match(/```json\s*([\s\S]*?)```/i);
  const objectCandidate = fencedMatch?.[1] || text.match(/\{[\s\S]*\}/)?.[0];

  if (!objectCandidate) {
    throw new Error('No JSON object found in Gemini response.');
  }

  return JSON.parse(objectCandidate);
};

export const getFinancialInsights = async (transactions) => {
  if (!API_KEY || !genAI) {
    return buildLocalInsights(transactions);
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    You are a student finance coach.
    Analyze the transaction data and provide a short, encouraging summary plus 3 practical action points for a student budget.

    Transactions:
    ${JSON.stringify(transactions, null, 2)}

    Format your response as a JSON object with this exact structure:
    {
      "summary": "A friendly 1-2 sentence overview of their spending habits. Keep it clear and practical.",
      "insights": [
        "Insight 1: one useful pattern",
        "Insight 2: one caution or opportunity",
        "Insight 3: one specific next step"
      ]
    }
    Only return the raw JSON object.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return parseInsightResponse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return buildLocalInsights(transactions);
  }
};
