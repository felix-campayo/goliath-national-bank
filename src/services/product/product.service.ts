import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { AppConfig } from '../../config/app.config';
import { TransactionModel } from '../../models/transaction.model';
import { ProductModel } from '../../models/product.model';
import { OperationFailure } from 'models/http.model';

@Injectable()
export class ProductService {

  /**
   * Returns list of products
   */
  getProductList(transactions: TransactionModel[]): Observable<ProductModel[] | OperationFailure> {
    return Observable.if(() => transactions !== undefined,
      Observable.of(this.extractProducts(transactions)),
      Observable.throw({ message: AppConfig.errors.text }));
  }

  /**
   * Extract all the products from the transaction model
   * @param list
   */
  private extractProducts(list: TransactionModel[]): ProductModel[] {
    return list
      .map((elem) => elem.sku)
      .filter((elem, index, self) => index === self.indexOf(elem))
      /*tslint:disable:arrow-return-shorthand*/
      .map((elem) => { return { name: elem }; });
  }
}
