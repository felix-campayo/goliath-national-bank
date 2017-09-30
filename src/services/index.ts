import { CurrencyService } from './currency/currency.service';
import { DialogService } from './dialog/dialog.service';
import { MathService } from './math/math.service';
import { ProductService } from './product/product.service';
import { RateService } from './rate/rate.service';
import { TransactionService } from './transactions/transaction.service';

export const SERVICES: any[] = [
  CurrencyService,
  DialogService,
  MathService,
  ProductService,
  RateService,
  TransactionService
];
