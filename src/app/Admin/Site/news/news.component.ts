import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WebsiteService } from 'src/app/services/setting/website.service';
import { NewsService } from 'src/app/services/site/news.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  visibleAdd: boolean = false;
  visibleEdit: boolean = false;
  position: string = 'center';
  newss: News[] = [];
  filterednews: News[] = [];
  categories: any[] = [];
  selectedCategory: string = '';
  newsFrom: FormGroup
  selectednews: News | null = null;
  selectednewsForView: News | null = null;
  isLoading: boolean = false

  constructor(private fb: FormBuilder, private newsService: NewsService, private siteService: WebsiteService) {
    this.newsFrom = this.fb.group({
      heading: ['', Validators.required],
      img: ['', Validators.required],
      category: ['', Validators.required],
      link: ['', Validators.required],
      desc: ['', Validators.required],
    })
  }

  fetchSites() {
    this.siteService.getWebsite().subscribe({
      next: (response: any[]) => {
        this.categories = response.map(site => ({
          label: site.name,
          value: site.name
        }))
      }
    })
  }

  fetchnews(category?: string): void {
    this.isLoading = true
    this.newsService.getNews(category).subscribe({
      next: response => {
        this.newss = response;
        this.filternewssByCategory();
        this.isLoading = false
      },
      error: error => {
        console.log('Error fetching newss...');
        this.isLoading = false
      }
    });
  }

  filternewssByCategory(): void {
    if (this.selectedCategory) {
      this.filterednews = this.newss.filter(news => news.category === this.selectedCategory);
    } else {
      this.filterednews = this.newss;
    }
  }

  onCategoryChange() {
    this.filternewssByCategory();
  }

  showDialogAdd(position: string) {
    this.position = position;
    this.visibleAdd = true;
  }

  submitnews() {
    if (this.newsFrom.valid) {
      const newsData = this.newsFrom.value;

      if (this.selectednews) {
        this.visibleAdd = false
        this.visibleEdit = false
        this.isLoading = true
        // Edit existing news
        this.newsService.putNews({ ...newsData, _id: this.selectednews._id }).subscribe({
          next: response => {
            console.log('news updated:', response);
            this.fetchnews();
            this.visibleEdit = false;
            this.newsFrom.reset();
            this.selectednews = null;
            this.isLoading = false
          },
          error: error => {
            console.log('Error updating news:', error);
            this.isLoading = false
          }
        });
      } else {
        // Add new news
        this.isLoading = true
        this.visibleAdd=false
        this.visibleEdit=false
        this.newsService.postNews(newsData).subscribe({
          next: response => {
            console.log('news added:', response);
            this.fetchnews();
            this.visibleAdd = false;
            this.newsFrom.reset();
            this.isLoading = false
          },
          error: error => {
            console.log('Error adding news:', error);
            this.isLoading = false
          }
        });
      }
    } else {
      console.log('Form is invalid');
    }
  }

  showDialogEdit(position: string, news: News) {
    this.position = position;
    this.visibleEdit = true;
    this.selectednews = news;
    if (news) {
      this.newsFrom.patchValue(news);
    }
  }

  deletenews(news: News): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete the news: ${news.heading}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true
        this.newsService.deleteNews(news._id).subscribe({
          next: response => {
            Swal.fire('Deleted!', 'The news has been deleted.', 'success');
            this.fetchnews();
            this.isLoading = false
          },
          error: error => {
            Swal.fire('Error!', 'There was an issue deleting the news.', 'error');
            console.log('Error deleting news:', error);
            this.isLoading = false
          }
        });
      }
    });
  }

  viewData(news: any) {
    this.selectednewsForView = news;
  }

  ngOnInit(): void {
    this.fetchnews();
    this.fetchSites()
  }
}

export interface News {
  _id: string;
  heading: string;
  img: string;
  link: string;
  desc: string;
  category: string;
  date: string;
}