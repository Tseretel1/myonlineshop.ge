import { Component, input, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutes } from '../../AppRoutes/AppRoutes';
import { Router, RouterLink } from '@angular/router';
import { Post, PostService } from '../../../Repositories/post.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { runPostSignalSetFn } from '@angular/core/primitives/signals';
import { AuthorizationService } from '../../../pages/authorization/authorization.service';
import { DiscountMarkComponent } from '../discount-mark/discount-mark.component';
@Component({
  selector: 'app-photo-album',
  imports: [CommonModule, DiscountMarkComponent],
  templateUrl: './photo-album.component.html',
  styleUrl: './photo-album.component.scss'
})
export class PhotoAlbumComponent implements OnInit{
  constructor(private router:Router,private productService:PostService,private authService:AuthorizationService){

  }
  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if(user){
      this.postLiked =  this.products.isLiked;
    }
    this.LikeCount = this.products.likeCount;
  }
  AppRoutes= AppRoutes;
  @Input() products!:Post;
  @Input() PhotoCongif!:PhotoConfig;

  LikeCount:number= 0;
  postLiked:boolean = false;
  userId:number = 0;

  likePost(event?:Event){
    event?.stopPropagation();
    event?.preventDefault();
    const user = localStorage.getItem('user');
    if(user){
      const userParsed = JSON.parse(user);
      this.userId = userParsed.Id;
      this.productService.likeProduct(this.userId,this.products.id).subscribe(
        (resp)=>{
        }
      );
      if(!this.postLiked){
        this.postLiked= true;
        this.LikeCount++;
      }
      else{
        this.postLiked= false;
        this.LikeCount--;
      }
    }
    else{
      this.authService.show();
    }
  }

  NavigateToDetails(){
    this.router.navigate([AppRoutes.card_details + this.products.id]);
  }
}

export interface PhotoConfig{
  priceVisible:boolean;
  likeVisible:boolean;
  likeCountvisible:boolean;
  navigationAvailable:boolean;
  hoverVisible:boolean;
}
