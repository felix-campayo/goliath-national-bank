import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { AppConfig } from '../../config/app.config';
import { ProductModel } from '../../models/product.model';
import { CurrencyModel } from '../../models/currency.model';
import { RateModel } from '../../models/rate.model';
import { TransactionModel } from '../../models/transaction.model';
import { OperationFailure } from 'models/http.model';
import { RateService } from '../rate/rate.service';
import { MathService } from '../math/math.service';

@Injectable()
export class TransactionService {

  constructor(
    private http: HttpClient,
    private rateService: RateService,
    private mathService: MathService
  ) { }

  /**
   * Returns list of items
   */
  getTransactionsList(): Observable<TransactionModel[] | OperationFailure> {
    return this.http.get<any>(
      AppConfig.http.transactions.getListOfTransactions.url,
      {
        headers: AppConfig.http.transactions.getListOfTransactions.headers
      })
      .catch((error) => Observable.throw({ message: AppConfig.errors.text }));
  }

  /**
   * Returns total sales for the selected product and currency
   * @param product
   * @param transactionList
   */
  getTotalSales(product: ProductModel, transactionList: TransactionModel[]): number {
    let ret: number;

    if (product &&
      transactionList &&
      transactionList.length > 0) {

      ret = transactionList
        // Product filter by name
        .filter((elem) => product.name === elem.sku).length;

    } else {
      ret = 0;
    }

    return ret;
  }

  /**
   * Returns total amount for the selected product and currency
   * @param product
   * @param transactionList
   * @param currency
   * @param rateList
   */
  getTotalAmount(
    product: ProductModel,
    transactionList: TransactionModel[],
    currency: CurrencyModel,
    rateList: RateModel[]): number {

    let ret: number;

    if (product &&
      transactionList &&
      transactionList.length > 0 &&
      currency &&
      rateList &&
      rateList.length > 0) {

      ret = transactionList
        // Product filter by name
        .filter((elem) => product.name === elem.sku)
        // Returns only amounts
        .map((elem) => {
          let num: number;

          // From and To have the same currency
          if (currency.name === elem.currency) {
            num = Number(elem.amount);
          } else {
            // We need to exchange the currency
            const aux: number = this.rateService.getRateValue(elem.currency, currency.name, rateList);
            const auxAmount: number = Number(elem.amount);
            if (!Number.isNaN(aux) && !Number.isNaN(auxAmount)) {
              num = this.mathService.roundHalfEven(aux * auxAmount);
            }
          }

          return num;
        })
        // Add all amounts
        .reduce((prev, current) => {
          let partial: number;

          if (!Number.isNaN(prev) && !Number.isNaN(current)) {
            partial = prev + current;
          }

          return partial;
        }, 0);

    } else {
      ret = 0;
    }

    return ret;
  }
}
