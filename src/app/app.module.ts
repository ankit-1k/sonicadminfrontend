import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './Common/header/header.component';
import { ButtonModule } from 'primeng/button';  
import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { MessageService } from 'primeng/api';
import { BlockUIModule } from 'primeng/blockui';
import { PanelModule } from 'primeng/panel';
import { RippleModule } from 'primeng/ripple';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { KnobModule } from 'primeng/knob';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressBarModule } from 'primeng/progressbar';
import { CarouselModule } from 'primeng/carousel';
import { AccordionModule } from 'primeng/accordion';
import { ChartModule } from 'primeng/chart';
import { ImageModule } from 'primeng/image';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { OverlayPanelModule } from 'primeng/overlaypanel'
// components start ------------------------------------------------------------------>
import { LoginComponent } from './login/login.component';
import { TelusersComponent } from './Admin/Telegram/telusers/telusers.component';
import { ProjectsComponent } from './Admin/Site/projects/projects.component';
import { SalesComponent } from './Admin/Telegram/sales/sales.component';
import { BlogComponent } from './Admin/Site/blog/blog.component';
import { LoaderComponent } from './Common/loader/loader.component';
import { HeroComponent } from './Admin/Layout/hero/hero.component';
import { AboutComponent } from './Admin/Layout/about/about.component';
import { FaqComponent } from './Admin/Site/faq/faq.component';
import { ServicesComponent } from './Admin/Site/services/services.component';
import { NewsComponent } from './Admin/Site/news/news.component';
import { AnnouncementComponent } from './Admin/Events/announcement/announcement.component';
import { CloudnaryComponent } from './Test/cloudnary/cloudnary.component';
import { WebsitesComponent } from './Admin/Setting/websites/websites.component';
import { HomeComponent } from './Admin/home/home.component';
import { AdmincontactsComponent } from './Admin/Events/admincontacts/admincontacts.component';
import { FooterComponent } from './Common/footer/footer.component';
import { RequestsComponent } from './Admin/more/requests/requests.component';
import { AdminreqComponent } from './Admin/more/adminreq/adminreq.component';

@NgModule({
  declarations: [
    HomeComponent,
    AppComponent,
    HeaderComponent,
    LoginComponent,
    TelusersComponent,
    ProjectsComponent,
    SalesComponent,
    BlogComponent,
    LoaderComponent,
    HeroComponent,
    AboutComponent,
    FaqComponent,
    ServicesComponent,
    NewsComponent,
    AnnouncementComponent,
    CloudnaryComponent,
    WebsitesComponent,
    AdmincontactsComponent,
    FooterComponent,
    RequestsComponent,
    AdminreqComponent,
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    InputTextModule,HttpClientModule,
    FormsModule,
    ButtonModule, 
    SidebarModule, 
    BrowserAnimationsModule,
    TableModule,
    DropdownModule,
    ToastModule,
    BlockUIModule,
    PanelModule,
    RippleModule,
    InputSwitchModule,
    TabViewModule,
    DialogModule,
    KnobModule,
    InputTextareaModule,
    PaginatorModule,
    ProgressBarModule,
    CarouselModule,
    AccordionModule,
    ChartModule,
    ImageModule,
    ToolbarModule,
    FileUploadModule,
    CalendarModule,
    CheckboxModule,
    InputNumberModule,
    CommonModule ,
    OverlayPanelModule,
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
