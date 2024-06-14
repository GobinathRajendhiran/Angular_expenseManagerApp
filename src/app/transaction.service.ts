import { Injectable } from '@angular/core';
import { Transaction } from './models/transaction.model';

@Injectable({
  providedIn: 'root'
})

export class TransactionService {
  transactions: Transaction[] = [];
  storageKey = 'transactions';

  constructor() {
    this.loadTransactions();
  }

  isLocalStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  loadTransactions(): void {
    if(this.isLocalStorageAvailable()) {
      const savedTransactions = localStorage.getItem(this.storageKey);
      if (savedTransactions) {
        this.transactions = JSON.parse(savedTransactions);
      }
    } else {
      console.log("Localstorage is not available")
    }
  }

  saveTransactions(): void {
    if(this.isLocalStorageAvailable()) {
      localStorage.setItem(this.storageKey, JSON.stringify(this.transactions));
    } else {
      console.log("Localstorage is not available")
    }
  }

  getTransactions(): Transaction[] {
    return this.transactions;
  }

  addTransaction(transaction: Transaction): void {
    this.transactions.push(transaction);
    this.saveTransactions();
  }

  updateTransaction(updatedTransaction: Transaction): void {
    const index = this.transactions.findIndex(t => t.id === updatedTransaction.id);
    if (index !== -1) {
      this.transactions[index] = updatedTransaction;
      this.saveTransactions();
    }
  }

  deleteTransaction(id: number): void {
    this.transactions = this.transactions.filter(t => t.id !== id);
    this.saveTransactions();
  }

  getSummary(): { income: number, expense: number, balance: number } {
    const income = this.transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
    const expense = this.transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expense;
    return { income, expense, balance };
  }
}