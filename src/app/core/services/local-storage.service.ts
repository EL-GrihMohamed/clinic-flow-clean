import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  tokenKey = "clinic-token";
  public darkModeKey = "clinic-dark";
  langKey = "clinic-lang";
  lang = "en";

  constructor(private translate: TranslateService) { }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(newToken: string) {
    localStorage.setItem(this.tokenKey, newToken);
  }

  cleanToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getLang(): string | null {
    return localStorage.getItem(this.langKey);
  }

  setLang(newLang: string) {
    this.lang = newLang;
    this.translate.use(newLang);
    localStorage.setItem(this.langKey, newLang);
  }

  getDarkMode(): boolean {
    return localStorage.getItem(this.darkModeKey) === 'true' ;
  }

  static getDarkMode(): boolean {
    return localStorage.getItem('clinic-dark') === 'true' ;
  }

  setDarkMode(newDarkMode: boolean) {
    localStorage.setItem(this.darkModeKey, String(newDarkMode));
  }
}
