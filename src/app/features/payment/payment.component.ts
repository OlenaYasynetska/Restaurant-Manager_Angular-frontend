import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { OrderService } from '../../core/services/order.service';
import { PaymentService } from '../../core/services/payment.service';
import { TableService } from '../../core/services/table.service';
import { Order, PaymentMethod } from '../../core/models/restaurant.models';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './payment.component.html',
})
export class PaymentComponent implements OnInit {
  order$!: Observable<Order | undefined>;
  orderId!: number;
  
  selectedMethod: PaymentMethod = PaymentMethod.CASH;
  PaymentMethod = PaymentMethod;
  
  // Для наличных
  cashReceived: number = 0;
  change: number = 0;
  
  // Для смешанной оплаты
  cashAmount: number = 0;
  cardAmount: number = 0;
  
  isProcessing: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private paymentService: PaymentService,
    private tableService: TableService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('orderId'));
    this.order$ = this.orderService.getOrderById(this.orderId);
  }

  // Выбор метода оплаты
  selectMethod(method: PaymentMethod): void {
    this.selectedMethod = method;
    this.resetInputs();
  }

  // Сброс полей ввода
  resetInputs(): void {
    this.cashReceived = 0;
    this.change = 0;
    this.cashAmount = 0;
    this.cardAmount = 0;
  }

  // Рассчитать сдачу
  calculateChange(totalAmount: number): void {
    if (this.cashReceived >= totalAmount) {
      this.change = this.cashReceived - totalAmount;
    } else {
      this.change = 0;
    }
  }

  // Быстрые кнопки для наличных
  addQuickAmount(amount: number): void {
    this.cashReceived += amount;
    this.order$.subscribe(order => {
      if (order) {
        this.calculateChange(order.totalAmount);
      }
    });
  }

  // Точная сумма
  setExactAmount(totalAmount: number): void {
    this.cashReceived = totalAmount;
    this.change = 0;
  }

  // Обработать оплату
  processPayment(order: Order): void {
    if (this.isProcessing) return;

    // Валидация
    let cashAmt: number | undefined;
    let cardAmt: number | undefined;

    switch (this.selectedMethod) {
      case PaymentMethod.CASH:
        if (this.cashReceived < order.totalAmount) {
          alert(this.t('payment.alert.cashLess'));
          return;
        }
        cashAmt = this.cashReceived;
        break;
      
      case PaymentMethod.MIXED:
        if (this.cashAmount + this.cardAmount < order.totalAmount) {
          alert(this.t('payment.alert.splitLess'));
          return;
        }
        cashAmt = this.cashAmount;
        cardAmt = this.cardAmount;
        break;
      
      case PaymentMethod.CARD:
      case PaymentMethod.QR:
        // Для карты и QR дополнительная валидация не нужна
        break;
    }

    // Обработка оплаты
    this.isProcessing = true;

    this.paymentService.processPayment(
      order.id,
      order.totalAmount,
      this.selectedMethod,
      cashAmt,
      cardAmt
    ).subscribe({
      next: (payment) => {
        // Помечаем заказ как оплаченный
        this.orderService.markOrderAsPaid(order.id);
        
        // Освобождаем столик
        this.tableService.closeTable(order.tableId);
        
        // Показываем успех и возвращаемся к столикам
        alert(`${this.t('payment.success')}${payment.change ? `\n${this.formatChangeLabel(payment.change)}` : ''}`);
        this.router.navigate(['/tables']);
      },
      error: (error) => {
        alert(this.t('payment.error'));
        this.isProcessing = false;
      }
    });
  }

  // Отменить оплату
  cancel(): void {
    if (confirm(this.t('payment.cancelConfirm'))) {
      this.order$.subscribe(order => {
        if (order) {
          this.router.navigate(['/orders', order.tableId]);
        }
      });
    }
  }

  formatOrderInfo(order: Order): string {
    return this.t('payment.orderInfo')
      .replace('{{table}}', order.tableNumber)
      .replace('{{order}}', order.id.toString());
  }

  formatChangeLabel(change: number): string {
    return this.t('payment.success.change').replace('{{change}}', this.formatPrice(change));
  }

  // Вычислить остаток к оплате (для частичной оплаты)
  calculateRemaining(totalAmount: number): number {
    if (this.selectedMethod === PaymentMethod.MIXED) {
      return Math.max(0, totalAmount - this.cashAmount - this.cardAmount);
    }
    return 0;
  }

  // Форматирование цены
  formatPrice(price: number): string {
    return new Intl.NumberFormat(this.getLocale(), {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  private t(key: string): string {
    return this.languageService.translate(key);
  }

  private getLocale(): string {
    const lang = this.languageService.getCurrentLanguage();
    switch (lang) {
      case 'de':
        return 'de-DE';
      case 'ru':
        return 'ru-RU';
      default:
        return 'en-US';
    }
  }
}

