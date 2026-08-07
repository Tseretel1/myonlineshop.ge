import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PostService, ShopUiSettings } from '../../Repositories/post.service';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private cachedShopId: number | null = null;
  private settingsSubject = new BehaviorSubject<ShopUiSettings | null>(null);
  settings$: Observable<ShopUiSettings | null> = this.settingsSubject.asObservable();

  constructor(private postService: PostService) {}

  loadForShop(shopId: number): void {
    if (!shopId || this.cachedShopId === shopId) {
      return;
    }
    this.postService.getShopUiSettings(shopId).subscribe({
      next: (settings) => {
        this.cachedShopId = shopId;
        this.applyTheme(settings);
      },
    });
  }

  applyTheme(settings: ShopUiSettings): void {
    const root = document.documentElement.style;
    root.setProperty('--shop-bg-color', settings.backgroundColor);
    root.setProperty('--shop-text-color', settings.textColor);
    root.setProperty('--shop-animation-color', settings.backgroundAnimationColor);
    // Surfaces (cards/panels) tint towards white on dark backgrounds and towards
    // black on light backgrounds, so translucent overlays stay readable either way.
    root.setProperty('--shop-overlay-rgb', this.isDarkColor(settings.backgroundColor) ? '255,255,255' : '0,0,0');
    this.settingsSubject.next(settings);
  }

  clearCache(): void {
    this.cachedShopId = null;
  }

  private isDarkColor(hex: string): boolean {
    const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex?.trim() ?? '');
    if (!match) {
      return false;
    }
    const [r, g, b] = [match[1], match[2], match[3]].map((h) => parseInt(h, 16));
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
  }
}
