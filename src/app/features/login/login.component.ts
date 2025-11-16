import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

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

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Пожалуйста, заполните все поля';
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
          this.errorMessage = 'Неверные данные для входа';
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.errorMessage = 'Произошла ошибка при входе';
        this.isLoading = false;
      }
    });
  }
}

