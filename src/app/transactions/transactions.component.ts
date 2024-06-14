import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../transaction.service';
import { Transaction } from '../models/transaction.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})

export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  transactionForm!: FormGroup;
  updateTransactionClick: boolean = false;
  public chart: any;
  credit: number = 0;
  debit: number = 0;

  constructor(private transactionService: TransactionService, private fb: FormBuilder) { 
    this.transactionForm = this.fb.group({
      description : ['', [Validators.required]],
      amount : ['',[Validators.required]],
      date : ['', [Validators.required]],
      type : ['', [Validators.required]],
      category : ['', [Validators.required]],
      id : ['']
    })
  }

  ngOnInit(): void {
    this.transactions = this.transactionService.getTransactions();
    this.transactions.forEach(ele => {
      if (ele.type == 'credit') {
        this.credit += ele.amount
      } else {
        this.debit += ele.amount
      }
    })
    this.createChart();
  }

  createChart() {
    if(this.chart) {
      this.chart.destroy()
    }   

    this.chart = new Chart("MyChart", {
      type: 'pie', //this denotes tha type of chart
      data: {
        labels: ['Credit', 'Debit'],
        datasets: [{
          label: 'Transaction history',
          data: [this.credit, this.debit],
          backgroundColor: [
            'green',
            'red'
          ],
          hoverOffset: 4
        }],
      },
      options: {
        aspectRatio: 2.5
      }

    });
  }

  addTransaction(): void {
    var formData = this.transactionForm.value;
    const newTransaction: Transaction = {
      id: Date.now(),
      description : formData.description,
      amount : formData.amount,
      date : formData.date,
      type : formData.type,
      category : formData.category
    };

    this.transactionService.addTransaction(newTransaction);
    this.transactions = this.transactionService.getTransactions();
    this.transactionForm.reset()
    this.updateChartData()
    
  }

  clearTransactionForm() {
    this.transactionForm.reset();
    this.updateTransactionClick = false;
  }

  editTransactionData(data: any) {
    this.updateTransactionClick = true;
    this.transactionForm.patchValue({
      description : data.description,
      amount : data.amount,
      date : data.date,
      type : data.type,
      category : data.category,
      id: data.id
    })
  }

  updateTransaction(): void {
    this.updateTransactionClick = false;
    let data = this.transactionForm.value;
    let index = this.transactions.findIndex(ele => ele.id == data.id);
    if (index >= 0) {
      var transaction = {
        description: data.description,
        amount: data.amount,
        date: data.date,
        type: data.type,
        category: data.category,
        id: data.id
      }
      this.transactions[index] = transaction
      this.transactionService.updateTransaction(transaction)
      this.transactions = this.transactionService.getTransactions();
      this.transactionForm.reset()
      this.updateChartData()
    } else {
      var transaction = {
        description: data.description,
        amount: data.amount,
        date: data.date,
        type: data.type,
        category: data.category,
        id: data.id
      }
      this.transactions.push(transaction);
      this.transactionService.updateTransaction(transaction)
      this.transactions = this.transactionService.getTransactions();
      this.transactionForm.reset()
      this.updateChartData()
    }
  }

  deleteTransaction(id: number): void {
    this.transactionService.deleteTransaction(id);
    this.transactions = this.transactionService.getTransactions();
    this.updateChartData()
  }

  updateChartData() {
    this.credit = 0;
    this.debit = 0;

    this.transactions.forEach(ele => {
      if(ele.type == 'credit') {
        this.credit += ele.amount
      } else {
        this.debit += ele.amount
      }
    })
    console.log(this.credit, this.debit)

    this.chart.data.datasets[0].data = [this.credit, this.debit];
    this.chart.update();
  }
}
