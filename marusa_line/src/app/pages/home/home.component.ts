import { Component, OnInit } from '@angular/core';
import { CardsComponent } from '../../shared/components/cards/cards.component';
import { CommonModule, NumberFormatStyle } from '@angular/common';
import AOS from 'aos';
import { Photo, Post, PostService, ProductTypes } from '../../Repositories/post.service';
import { PhotoAlbumComponent, PhotoConfig } from '../../shared/components/photo-album/photo-album.component';
import { DiscountMarkComponent } from '../../shared/components/discount-mark/discount-mark.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { ActivatedRoute } from '@angular/router';
import { escapeRegExp } from '@angular/compiler';
import { Footer, FooterComponent } from '../../layout/footer/footer.component';
import { Followers, ShopCard } from '../main/main.component';
import { AuthorizationService } from '../authorization/authorization.service';
import { ReloadService } from '../../shared/services/ReloadService';
import { Subscription } from 'rxjs';




@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FooterComponent, GalleryComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{

  shop: Shop = {
    id: 0,
    name: '',
    logo: null,
    location: null,
    gmail: '',
    subscription: 0,
    instagram: null,
    facebook: null,
    titkok: null,
    bog: null,
    tbc: null,
    receiver: null,
  };

  shopStats: ShopStats={
    productCount :'',
    followerCount :'',
  };

  soldProducts: Post[] = [];
  soldProducts2: Post[] = [];
  user:any = null;
  userId:number = 0;
  shopId:number=0;
  constructor(private postService:PostService,private route: ActivatedRoute, private authService:AuthorizationService,private reloadService:ReloadService){
    const user = localStorage.getItem('user');
    if(user){
      this.user =JSON.parse(user);
      this.userId = this.user.Id
    }
    // this.postService.getMostSoldProducts(this.userId).subscribe(
    //   (resp)=>{
    //     this.soldProducts = resp.slice(0, 3);
    //     this.soldProducts2 = resp.slice(3);
    //   }
    // )
    const shopId = this.route.snapshot.paramMap.get('id');
    if(shopId){
      localStorage.setItem('shopId',shopId);
      this.shopId = Number(shopId);
      this.loadShop(this.shopId);
      this.getShopStats(this.shopId);
      this.reloadService.reload();
    }
    else{
        const shopId = localStorage.getItem('shopId');
        if(shopId){
          this.shopId = Number(shopId);
          this.loadShop(this.shopId);
          this.getShopStats(this.shopId);
          this.reloadService.reload();
        }
    }
  }

  ReloadSub!:Subscription;
  ngOnInit(): void {
    this.ReloadSub= this.reloadService.alert$.subscribe(
      (e)=>{
        if(e){
          this.loadShop(this.shopId);
        }
      }
    )
  }


  footer!: Footer;
  isShopFollowed:boolean = false;
  loadShop(shopId: number): void {
    this.postService.getShopById(shopId).subscribe({
      next: (data: ShopDto) => {
        this.shop = { ...data.shop }; 
        this.isShopFollowed = data.isFollowed;
        this.toggleFollew();
        this.footer={
          instagram: this.shop.instagram,
          facebook: this.shop.facebook,
          tiktok: this.shop.titkok,
          shopPhoto:this.shop.logo,
          shopTitle:this.shop.name,
        }   
        // this.getUsers();    
      },
    });
  }
changeFavicon(iconUrl: string) {
  const link = document.querySelector('#appFavicon') as HTMLLinkElement;
  if (link) {
    link.href = iconUrl;
  }
}
  getShopStats(shopId: number): void {
    this.postService.getShopStats(shopId).subscribe(
     (resp) => {
        this.shopStats = resp;
      },
    );
  }


  followString:string= 'follow'
  toggleFollew(){
    if(this.isShopFollowed){
      this.followString ='following';
    }
    else{
      this.followString ='follow';
    }
  }


  followShop(){
    if(!this.isShopFollowed){
      const user = localStorage.getItem('user');
      if(!user){
        this.authService.show();
        return;
      }
      else{
        this.postService.followShop(this.userId, this.shopId).subscribe(
          (resp)=>{
            this.isShopFollowed =true;
            this.toggleFollew();
          }
        )
      }
    }
  }
  getuserFitler:GetUserFilteredDto={
    shopId:0,
    userId: null,
    isBlocked :null,
    pageNumber:1,
    pageSize:3,
  }

  users:GetusersDto[]= [];
  getUsers(){
    this.getuserFitler.shopId = this.shopId;
    this.postService.GetFollowersList(this.getuserFitler).subscribe((resp)=>{
      this.users = resp;
    })
  }

  
  
  PhotoConfig:PhotoConfig={
    likeVisible : true,
    priceVisible :true,
    navigationAvailable : true,
    hoverVisible : true,
    likeCountvisible :false,
  }
}



export interface GetUserFilteredDto {
  userId: number|null;      
  isBlocked: boolean|null; 
  pageNumber: number;   
  pageSize: number;
  shopId:number;     
}
export interface GetusersDto {
  id: number;
  email: string;
  name: string;
  profilePhoto: string;
  location: string;
  phoneNumber: string;
  role: string;
  totalCount:number;
  paidOrdersCount: number,
  unPaidOrdersCount: number,
  isBlocked: boolean,
}

export interface ShopStats{
  followerCount:string;
  productCount:string;
}

export interface Shop {
  id: number;
  name: string;
  logo: string | null;
  location: string | null;
  gmail: string;
  subscription: number;
  instagram: string | null;
  facebook: string | null;
  titkok: string | null;
  bog: string|null,
  tbc: string|null,
  receiver: string|null,
}
export interface ShopDto {
  shop:Shop;
  isFollowed:boolean;
}