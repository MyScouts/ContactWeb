import { Injectable } from "@angular/core";
import { CookieService } from "@gorniv/ngx-cookie";

@Injectable()
export class UniversalStorage implements Storage {
  [index: number]: string;
  [key: string]: any;
  length: number;
  cookies: any;

  constructor(
    private cookieService: CookieService

  ) { }

  clear(): void {
    this.cookieService.removeAll();
  }
  getItem(key: string): string {
    return this.cookieService.get(key);
  }
  key(index: number): string {
    return this.cookieService.getAll().propertyIsEnumerable[index];
  }
  removeItem(key: string): void {
    this.cookieService.remove(key);
  }
  setItem(key: string, data: string, expires_seconds: number = 3600 * 24 * 30): void {
    let d = new Date();
    d = new Date(d.getTime() + 1000 * expires_seconds);
    let expires = d.toUTCString();
    this.cookieService.put(key, data, {
      expires: expires
    });

  }

}
