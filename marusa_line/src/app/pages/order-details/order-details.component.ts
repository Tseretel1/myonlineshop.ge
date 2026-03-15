import { AfterViewInit, Component, ElementRef, HostListener, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { orderStatuses, Post, PostService } from '../../Repositories/post.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import * as  AOS from 'aos';
import { AuthorizationService } from '../authorization/authorization.service';
import Swal from 'sweetalert2';
import { FormsModule, ɵInternalFormsSharedModule } from "@angular/forms";
import L from 'leaflet';
import { Lnglat } from '../order-product/map/map.component';
import { timeout } from 'rxjs';
import { Footer } from '../../layout/footer/footer.component';
import { Shop, ShopDto } from '../home/home.component';

@Component({
  selector: 'app-order-details',
  imports: [CommonModule,FormsModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent implements OnInit{
 @ViewChild('scrollToBottom') scrollToStart!: ElementRef;
  marker: any;

  scrollToBottomMethod() {
    this.scrollToStart.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
  }, 500);
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
  shopId:number=0;
  productId:number = 0;
  posts:Post = {} as Post;
  order:OrderDetailsDto = {} as OrderDetailsDto;
  photosArray:Photo[]= [];
  postsLoaded:boolean = false;

  user:any = null;
  userId:number = 0;
  constructor(private postService:PostService, private route :ActivatedRoute,private authServise:AuthorizationService){
    const id = this.route.snapshot.paramMap.get('id');
    this.productId = Number(id);
    const user = localStorage.getItem('user');
    if(user){
      this.user =JSON.parse(user);
      this.userId = this.user.Id
    }
    this.getOrderStatuses();
    this.postService.getOrderById(this.productId).subscribe(
      (resp)=>{
        console.log(resp)
        this.posts = resp.product;
        this.order = resp.orders;
        this.comment = this.order.comment;
        this.posts.photos.forEach(item => {
          this.photosArray.push(item);
        });
        this.productPrice = this.order.finalPrice;
        this.postsLoaded = true;
        if(this.order.isPaid){
          setTimeout(() => {
            if(this.order.address==''){
              this.initMap(Number(this.order.lat), Number(this.order.lng));
            }
          }, 500);
        }
        else{
                this.loadShop(this.order.shopId);
              }
            }
        );
      }
      
  loadShop(shopId: number): void {
    this.postService.getShopById(shopId).subscribe({
      next: (data: any) => {
        this.shop = data.shop;        
      },
    });
  }
  
  ngOnInit(): void {
    AOS.init({
      easing: 'ease-in-out',
      once: false, 
    });
    window.scrollTo({
     top: 0,
     behavior: 'smooth' 
   }); 
    this.getUserDetails();
  }

  mobileNumber:string = '';
  address:string = '';

  oldMobileNumber:string = '';
  oldAddress:string = '';

  getUserDetails(){
    this.postService.getuserOptionalFields(this.userId).subscribe(
      (resp)=>{
        if(resp.location!=null){
          this.address = resp.location;
          this.oldAddress = this.address;
        }
        if(resp.phoneNumber!=null){
          this.mobileNumber = resp.phoneNumber;
          this.oldMobileNumber = this.mobileNumber;
        }
      }
    )
  }

    map!: L.Map;
    location: Lnglat = {
      lat: '',
      lng: '',
    };
   initMap(lat: number, lng: number): void {
  
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '../assets/leaflet/marker-icon-2x.png',
      iconUrl: '../assets/leaflet/marker-icon.png',
      shadowUrl: '../assets/leaflet/marker-shadow.png',
      iconSize: [20, 30],
    });
  
  
    this.map = L.map('map').setView([lat, lng],15);
    this.marker = L.marker([lat, lng], { draggable: false }).addTo(this.map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);
    this.marker = L.marker([lat, lng]).addTo(this.map);
  }
  isUserLogged(){
    const user = localStorage.getItem('user');
    if(user){
      return true;
    }
    this.authServise.show();
    return false;
  }
  productPrice:number = 0;
  oneProductPrice:number = 0;
  productQuantity:number = 1;
  comment:string = '';

  orderStatuses:orderStatuses[]= [];
  getOrderStatuses(){
    this.postService.getOrderStatuses().subscribe(
      (resp)=>{
        this.orderStatuses = resp;
      }
    )
  }
  getStatusName(statusid:number){
    const name  = this.orderStatuses.find((x)=> x.id == statusid);
    return name?.statusName;
  }

  copiedNumber:number = 0;

  copyToClipboard(text: string,numebr:number): void {
    this.copiedNumber = numebr;
    navigator.clipboard.writeText(text)
    .then(() => {
    })
    .catch(err => {
    });
    setTimeout(() => {
      this.copiedNumber = 0;
    }, 3000);
  }
  GetbankCredentialss(){
  }

}

interface Photo {
  Id?: number;
  photoId?: number;
  photoUrl?: string;
  postId?: number;
}

export interface BankCredentials{
  bankName:string;
  accountNumber:string;
  recieverName:string;
}

export interface OrderDetailsDto {
  shopId:number;
  orderId: number;
  userId: number;
  productId: number;
  isPaid: boolean;
  statusId: number;
  createDate: string; 
  deliveryType?: string;
  productQuantity: number;
  comment: string;
  finalPrice: number;
  lng: string|null;
  lat: string|null;
  address: string|null;
  orderNumber:number;
}
