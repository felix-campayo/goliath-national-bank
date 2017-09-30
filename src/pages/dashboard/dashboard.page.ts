import { Component, ViewEncapsulation } from '@angular/core';
import { TransactionModel } from '../../models/transaction.model';
import { ProductModel } from '../../models/product.model';
import { RateModel } from '../../models/rate.model';
import { CurrencyModel } from '../../models/currency.model';
import { TransactionService } from '../../services/transactions/transaction.service';
import { ProductService } from '../../services/product/product.service';
import { RateService } from '../../services/rate/rate.service';
import { CurrencyService } from '../../services/currency/currency.service';
import { DialogService } from '../../services/dialog/dialog.service';
import { ProductPipe } from '../../pipes/product.pipe';
import { AppConfig } from '../../config/app.config';
import { CurrencyPipe } from '@angular/common';
import { MenuItem } from '../../interfaces/dropdown.interface';
import { OperationFailure } from '../../models/http.model';
import { Observable } from 'rxjs/Observable';
import { ComponentLoader } from '../../models/common.model';

@Component({
  selector: 'app-root',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardPageComponent {

  transactionList: TransactionModel[];                            // Transaction list
  productList: ProductModel[];                                    // Product list
  productSelected: ProductModel;                                  // Product selected
  currencyList: CurrencyModel[];                                  // Currency list
  currencySelected: CurrencyModel;                                // Currency selected
  readonly allProducts: string = AppConfig.defaultAllProducts;    // Default text
  readonly rows: number = AppConfig.defaultRows;                  // Default rows
  readonly numberFormat: string = AppConfig.defaultNumberFormat;  // Default number format
  isLoading: ComponentLoader;                                     // Components loaders

  private rateList: RateModel[];                                  // Currency Exchange List

  constructor(
    private transactionService: TransactionService,
    private productService: ProductService,
    private rateService: RateService,
    private currencyService: CurrencyService,
    private productPipe: ProductPipe,
    public dialogService: DialogService
  ) {
    // Init loaders
    this.updateLoaders(true);

    // Begin requests to get the data
    let requests;
    requests = [];
    requests.push(
      // Get transaction list
      this.transactionService.getTransactionsList()
        .flatMap((data: TransactionModel[]) => {
          this.transactionList = data;
          this.isLoading.transactionList = false;
          return this.productService.getProductList(data);
        })
        // Get product list
        .map((data: ProductModel[]) => {
          this.productList = data;
          // Push the default value (All Products)
          if (this.productList.length > 0) {
            this.productSelected = { name: this.allProducts };
            this.productList.unshift(this.productSelected);
          }
          this.isLoading.productList = false;
        }));

    // Get rate list
    requests.push(this.rateService.getRateList()
      .flatMap((data: RateModel[]) => {
        this.rateList = data;
        this.isLoading.rateList = false;
        return this.currencyService.getCurrencyList(data);
      })
      // Get currency list
      .map((data: CurrencyModel[]) => {
        this.currencyList = data;
        // Set EUR as default currency and push it in the beginnig of the array
        if (this.currencyList.length > 0) {
          this.currencySelected = this.currencyList.find((elem: CurrencyModel) => elem.name === AppConfig.defaultCurrency);
          if (this.currencySelected) {
            this.currencyList.splice(this.currencyList.indexOf(this.currencySelected), 1);
            this.currencyList.unshift(this.currencySelected);
          } else {
            this.currencySelected = this.currencyList[0];
          }
        }
        this.isLoading.currencyList = false;
      }));

    // Send all requests
    Observable.forkJoin(requests)
      .subscribe(undefined,
      // In case it fails, we display an error message
      (error: OperationFailure) => {
        // Update loaders
        this.updateLoaders(false);
        this.dialogService.show(AppConfig.errors.title, error.message);
      });
  }

  /**
   * Selected product
   */
  selectedProduct(item: ProductModel): void {
    this.productSelected = item;
  }

  /**
   * Selected currency
   */
  selectedCurrency(item: CurrencyModel): void {
    this.currencySelected = item;
  }

  /**
   * Returns total amount for the selected product and currency
   */
  getTotalAmount(): number {
    let ret: number;

    // Get total amount of all products
    if (this.productSelected && this.productSelected.name === this.allProducts) {
      ret = 0;
      for (let i = 0; i < this.productList.length; i++) {
        ret = ret + this.transactionService.getTotalAmount(
          this.productList[i],
          this.transactionList,
          this.currencySelected,
          this.rateList);
      }
      // Get total amount for a given product
    } else {
      ret = this.transactionService.getTotalAmount(
        this.productSelected,
        this.transactionList,
        this.currencySelected,
        this.rateList);
    }

    return ret;
  }

  /**
   * Returns total sales
   */
  getTotalSales(): number {
    let ret: number;
    // Get total sales for all products
    if (this.productSelected && this.productSelected.name === this.allProducts) {
      ret = 0;
      for (let i = 0; i < this.productList.length; i++) {
        ret = ret + this.transactionService.getTotalSales(
          this.productList[i],
          this.transactionList);
      }
      // Get total sales for a given product
    } else {
      ret = this.transactionService.getTotalSales(
        this.productSelected,
        this.transactionList);
    }

    return ret;
  }

  /**
   * Enable product name column
   */
  enableProductName(): boolean {
    return !this.productSelected || (this.productSelected && this.productSelected.name === AppConfig.defaultAllProducts);
  }

  /**
   * Update isLoading structure to the given value
   * @param value
   */
  private updateLoaders(value: boolean): void {
    this.isLoading = {
      transactionList: value,
      productList: value,
      rateList: value,
      currencyList: value
    };
  }

  /**
   * Returns currency symbol
   */
  private getCurrencySymbol(): string {
    let ret: string;

    if (this.currencySelected) {
      ret = this.currencySelected.name;
    } else {
      ret = AppConfig.defaultCurrency;
    }

    return ret;
  }
}
