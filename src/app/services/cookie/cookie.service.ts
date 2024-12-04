import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CookieService {

  constructor() { }

  // Verifica se o usuário já aceitou os cookies
  hasAcceptedCookies(): boolean {
    return localStorage.getItem('cookiesAccepted') === 'true';
  }

  // Define que o usuário aceitou os cookies
  acceptCookies(): void {
    localStorage.setItem('cookiesAccepted', 'true');
  }

  // Limpa a aceitação de cookies (para fins de teste ou depuração)
  clearCookies(): void {
    localStorage.removeItem('cookiesAccepted');
  }
}
