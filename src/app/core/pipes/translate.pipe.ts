import { Pipe, PipeTransform, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { LanguageService } from '../services/language.service';
import { Subscription } from 'rxjs';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private lastKey: string = '';
  private lastValue: string = '';
  private subscription?: Subscription;

  constructor(
    private languageService: LanguageService,
    private changeDetector: ChangeDetectorRef
  ) {
    // Подписываемся на изменения языка
    this.subscription = this.languageService.currentLanguage$.subscribe(() => {
      this.lastValue = '';
      this.changeDetector.markForCheck();
    });
  }

  transform(key: string): string {
    if (!key) return '';
    
    // Если ключ не изменился и значение уже есть, возвращаем кэшированное значение
    if (key === this.lastKey && this.lastValue) {
      return this.lastValue;
    }

    this.lastKey = key;
    this.lastValue = this.languageService.translate(key);
    return this.lastValue;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

