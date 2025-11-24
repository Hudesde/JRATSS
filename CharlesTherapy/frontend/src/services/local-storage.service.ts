import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  isAvailable(): boolean {
    return this.isBrowser && typeof window !== 'undefined' && !!window.localStorage;
  }

  getItem(key: string): string | null {
    return this.isAvailable() ? window.localStorage.getItem(key) : null;
  }

  setItem(key: string, value: string): void {
    if (this.isAvailable()) {
      window.localStorage.setItem(key, value);
    }
  }

  removeItem(key: string): void {
    if (this.isAvailable()) {
      window.localStorage.removeItem(key);
    }
  }

  clear(): void {
    if (this.isAvailable()) {
      window.localStorage.clear();
    }
  }
}
