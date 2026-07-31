import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../authorization/authorization.service';
import { Router, RouterLink } from '@angular/router';
import { AppRoutes } from '../../shared/AppRoutes/AppRoutes';
import {
  Post,
  PostService,
} from '../../Repositories/post.service';
import {
  PhotoAlbumComponent,
  PhotoConfig,
} from '../../shared/components/photo-album/photo-album.component';
import { CommonModule, DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { ReloadService } from '../../shared/services/ReloadService';

@Component({
  selector: 'app-profile',
  imports: [PhotoAlbumComponent, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  AppRoutes = AppRoutes;
  constructor(
    private authService: AuthorizationService,
    private postService: PostService,
    private router: Router,
    private reloadService: ReloadService,
  ) {
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
      this.userId = this.user.Id;
    }
  }
  PhotoConfig: PhotoConfig = {
    likeVisible: true,
    priceVisible: true,
    navigationAvailable: true,
    hoverVisible: true,
    likeCountvisible: false,
  };
  LikedProducts: Post[] = [];
  MyOrders: OrderProduct[] = [];

  ngOnInit(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    this.changeProductSource(1);
  }

  user: any = null;
  userId: number = 0;

  getMyLikedPosts() {
    this.PhotoConfig.likeVisible = true;
    this.PhotoConfig.priceVisible = true;
    this.PhotoConfig.navigationAvailable = true;
    this.PhotoConfig.hoverVisible = true;
    if (this.LikedProducts.length > 0) {
      return this.LikedProducts;
    }
    return this.postService.getUserLikedPosts(this.userId).subscribe((resp) => {
      this.LikedProducts = resp;
    });
  }
  getMyOrderdProducts() {
    this.PhotoConfig.priceVisible = false;
    this.PhotoConfig.likeVisible = false;
    this.PhotoConfig.navigationAvailable = false;
    this.PhotoConfig.hoverVisible = false;
    if (this.MyOrders.length > 0) {
      return this.MyOrders;
    }
    return this.postService.getUserOrders(this.userId).subscribe((resp) => {
      if(resp!=null){
        this.MyOrders = resp;
        this.currentPage = 1;
      }
    });
  }

  currentPage: number = 1;
  pageSize: number = 10;

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.MyOrders.length / this.pageSize));
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get paginatedOrders(): OrderProduct[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.MyOrders.slice(start, start + this.pageSize);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  likesOrOrders: number = 1;
  changeProductSource(num: number) {
    this.likesOrOrders = num;
    if (num == 1) {
      this.getMyOrderdProducts();
    } else if (num == 2) {
      this.getMyLikedPosts();
    }
  }
  logout() {
    this.authService.logout();
  }

  navigateTodetails(orderId: Number) {
    this.router.navigate([AppRoutes.order_details + orderId]);
  }
}

interface Photo {
  id?: number;
  photoId?: number;
  photoUrl?: string;
  postId?: number;
}

export interface OrderProduct {
  orderId: number;
  createDate: string;
  statusId: number;
  isPaid: boolean;
  quantity: number;
  id: number;
  productId: number;
  title: string;
  description: string;
  price: number;
  discountedPrice: number;
  productTypeId: number;
  finalPrice: number;
  comment: string;
  deliveryType: string;
  productQuantity: string;
  orderNotAllowed: boolean;
  orderNumber: number;
  likeCount: number;
  isLiked: boolean;
  shopId: number;
  mobileNumber: string;
  photos: Photo[];
}
