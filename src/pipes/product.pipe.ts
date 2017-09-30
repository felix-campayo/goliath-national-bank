// Angular 2
import { Pipe, PipeTransform } from '@angular/core';
import { ProductModel } from '../models/product.model';
import { TransactionModel } from '../models/transaction.model';
import { AppConfig } from '../config/app.config';

@Pipe({ name: 'productPipe' })
export class ProductPipe implements PipeTransform {

  transform(list: TransactionModel[], productSelected: ProductModel): TransactionModel[] {
    let ret: TransactionModel[];
    ret = [];
    // If 'All Products' is selected, we return all the list
    if (productSelected && productSelected.name === AppConfig.defaultAllProducts) {
      ret = list;
      // If a product is given, we filter the list with that product
    } else if (productSelected && list && list.length > 0) {
      ret = list.filter((elem) => elem.sku === productSelected.name);
      // If no product is given we return the whole list
    } else if (list && list.length > 0) {
      ret = list;
    }

    return ret;
  }
}
