import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PostService, ShopUiSettings } from '../../Repositories/post.service';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private static readonly STORAGE_KEY_PREFIX = 'shopTheme:';

  private cachedShopId: number | null = null;
  private settingsSubject = new BehaviorSubject<ShopUiSettings | null>(null);
  settings$: Observable<ShopUiSettings | null> = this.settingsSubject.asObservable();

  constructor(private postService: PostService) {}

  // Applies whatever theme is saved in localStorage for this shop, if any,
  // right away — so a returning visitor (or a switch to a shop they've
  // already seen this session) sees the shop's real colors immediately
  // instead of the white default while the network fetch is in flight.
  applyStoredTheme(shopId: number): void {
    const stored = this.readStoredTheme(shopId);
    if (stored) {
      this.applyTheme(stored);
    }
  }

  loadForShop(shopId: number): void {
    if (!shopId || this.cachedShopId === shopId) {
      return;
    }
    this.cachedShopId = shopId;
    this.applyStoredTheme(shopId);
    this.postService.getShopUiSettings(shopId).subscribe({
      next: (settings) => {
        this.applyTheme(settings);
        this.storeTheme(shopId, settings);
      },
      error: () => {
        if (this.cachedShopId === shopId) {
          this.cachedShopId = null;
        }
      },
    });
  }

  private readStoredTheme(shopId: number): ShopUiSettings | null {
    try {
      const raw = localStorage.getItem(ThemeService.STORAGE_KEY_PREFIX + shopId);
      return raw ? (JSON.parse(raw) as ShopUiSettings) : null;
    } catch {
      return null;
    }
  }

  private storeTheme(shopId: number, settings: ShopUiSettings): void {
    try {
      localStorage.setItem(ThemeService.STORAGE_KEY_PREFIX + shopId, JSON.stringify(settings));
    } catch {
      // localStorage unavailable (private browsing, quota) — theme just won't be cached
    }
  }

  applyTheme(settings: ShopUiSettings): void {
    const root = document.documentElement.style;
    const backgroundOpacity = this.clamp01(settings.backgroundOpacity ?? 1);
    root.setProperty('--shop-bg-color', settings.backgroundColor);
    root.setProperty('--shop-bg-rgb', this.hexToRgb(settings.backgroundColor));
    root.setProperty('--shop-bg-opacity', String(backgroundOpacity));
    root.setProperty('--shop-text-color', settings.textColor);
    root.setProperty('--shop-animation-color', settings.backgroundAnimationColor);
    // Every translucent "glass" surface (cards, header, footer, modals, comment
    // section, ...) tints towards this color, each keeping its own fixed base
    // alpha in CSS and multiplying it by this intensity directly — unchanged
    // from before, so shops that haven't touched the slider keep looking
    // exactly as they always have. The ControlPanel is responsible for
    // choosing how far past 1 this can go so the strongest surfaces can
    // still reach fully opaque; this service just passes the number through.
    const surfaceOpacity = Math.max(0, settings.surfaceOpacity ?? 1);
    root.setProperty('--shop-overlay-rgb', this.hexToRgb(settings.surfaceColor));
    root.setProperty('--shop-overlay-intensity', String(surfaceOpacity));
    this.settingsSubject.next(settings);
  }

  private clamp01(value: number): number {
    return Math.min(1, Math.max(0, value));
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
