import { CommonModule, NgForOf, PathLocationStrategy } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild, } from '@angular/core';
import AOS from 'aos';
import { Photo, Post, PostService, ProductTypes } from '../../Repositories/post.service';
import { PhotoAlbumComponent, PhotoConfig } from '../../shared/components/photo-album/photo-album.component';
import { DiscountMarkComponent } from '../../shared/components/discount-mark/discount-mark.component';

@Component({
  selector: 'app-gallery',
  imports: [CommonModule, PhotoAlbumComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent implements OnInit {
  Cards: Post[] = [];
  PhotoConfig:PhotoConfig={
    priceVisible :true,
    likeVisible : true,
    hoverVisible : true,
    navigationAvailable:true,
    likeCountvisible :false,
  }
  
  @Input() ShopId!:number;
  getPosts:GetPostsDto={
    pageNumber : 1,
    pageSize: 10,
    userId: 0,
    productTypeId :null,
    shopId : 0
  }
  constructor(private postService:PostService){
    const shopId = localStorage.getItem('shopId');

    if(shopId){
      this.getProductTypes(Number(shopId));
    }
  }
  ngOnInit(): void {
    this.getAllPosts();
  }
  moveProductTypeTOFirst(){
    const TypeId = localStorage.getItem('TypeId');
    if(TypeId){
      if(TypeId!='null'){
        const index = this.productTypesList.findIndex(x => x.id === Number(TypeId));
        if (index !== -1) {
          const selected = this.productTypesList[index];
          this.productTypesList.splice(index, 1);
          this.productTypesList.unshift(selected);
        }
      }
    }
  }
  productTypesList :ProductTypes[]= [];
  getProductTypes(id:number){
    this.postService.getProductTypes(id).subscribe(
      (resp)=>{
        this.productTypesList = resp;
        this.moveProductTypeTOFirst();
      }
    )
  }
@ViewChild('scrollToStart') scrollToStart!: ElementRef;

scrollToStartMethod() {
  const element = this.scrollToStart.nativeElement;

  const yOffset = -80;
  const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

  window.scrollTo({
    top: y,
    behavior: 'smooth'
  });
}

  getAllPosts() {
    const user = localStorage.getItem('user');
    if(user){
      this.user =JSON.parse(user);
      this.userId = this.user.Id
      this.getPosts.userId = this.user.Id;
    }
    
    this.applyPageAndType();
    this.postService.getPosts(this.getPosts).subscribe(
      (resp)=>{
        this.Cards = resp.products;
        this.totalCount = resp.totalCount;
        this.totalPages = Math.ceil(this.totalCount / this.getPosts.pageSize);
        this.lastPage = Math.ceil(this.totalCount / this.getPosts.pageSize);
      }
    )
  }
  applyPageAndType(){
    if(this.ShopId){
      this.getPosts.shopId = this.ShopId;
    }
    const PageNum = localStorage.getItem('PageNum');
    const TypeId = localStorage.getItem('TypeId');
    if(PageNum){
      const Page = Number(PageNum);
      this.selectedPage = Page;
      this.getPosts.pageNumber = Page;
    }
    if(TypeId){
      if(TypeId!='null'){
        this.getPosts.productTypeId= Number(TypeId);
        this.activeFilterNum = Number(TypeId);
      }
      else{
        this.activeFilterNum = 0;
        this.getPosts.productTypeId = null;
      }
    }
  }

  
  user:any = null;
  userId:number = 0;
  ApplyFitler(num: number|null) {
    if(num){
      this.activeFilterNum = num;
      this.getPosts.productTypeId = num;
      localStorage.setItem('TypeId',num.toString());
    }
    else{
      this.getPosts.productTypeId = null; 
      this.activeFilterNum = 0; 
      localStorage.setItem('TypeId','null');
    }
    localStorage.setItem('PageNum','1');
    this.getAllPosts();
    this.hideFilterModal();

    if(this.sortNum==1){
      this.sortByPriceHighToLow()
    }
    else if(this.sortNum==2){
      this.sortByPriceLowToHigh()
    }
  }

  activeFilterNum: number = 0;

  filterModalVisible:boolean = false;
  showFilterModal(){
    this.filterModalVisible = true;
  }

  hideModalExecute:boolean = false;
  hideFilterModal(){
    this.hideModalExecute= true;
    setTimeout(() => {
      this.filterModalVisible = false;
      this.hideModalExecute = false;
    }, 500);
  }

  sortNum:number = 0;
  sortByPriceHighToLow(): void {
    this.Cards = [...this.Cards].sort((a, b) => b.price - a.price);
    this.sortNum = 1;
    this.hideFilterModal();
  }
  sortByPriceLowToHigh(): void {
    this.Cards = [...this.Cards].sort((a, b) => a.price - b.price);
    this.sortNum = 2;
    this.hideFilterModal();
  }

  totalCount:number = 0;
  lastPage: number = 0; 
  selectedPage: number = 1;
  pageNumber: number = 1;
  changePage(page: number) {
    if (page < 1 || page > this.lastPage) return;
    this.selectedPage = page;
    this.getPosts.pageNumber = page;
    const middle = this.pageNumber + 2;
    if (page > middle) {
      this.pageNumber = page - 2;
    } else if (page < middle && this.pageNumber > 1) {
      this.pageNumber = Math.max(1, page - 2);
    }
    localStorage.setItem('PageNum', this.selectedPage.toString());
    this.getAllPosts();
    this.scrollToStartMethod();
  }
  totalPages:number =0;

  filtersExpanded:boolean = false;
  expandFilters(){
    if(!this.filtersExpanded){
      this.filtersExpanded = true;
      return;
    }
    else{
      this.filtersExpanded = false;
      return;
    }
  }
}

export interface GetPostsDto{
  pageNumber:number;
  pageSize:number;
  userId:number;
  productTypeId:number|null;
  shopId:number;
}