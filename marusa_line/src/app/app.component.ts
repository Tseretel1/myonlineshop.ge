import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from "./layout/footer/footer.component";
import { LoaderComponent } from "./shared/components/loader/loader.component";
import { AuthorizationComponent } from "./pages/authorization/authorization.component";
import { filter, Observable, Subscription } from 'rxjs';
import { AuthorizationService } from './pages/authorization/authorization.service';
import { CommonModule } from '@angular/common';
import { BackgroundComponent } from "./shared/components/background/background.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, LoaderComponent, AuthorizationComponent, CommonModule, BackgroundComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'marusa_line';

  shopId:number = 0;
  constructor(private authService: AuthorizationService,private route :ActivatedRoute,private router: Router,){
    const shopId = this.route.snapshot.paramMap.get('id');
 
  }

  private AuthSub!: Subscription;
  authorizationVisible:boolean= false;  
  
  ngOnInit(): void {
    this.AuthSub = this.authService.authorization$.subscribe(
      (isVisible) => {
        this.authorizationVisible = isVisible;
      }
    );
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      let currentRoute = this.route;
      while (currentRoute.firstChild) {
        currentRoute = currentRoute.firstChild;
      }
      const id = currentRoute.snapshot.paramMap.get('shopId');
      if(id!=null){
        this.shopId = Number(id);
      }
    });
  }

  ngOnDestroy(): void {
    this.AuthSub.unsubscribe();
  }

  private lastTouchEnd = 0;

  // @HostListener('document:touchend', ['$event'])
  // onTouchEnd(event: TouchEvent) {
  //   const now = new Date().getTime();
  //   if (now - this.lastTouchEnd <= 300) {
  //     event.preventDefault(); 
  //   }
  //   this.lastTouchEnd = now;
  // }
}
