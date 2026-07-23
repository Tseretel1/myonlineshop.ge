import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { PostService } from '../../Repositories/post.service';
import { ShopDto } from '../../pages/home/home.component';

@Injectable({ providedIn: 'root' })
export class ShopService {

  private cachedShopId: number | null = null;
  private cachedShopDto: ShopDto | null = null;

  constructor(private postService: PostService) {}

  getShop(shopId: number): Observable<ShopDto> {
    if (this.cachedShopDto && this.cachedShopId === shopId) {
      return of(this.cachedShopDto);
    }
    return this.postService.getShopById(shopId).pipe(
      tap((data: ShopDto) => {
        this.cachedShopId = shopId;
        this.cachedShopDto = data;
      })
    );
  }

  setFollowed(isFollowed: boolean): void {
    if (this.cachedShopDto) {
      this.cachedShopDto = { ...this.cachedShopDto, isFollowed };
    }
  }
}
