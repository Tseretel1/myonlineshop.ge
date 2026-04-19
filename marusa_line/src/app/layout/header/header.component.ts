import { Component, input, OnInit } from '@angular/core';
import { AppRoutes } from '../../shared/AppRoutes/AppRoutes';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthorizationService } from '../../pages/authorization/authorization.service';
import { Subscription } from 'rxjs';
import { ReloadService } from '../../shared/services/ReloadService';
import { PostService } from '../../Repositories/post.service';
import { Shop, ShopDto } from '../../pages/home/home.component';
import { Input } from '@angular/core';
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  shopId:number=0;
  constructor(private authService:AuthorizationService, private router :Router,private reloadService:ReloadService,private postService:PostService,private route: ActivatedRoute,  ){
    const shopId = localStorage.getItem('shopId');
      if(shopId){
        this.shopId = Number(shopId);
        localStorage.setItem('shopId',shopId);
      this.loadShop(this.shopId);
    }
  }
  AuthSub!:Subscription;
  ReloadSub!:Subscription;
  Authorised:boolean = false;
  ngOnInit(): void {
    this.authService.isUserAuthorised();
    this.AuthSub = this.authService.authorized$.subscribe(
      (isVisible) => {
        if(isVisible){
          this.Authorised = isVisible;
          this.getUser();
        }
        else{
          this.Authorised = isVisible;
          this.user = null;
        }
      }
    );
    console.log('this trigered')
    this.ReloadSub= this.reloadService.alert$.subscribe(
      (e)=>{
        if(e){
          this.getUser();
          const shopId = localStorage.getItem('shopId');
            if(shopId){
              this.shopId = Number(shopId)
              localStorage.setItem('shopId',shopId);
              this.loadShop(this.shopId);
            }
        }
      }
    )
  }

  user:any=null;
  userPhoto:string ='';
  getUser(){
    const user = localStorage.getItem('user');
    if(user){
      this.user = JSON.parse(user);
      this.userPhoto = this.user.Picture;
    }
  }
  openAuthorization(){
    this.authService.show();
    this.hideSidenav();
  }
  AppRoutes = AppRoutes;
  scrollToBottom(): void {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth' 
    });
    this.hideSidenav();
  }
  scrollTotop(){
     window.scrollTo({ top: 0, behavior: 'smooth' });
     this.hideSidenav();
  }


  sidenavVisible:boolean = false;
  leftToright:boolean = false;
  openSidenav(){
    this.sidenavVisible =  true;
    this.leftToright = false;
  }
  hideSidenav(){
    this.leftToright = true;
    setTimeout(() => {
      this.sidenavVisible =  false;
    }, 500);
  }

  goTospecialRoute(){
    if(this.shopId==0){
      const shopRoute = localStorage.getItem('shopId');
      if(shopRoute){
        this.router.navigate([AppRoutes.shop + Number(shopRoute)]);
      }
    }
    else{
        this.router.navigate([AppRoutes.shop + Number(this.shopId)]);
    }
    this.scrollTotop();
  }
  loadShop(shopId: number): void {
    this.postService.getShopById(shopId).subscribe({
      next: (data: any) => {
        this.shop = data.shop; 
      },
    });
  }


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
  shopDto:ShopDto={
    shop : this.shop,
    isFollowed : false,
  }
}
