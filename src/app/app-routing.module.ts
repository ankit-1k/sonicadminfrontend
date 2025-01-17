import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Admin/home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { TelusersComponent } from './Admin/Telegram/telusers/telusers.component';
import { ProjectsComponent } from './Admin/Site/projects/projects.component';
import { SalesComponent } from './Admin/Telegram/sales/sales.component';
import { BlogComponent } from './Admin/Site/blog/blog.component';
import { HeroComponent } from './Admin/Layout/hero/hero.component';
import { AboutComponent } from './Admin/Layout/about/about.component';
import { FaqComponent } from './Admin/Site/faq/faq.component';
import { ServicesComponent } from './Admin/Site/services/services.component';
import { NewsComponent } from './Admin/Site/news/news.component';
import { AnnouncementComponent } from './Admin/Events/announcement/announcement.component';
import { CloudnaryComponent } from './Test/cloudnary/cloudnary.component';
import { WebsitesComponent } from './Admin/Setting/websites/websites.component';
import { OtpGuard } from './otp.guard';
import { AdmincontactsComponent } from './Admin/Events/admincontacts/admincontacts.component';
import { RequestsComponent } from './Admin/more/requests/requests.component';
import { AdminreqComponent } from './Admin/more/adminreq/adminreq.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  // site
  { path: 'projects', component: ProjectsComponent, canActivate: [AuthGuard] },
  { path: 'blog', component: BlogComponent, canActivate: [AuthGuard] },
  { path: 'faq', component: FaqComponent, canActivate: [AuthGuard] },
  { path: 'services', component: ServicesComponent, canActivate: [AuthGuard] },
  { path: 'news', component: NewsComponent, canActivate: [AuthGuard] },
  // layout
  { path: 'hero', component: HeroComponent, canActivate: [AuthGuard] },
  { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
  // Events
  { path: 'announcement', component: AnnouncementComponent, canActivate: [AuthGuard] },
  { path: 'admincontact', component: AdmincontactsComponent, canActivate: [AuthGuard,OtpGuard] },
  // tele
  { path: 'telsales', component: SalesComponent, canActivate: [OtpGuard, AuthGuard] },
  { path: 'telusers', component: TelusersComponent, canActivate: [OtpGuard, AuthGuard] },
  // setting
  { path: 'websites', component: WebsitesComponent, canActivate: [OtpGuard, AuthGuard] },
  // test
  { path: 'requests', component: RequestsComponent, canActivate: [AuthGuard,OtpGuard] },
  { path: 'adminrequests', component: AdminreqComponent, canActivate: [AuthGuard,OtpGuard] },
  // test
  { path: 'test1', component: CloudnaryComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
