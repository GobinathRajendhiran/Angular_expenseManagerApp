// src/app/models/transaction.model.ts
export interface Transaction {
    id: number;
    description: string;
    amount: number;
    date: string;
    type: 'credit' | 'debit';
    category?: string;
  }
  