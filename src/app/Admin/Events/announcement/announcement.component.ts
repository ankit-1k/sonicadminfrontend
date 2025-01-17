import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnnouncementService } from 'src/app/services/Events/announcement.service';
import { WebsiteService } from 'src/app/services/setting/website.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss']
})
export class AnnouncementComponent implements OnInit {

  visibleAdd: boolean = false;
  visibleEdit: boolean = false;
  position: string = 'center';
  announcements: Announcement[] = [];
  filteredannouncements: Announcement[] = [];
  categories: any[] = [];
  durations: any[] = [
    { label: '1H', value: '1h' },
    { label: '10Sec', value: '10s' },
    { label: '12H', value: '12h' },
    { label: '24H', value: '24h' },
  ];
  selectedCategory: string = '';
  announcementFrom: FormGroup
  selectedannouncement: Announcement | null = null;
  selectedannouncementForView: Announcement | null = null;
  isLoading: boolean = false

  constructor(private fb: FormBuilder, private announcementService: AnnouncementService, private siteService:WebsiteService) {
    this.announcementFrom = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      desc: ['', Validators.required],
      duration: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.fetchannouncements();
    this.fetchSites()
  }

  fetchSites(){
    this.siteService.getWebsite().subscribe({
      next:(response:any[])=>{
        this.categories=response.map(site=>({
          label:site.name,
          value:site.name
        }))
      }
    })
  }

  fetchannouncements(category?: string): void {
    this.isLoading = true
    this.announcementService.getAnnouncements(category).subscribe({
      next: response => {
        this.announcements = response;
        this.filterannouncementsByCategory();
        this.isLoading = false
      },
      error: error => {
        console.log('Error fetching announcements...');
        this.isLoading = false
      }
    });
  }

  filterannouncementsByCategory(): void {
    if (this.selectedCategory) {
      this.filteredannouncements = this.announcements.filter(announcement => announcement.category === this.selectedCategory);
    } else {
      this.filteredannouncements = this.announcements;
    }
  }

  onCategoryChange() {
    this.filterannouncementsByCategory();
  }

  showDialogAdd(position: string) {
    this.position = position;
    this.visibleAdd = true;
  }

  submitannouncement() {
    if (this.announcementFrom.valid) {
      const announcementData = this.announcementFrom.value;

      if (this.selectedannouncement) {
        this.visibleAdd = false
        this.visibleEdit = false
        this.isLoading = true
        // Edit existing announcement
        this.announcementService.putAnnouncement({ ...announcementData, _id: this.selectedannouncement._id }).subscribe({
          next: response => {
            console.log('announcement updated:', response);
            this.fetchannouncements();
            this.visibleEdit = false;
            this.announcementFrom.reset();
            this.selectedannouncement = null;
            this.isLoading = false
          },
          error: error => {
            console.log('Error updating announcement:', error);
            this.isLoading = false
          }
        });
      } else {
        // Add new announcement
        this.visibleAdd=false
        this.visibleEdit=false
        this.isLoading = true
        this.announcementService.postAnnouncement(announcementData).subscribe({
          next: response => {
            console.log('announcement added:', response);
            this.fetchannouncements();
            this.visibleAdd = false;
            this.announcementFrom.reset();
            this.isLoading = false
          },
          error: error => {
            console.log('Error adding announcement:', error);
            this.isLoading = false
          }
        });
      }
    } else {
      console.log('Form is invalid');
    }
  }

  showDialogEdit(position: string, announcement: Announcement) {
    this.position = position;
    this.visibleEdit = true;
    this.selectedannouncement = announcement;
    if (announcement) {
      this.announcementFrom.patchValue(announcement);
    }
  }

  deleteannouncement(announcement: Announcement): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete the announcement: ${announcement.name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      this.isLoading=true
      if (result.isConfirmed) {
        this.announcementService.deleteAnnouncement(announcement._id).subscribe({
          next: response => {
            Swal.fire('Deleted!', 'The announcement has been deleted.', 'success');
            this.fetchannouncements();
            this.isLoading=false
          },
          error: error => {
            Swal.fire('Error!', 'There was an issue deleting the announcement.', 'error');
            console.log('Error deleting announcement:', error);
            this.isLoading=false
          }
        });
      }
      else {
        this.isLoading = false;
      }
    });
  }

  viewData(announcement: any) {
    this.selectedannouncementForView = announcement;
  }

}
export interface Announcement {
  _id: string;
  name: string;
  desc: string;
  category: string;
  date: string;
  duration: string
}