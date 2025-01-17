import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnnouncementService } from 'src/app/services/Events/announcement.service';
import { HomeService } from 'src/app/services/home.service';
import { WebsiteService } from 'src/app/services/setting/website.service';
import { BlogService } from 'src/app/services/site/blog.service';
import { FaqService } from 'src/app/services/site/faq.service';
import { NewsService } from 'src/app/services/site/news.service';
import { ProjectService } from 'src/app/services/site/project.service';
import { ServicesService } from 'src/app/services/site/services.service';
import { TeleusersService } from 'src/app/services/tele/teleusers.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  requestForm:FormGroup
  allBlogs: any[] = []
  allProjects: any[] = []
  allFaq: any[] = []
  allService: any[] = []
  allNews: any[] = []
  allSites: any[] = []
  siteNames: any[] = []
  allAnnouncements: any[] = []
  allTeleUsers: any[] = [] 
  // carouselItems: any[] = [
  //   {
  //     img: 'https://cdn.pixabay.com/photo/2016/11/21/17/59/blackboard-1846865_640.jpg',
  //     title: 'First slide label',
  //     description: 'Some representative placeholder content for the first slide.',
  //   },
  //   {
  //     img: 'https://cdn.pixabay.com/photo/2019/11/07/12/18/slate-4608726_640.jpg',
  //     title: 'Second slide label',
  //     description: 'Some representative placeholder content for the second slide.',
  //   },
  //   {
  //     img: 'https://cdn.pixabay.com/photo/2015/12/01/15/43/black-1072366_640.jpg',
  //     title: 'Third slide label',
  //     description: 'Some representative placeholder content for the third slide.',
  //   },
  // ];

  constructor(private fb: FormBuilder, private blogService: BlogService,
    private projectService: ProjectService,
    private faqService: FaqService,
    private servicesService: ServicesService,
    private newsService: NewsService,
    private siteService: WebsiteService,
    private announcementsService: AnnouncementService,
    private teleUsersService: TeleusersService,
    private homeService:HomeService,
  ) {
    this.requestForm=this.fb.group({
      name:['',Validators.required],
      email:['',Validators.required],
      phone:['',Validators.required],
      subject:['',Validators.required],
      message:['',Validators.required],
    })
  }

  fetchBlog() {
    this.blogService.getBlogs().subscribe({
      next: response => {
        this.allBlogs = response
      },
      error: error => {
        Swal.fire('Error', 'Failed Blog...', 'error')
      }
    })
  }

  fetchProject() {
    this.projectService.getprojects().subscribe({
      next: response => {
        this.allProjects = response
      },
      error: error => {
        Swal.fire('Error', 'Failed Projects...', 'error')
      }
    })
  }

  fetchService() {
    this.servicesService.getServices()
      .subscribe({
        next: response => {
          this.allService = response
        },
        error: error => {
          Swal.fire('Error', 'Failed Services...', 'error')
        }
      })
  }

  fetchNews() {
    this.newsService.getNews().subscribe({
      next: response => {
        this.allNews = response
      },
      error: error => {
        Swal.fire('Error', 'Failed News...', 'error')
      }
    })
  }

  fetchSites() {
    this.siteService.getWebsite().subscribe({
      next: response => {
        this.allSites = response
        this.siteNames = response.map((site: any) => site.name)
        console.log(this.siteNames);
      },
      error: error => {
        Swal.fire('Error!', 'Failed to fetch sites...', 'error')
      }
    })
  }

  fetchAnnouncements() {
    this.announcementsService.getAnnouncements().subscribe({
      next: response => {
        this.allAnnouncements = response
      },
      error: error => {
        Swal.fire('Failed!', 'Failed GET Announcements', 'error')
      }
    })
  }

  fetchTeleUsers() {
    this.teleUsersService.getSales().subscribe({
      next: response => {
        this.allTeleUsers = response
      },
      error: error => {
        Swal.fire('Failed!', 'Failed GET TeleUsers', 'error')
      }
    })
  }

  fetchFaq() {
    this.faqService.getFaqs().subscribe({
      next: response => {
        this.allFaq = response
      },
      error: error => {
        Swal.fire('Error', 'Failed FAQs...', 'error')
      }
    })
  }

  submitForm() {
    if(this.requestForm.valid){
      this.homeService.postContact(this.requestForm.value).subscribe({
        next:()=>{
          Swal.fire('Success','successfully contact submitted...','success')
        },
        error:()=>{
          Swal.fire('Error!','failed to submit contact...','error')
        }
      })
    }
    else{
      Swal.fire('Invalid!','invalid data...','warning')
    }
  }

  ngOnInit(): void {
    this.fetchBlog();
    this.fetchProject();
    this.fetchFaq();
    this.fetchService();
    this.fetchNews();
    this.fetchSites();
    this.fetchAnnouncements();
    this.fetchTeleUsers();
  }

}
