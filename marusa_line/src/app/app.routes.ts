import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { CardDetailsComponent } from './pages/card-details/card-details.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { authGuard } from './auth.guard';
import { OrderProductComponent } from './pages/order-product/order-product.component';
import { OrderDetailsComponent } from './pages/order-details/order-details.component';
import { MainComponent } from './pages/main/main.component';

export const routes: Routes = [
    { path:'home', component: HomeComponent},
    { path:'shop/:shopId', component: HomeComponent},
    { path:'card-details/:id', component: CardDetailsComponent},
    { path:'order-product/:id', component: OrderProductComponent},
    { path:'order-details/:id', component: OrderDetailsComponent},
    { path:'profile', component: ProfileComponent,canActivate:[authGuard]},
    { path:'', component: HomeComponent},
    { path: '', component: HomeComponent }, 
    { path: '**', component: HomeComponent }  
    // { path:'', component: MainComponent},
    // { path: '', component: MainComponent }, 
    // { path: '**', component: MainComponent }  
];
