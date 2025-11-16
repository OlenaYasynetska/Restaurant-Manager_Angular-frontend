import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  username: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentUser());
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor() {}

  // Проверка наличия токена в localStorage
  private hasToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  // Получение текущего пользователя из localStorage
  private getCurrentUser(): User | null {
    const userStr = localStorage.getItem('current_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Вход в систему
  login(username: string, password: string): Observable<boolean> {
    return new Observable(observer => {
      // Имитация запроса к API (в реальном проекте здесь будет HTTP запрос)
      setTimeout(() => {
        if (username && password) {
          const user: User = {
            username: username,
            email: `${username}@restaurant.com`
          };

          // Сохраняем токен и пользователя
          localStorage.setItem('auth_token', 'fake-jwt-token-' + Date.now());
          localStorage.setItem('current_user', JSON.stringify(user));

          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(user);

          observer.next(true);
          observer.complete();
        } else {
          observer.next(false);
          observer.complete();
        }
      }, 500);
    });
  }

  // Выход из системы
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  // Проверка авторизации
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // Получение текущего пользователя
  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
}

