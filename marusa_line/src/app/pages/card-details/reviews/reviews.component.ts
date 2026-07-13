import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../../Repositories/post.service';
import { AuthorizationService } from '../../authorization/authorization.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

export interface Review {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
}

export interface InsertReview {
  userId: number;
  productId: number;
  rate: number;
  comment: string;
}

export interface ReviewDto {
  id: number;
  name: string;
  photo: string;
  rate: number;
  comment: string;
  totalCount: number;
}

interface LocalUser {
  Id: number;
  Email: string;
  Name: string;
  Picture: string;
}

@Component({
  selector: 'app-reviews',
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss'
})
export class ReviewsComponent implements OnInit {

  constructor(
    private postservice: PostService,
    private route: ActivatedRoute,
    private authService:AuthorizationService,
  ) {}
 
  AuthSub!:Subscription;
  productId: number = 0;
  reviews: Review[] = [];
  currentUser: LocalUser | null = null;

  pageNumber: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  loadingMore: boolean = false;

  // Form state
  showForm: boolean = false;
  newRate: number = 0;
  hoveredStar: number = 0;
  newComment: string = '';
  isSubmitting: boolean = false;
  submitSuccess: boolean = false;
  submitError: boolean = false;

  ngOnInit(): void {
    // Load user from localStorage
    const raw = localStorage.getItem('user');
    if (raw) {
      try { this.currentUser = JSON.parse(raw); } catch {}
    }

    this.route.params.subscribe(params => {
      this.productId = +params['id'];
      this.loadReviews();
    });
    this.AuthSub = this.authService.authorized$.subscribe(
      (isVisible) => {
        if(isVisible){
           const raw = localStorage.getItem('user');
          if (raw) {
            try { this.currentUser = JSON.parse(raw); } catch {}
          }
        }
        else{
          this.currentUser= null;
        }
      }
    );
  }

  loadReviews(): void {
    this.pageNumber = 1;
    this.postservice.GetReviews(this.productId, this.pageNumber, this.pageSize).subscribe({
      next: (dtos: ReviewDto[]) => {
        this.reviews = dtos.map(dto => this.mapDto(dto));
        this.totalCount = dtos.length > 0 ? dtos[0].totalCount : 0;
      },
      error: (err) => console.error('Failed to load reviews', err)
    });
  }

  get hasMoreReviews(): boolean {
    return this.reviews.length < this.totalCount;
  }

  loadMoreReviews(): void {
    if (this.loadingMore || !this.hasMoreReviews) return;

    this.loadingMore = true;
    const nextPage = this.pageNumber + 1;
    this.postservice.GetReviews(this.productId, nextPage, this.pageSize).subscribe({
      next: (dtos: ReviewDto[]) => {
        this.reviews = this.reviews.concat(dtos.map(dto => this.mapDto(dto)));
        this.pageNumber = nextPage;
        this.loadingMore = false;
      },
      error: (err) => {
        console.error('Failed to load more reviews', err);
        this.loadingMore = false;
      }
    });
  }

  mapDto(dto: ReviewDto): Review {
    const initials = dto.name
      ? dto.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
      : '??';
      console.log(initials)
      return {
        id: dto.id,
        name: dto.name,
        avatar: dto.photo,
        rating: dto.rate,
        comment: dto.comment ?? ''
      };
  }

  getStars(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.newRate = 0;
      this.hoveredStar = 0;
      this.newComment = '';
      this.submitSuccess = false;
      this.submitError = false;
    }
  }

  clearHover(): void {
    this.hoveredStar = 0;
  }

  submitReview(): void {
    if (this.newRate === 0 || this.isSubmitting) return;

    this.isSubmitting = true;
    this.submitSuccess = false;
    this.submitError = false;

    const payload: InsertReview = {
      userId: this.currentUser?.Id ?? 1,
      productId: this.productId,
      rate: this.newRate,
      comment: this.newComment.trim()
    };

    console.log(payload)
    this.postservice.InsertReviews(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        this.newRate = 0;
        this.newComment = '';
        this.loadReviews();
        this.showForm = false;
        this.submitSuccess = false;
      },
      error: (err) => {
        this.isSubmitting = false;
        this.submitError = true;
          if (err.error?.blocked == true) {
            Swal.fire({
              text: 'დროებით შეფასების დაწერა შეზღუდულია!',
              icon: 'error',
              background: 'rgb(25, 26, 25)',
              color: '#ffffff',
              timer: 3000,
            });
          } 
      }
    });
  }
}