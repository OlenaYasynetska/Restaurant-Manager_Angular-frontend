import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { LanguageService, Language } from '../../core/services/language.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent {
  currentUser$ = this.authService.currentUser$;
  currentLanguage$ = this.languageService.currentLanguage$;

  constructor(
    private authService: AuthService,
    private router: Router,
    public languageService: LanguageService
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  setLanguage(lang: Language): void {
    this.languageService.setLanguage(lang);
  }
}

