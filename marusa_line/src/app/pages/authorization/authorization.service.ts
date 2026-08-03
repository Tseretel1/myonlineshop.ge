import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';
import { AppRoutes } from '../../shared/AppRoutes/AppRoutes';
import { ShopService } from '../../shared/services/ShopService';
@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  AppRoutes = AppRoutes;
  constructor(private router:Router, private shopService: ShopService) { }
  private authorization = new BehaviorSubject<boolean>(false);
  authorization$ = this.authorization.asObservable();
  show(): void {
    this.authorization.next(true);
  }
  hide(): void {
    this.authorization.next(false);
  }

  private authorized = new BehaviorSubject<boolean>(false);
  authorized$ = this.authorized.asObservable();
  userAuthorized(): void {
    this.authorized.next(true);
  }
  userNotAuthorized(): void {
    this.authorized.next(false);
  }


  isUserAuthorised():boolean{
    const token = localStorage.getItem('token');
    if(token!=null){
      this.userAuthorized();
      return true;
    }
    return false;
  }

  logout(){
      Swal.fire({
      title: 'აქაუნთიდან გასვლა',
      text: 'ნამდვილად გსურთ აქაუნთიდან გასვლა?',
      showCancelButton: true,
      confirmButtonText: 'კი',
      cancelButtonText: 'არა',
      color: '#ffffff',       
      background:'rgb(25, 26, 25)',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      customClass: {
        popup: 'custom-swal-popup',
      }
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          this.userNotAuthorized();
          this.shopService.clearCache();
          this.router.navigate([AppRoutes.home])
        }
    });

  }
  forceLogout(){
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      this.userNotAuthorized();
      this.shopService.clearCache();
      const shopId =localStorage.getItem('shopId')
      if(shopId){
        this.router.navigate([AppRoutes.shop+'/'+shopId]);
      }
      this.show();
   }
}
