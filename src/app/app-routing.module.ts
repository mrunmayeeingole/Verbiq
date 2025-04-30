import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutoLoginGuard } from './shared/guard/auto-login.guard';
import { AuthGuard } from './shared/guard/auth.guard';
import { MobileRestrictedComponent } from './components/mobile-restricted/mobile-restricted.component';
import { DeviceGuard } from './shared/guard/device.guard';
const routes: Routes = [
  {
    path: '',
    redirectTo: '/pages/can-data',
    pathMatch: 'full'
  },
  {
    path: "auth",
    loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule),
    canActivate: [AutoLoginGuard],
    // data: { allowMobile: false },
 
  },
  {
    path: 'pages',
    loadChildren: () =>
      import('./pages/pages-routing.module').then((m) => m.PagesRoutingModule),
    canActivate: [AuthGuard ],
    // data: { allowMobile: false },
  },
  {
    path: 'mobile-restricted',
    component: MobileRestrictedComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
