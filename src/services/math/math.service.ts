import { Injectable } from '@angular/core';

@Injectable()
export class MathService {

  /**
   * Round amount half even
   * @param amount
   */
  roundHalfEven(amount: number): number {
    return 2 * Math.round(100 * amount / 2) / 100;
  }
}
