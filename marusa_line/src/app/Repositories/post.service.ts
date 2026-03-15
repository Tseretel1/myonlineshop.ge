import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderProduct } from '../pages/profile/profile.component';
import { AppUrl } from '../shared/Url/Appurl';
import { orderPostObj } from '../pages/order-product/order-product.component';
import { GetPostsDto } from '../pages/gallery/gallery.component';
import { GetUserFilteredDto, GetusersDto } from '../pages/home/home.component';
@Injectable({
  providedIn: 'root'
})
export class PostService {
  AppUrl= AppUrl;
  private apiUrl = AppUrl.network;
  constructor(public http : HttpClient)
  {
    
  }

  getPosts(posts:GetPostsDto): Observable<ProductObject> {
    return this.http.post<ProductObject>(this.apiUrl+`Product/get-posts`,posts);
  }
  getUserLikedPosts(userId:number): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl+`Product/get-user-liked-posts?userid=${userId}`);
  }
  getUserOrders(userId:number): Observable<OrderProduct[]> {
    return this.http.get<OrderProduct[]>(this.apiUrl+`Product/get-user-orders?userid=${userId}`);
  }
  getPostWithId(id:number,userid?:number): Observable<any> {
    return this.http.get<any>(this.apiUrl+`Product/get-post-with-id?id=${id}&userid=${userid}`);
  }
  getDiscountedPosts(userId?:number): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl+`Product/get-most-discounted-posts?userid=${userId}`);
  }
  getMostSoldProducts(userId?:number): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl+`Product/get-most-sold-posts?userid=${userId}`);
  }
  getAllPhotos(): Observable<Photo[]> {
    return this.http.get<Photo[]>(this.apiUrl+'Product/get-all-photos');
  }
  getProductTypes(shopId:number): Observable<ProductTypes[]> {
    return this.http.get<ProductTypes[]>(this.apiUrl+`Product/get-product-types?shopid=${shopId}`);
  }
  getOrderStatuses(): Observable<orderStatuses[]> {
    return this.http.get<orderStatuses[]>(this.apiUrl+'Product/get-order-statuses');
  }
  likeProduct(userid:number,productId:number): Observable<any> {
    return this.http.get<any>(this.apiUrl+`Product/like-post?userid=${userid}&productid=${productId}`);
  }
  insertLocation(userid:number,location:string): Observable<any> {
    return this.http.post<any>(this.apiUrl+`Product/insert-location?userId=${userid}&location=${location}`,{});
  }
  insertPhoneNumber(userid:number,location:string): Observable<any> {
    return this.http.post<any>(this.apiUrl+`Product/insert-phone?userId=${userid}&phone=${location}`,{});
  }
  getuserOptionalFields(userId:number): Observable<UserOptionalFields> {
    return this.http.get<UserOptionalFields>(this.apiUrl+`Product/get-users-optional?id=${userId}`);
  }

  getOrderById(orderId:number): Observable<any> {
    return this.http.get<any>(this.apiUrl+`Product/get-order-details?orderId=${orderId}`);
  }
  insertOrder(order:orderPostObj): Observable<any> {
    return this.http.post<any>(this.apiUrl+`Product/insert-order`,order);
  }
  getShopStats(shopId:number): Observable<any> {
    return this.http.get<any>(this.apiUrl+`Product/get-shop-stats?shopId=${shopId}`);
  }
  getShopById(shopId:number): Observable<any> {
    return this.http.get<any>(this.apiUrl+`Product/get-shop-by-id?shopId=${shopId}`);
  }
  followShop(userid:number,shopId:number): Observable<any> {
    return this.http.post<any>(this.apiUrl+`Product/follow-shop?userId=${userid}&shopId=${shopId}`,{});
  }
  GetFollowersList(filter:GetUserFilteredDto): Observable<GetusersDto[]> {
    return this.http.post<GetusersDto[]>(this.apiUrl+`ControlPanel/get-shop-followers`,filter);
  }
}
export interface Photo {
  id?: number;  
  photoId?: number;  
  photoUrl?: string;
  postId?: number;
}

export interface ProductObject{
  products:Post[];
  totalCount:number;
}

export interface Post {
  id: number;
  title: string;
  description: string;
  price: number;
  discountedPrice: number;
  photoUrl?: string | null; 
  photoId?: number | null;  
  postId?: number;        
  likeCount: number;  
  isLiked:boolean;  
  quantity:number; 
  orderNotAllowed:boolean;   
  photos: Photo[];
}
export interface ProductTypes{
 id:number;
 productType:string;
}
export interface orderStatuses{
 id:number;
 statusName:string;
}

export interface UserOptionalFields{
  id:number;
  location:string;
  phoneNumber:string;
}