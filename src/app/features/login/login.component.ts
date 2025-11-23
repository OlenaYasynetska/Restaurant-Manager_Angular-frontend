import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { LanguageService, Language } from '../../core/services/language.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  currentLanguage$ = this.languageService.currentLanguage$;

  constructor(
    private authService: AuthService,
    private router: Router,
    public languageService: LanguageService
  ) {}

  translate(key: string): string {
    return this.languageService.translate(key);
  }

  setLanguage(lang: Language): void {
    this.languageService.setLanguage(lang);
  }

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.errorMessage = this.translate('login.error.fill');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.username, this.password).subscribe({
      next: (success) => {
        if (success) {
          // Перенаправляем на главную страницу после успешного входа
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = this.translate('login.error.invalid');
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.errorMessage = this.translate('login.error.general');
        this.isLoading = false;
      }
    });
  }
}

