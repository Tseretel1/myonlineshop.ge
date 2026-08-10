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
    // Every translucent "glass" surface (cards, header, footer, modals, comment
    // section, ...) tints towards this color. Each surface keeps its own fixed
    // base opacity in CSS and multiplies it by this intensity, so the shop can
    // make surfaces more or less visible without ever reaching full opacity
    // (the backend clamps the multiplier to [0.3, 1.4]).
    root.setProperty('--shop-overlay-rgb', this.hexToRgb(settings.surfaceColor));
    root.setProperty('--shop-overlay-intensity', String(settings.surfaceOpacity ?? 1));
    this.settingsSubject.next(settings);
  }

  clearCache(): void {
    this.cachedShopId = null;
  }

  private hexToRgb(hex: string): string {
    const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex?.trim() ?? '');
    if (!match) {
      return '128,128,128';
    }
    const [r, g, b] = [match[1], match[2], match[3]].map((h) => parseInt(h, 16));
    return `${r},${g},${b}`;
  }
}
