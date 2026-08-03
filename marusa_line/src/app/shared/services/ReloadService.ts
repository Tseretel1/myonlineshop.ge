import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ShopService } from './ShopService';

@Injectable({ providedIn: 'root' })
export class ReloadService {
  private alertSubject = new BehaviorSubject<boolean>(false);
  alert$ = this.alertSubject.asObservable();

  constructor(private shopService: ShopService) {}

  reload() {
    // Auth state (or other shop-affecting state) may have changed since the
    // last fetch, so a reload must not be served from the stale shop cache.
    this.shopService.clearCache();
    this.alertSubject.next(true);
  }
  hide() {
    this.alertSubject.next(false);
  }
}
