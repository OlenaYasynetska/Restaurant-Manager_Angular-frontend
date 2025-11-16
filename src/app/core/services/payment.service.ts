import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Payment, PaymentMethod } from '../models/restaurant.models';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor() {}

  // Обработать оплату
  processPayment(
    orderId: number,
    amount: number,
    method: PaymentMethod,
    cashAmount?: number,
    cardAmount?: number
  ): Observable<Payment> {
    return new Observable(observer => {
      // Имитация обработки оплаты (в реальном приложении это будет HTTP запрос)
      setTimeout(() => {
        const payment: Payment = {
          orderId,
          method,
          amount,
          cashAmount,
          cardAmount,
          change: this.calculateChange(amount, method, cashAmount),
          paidAt: new Date()
        };
        
        observer.next(payment);
        observer.complete();
      }, 500);
    });
  }

  // Рассчитать сдачу
  private calculateChange(totalAmount: number, method: PaymentMethod, cashAmount?: number): number {
    if (method === PaymentMethod.CASH && cashAmount) {
      return Math.max(0, cashAmount - totalAmount);
    }
    if (method === PaymentMethod.MIXED && cashAmount) {
      const remaining = totalAmount - (cashAmount || 0);
      return remaining < 0 ? Math.abs(remaining) : 0;
    }
    return 0;
  }

  // Валидация суммы оплаты
  validatePayment(totalAmount: number, cashAmount?: number, cardAmount?: number): {
    valid: boolean;
    error?: string;
  } {
    if (cashAmount !== undefined && cardAmount !== undefined) {
      // Частичная оплата
      const sum = cashAmount + cardAmount;
      if (sum < totalAmount) {
        return { valid: false, error: 'Сумма оплаты меньше общей суммы заказа' };
      }
      return { valid: true };
    }
    
    if (cashAmount !== undefined && cashAmount < totalAmount) {
      return { valid: false, error: 'Внесенная сумма меньше общей суммы заказа' };
    }
    
    return { valid: true };
  }
}

