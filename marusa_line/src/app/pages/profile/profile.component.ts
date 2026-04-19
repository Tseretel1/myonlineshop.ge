import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../authorization/authorization.service';
import { Router, RouterLink } from '@angular/router';
import { AppRoutes } from '../../shared/AppRoutes/AppRoutes';
import {
  orderStatuses,
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
    this.getOrderStatuses();
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
      this.MyOrders = resp;
    });
  }

  orderStatuses: orderStatuses[] = [];
  getOrderStatuses() {
    this.postService.getOrderStatuses().subscribe((resp) => {
      this.orderStatuses = resp;
    });
  }

  getStatusName(statusid: number) {
    const name = this.orderStatuses.find((x) => x.id == statusid);
    return name?.statusName;
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

  activeFilterNum: number = 0;
  filterModalVisible: boolean = false;
  showFilterModal() {
    this.filterModalVisible = true;
  }

  hideModalExecute: boolean = false;
  hideFilterModal() {
    this.hideModalExecute = true;
    setTimeout(() => {
      this.filterModalVisible = false;
      this.hideModalExecute = false;
    }, 500);
  }

  sortNum: number = 0;
  sortByPriceHighToLow(): void {
    this.MyOrders = [...this.MyOrders].sort((a, b) => b.price - a.price);
    this.sortNum = 1;
    this.hideFilterModal();
  }
  sortByPriceLowToHigh(): void {
    this.MyOrders = [...this.MyOrders].sort((a, b) => a.price - b.price);
    this.sortNum = 2;
    this.hideFilterModal();
  }

  sortByStatus(statusId: number): void {
    this.MyOrders = [...this.MyOrders].sort((a, b) => {
      const aMatch = a.statusId === statusId ? 0 : 1;
      const bMatch = b.statusId === statusId ? 0 : 1;
      return aMatch - bMatch;
    });
    const myOrders = this.MyOrders;

    this.MyOrders = [];
    setTimeout(() => {
      this.MyOrders = myOrders;
    }, 1);
    this.sortNum = statusId + 5;
    this.hideFilterModal();
  }

  sortByIsPaied(paid: boolean) {
    this.hideFilterModal();
    this.MyOrders.sort((a, b) => {
      if (paid) {
        this.sortNum = 3;
        return (b.isPaid === true ? 1 : 0) - (a.isPaid === true ? 1 : 0);
      } else {
        this.sortNum = 4;
        return (a.isPaid === true ? 1 : 0) - (b.isPaid === true ? 1 : 0);
      }
    });
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
