import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AboutService } from 'src/app/services/layout/about.service';
import { WebsiteService } from 'src/app/services/setting/website.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  visibleAdd: boolean = false;
  visibleEdit: boolean = false;
  position: string = 'center';
  abouts: About[] = [];
  filteredabouts: About[] = [];
  categories: any[] = [];
  selectedCategory: string = '';
  aboutFrom: FormGroup
  selectedabout: About | null = null;
  selectedaboutForView: About | null = null;
  isLoading: boolean = false
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private aboutService: AboutService, private seiteService: WebsiteService) {
    this.aboutFrom = this.fb.group({
      title: ['', Validators.required],
      btnlink: ['', Validators.required],
      category: ['', Validators.required],
      desc: ['', Validators.required],
      text1: [''],
      text2: [''],
    })
  }

  fetchSites() {
    this.seiteService.getWebsite().subscribe({
      next: (response: any[]) => {
        this.categories = response.map(site => ({
          label: site.name,
          value: site.name
        }))
      }
    })
  }

  fetchabouts(category?: string): void {
    this.isLoading = true
    this.aboutService.getAbouts(category).subscribe({
      next: response => {
        this.abouts = response;
        this.filteraboutsByCategory();
        this.isLoading = false
      },
      error: error => {
        console.log('Error fetching abouts...');
        this.isLoading = false
      }
    });
  }

  filteraboutsByCategory(): void {
    if (this.selectedCategory) {
      this.filteredabouts = this.abouts.filter(about => about.category === this.selectedCategory);
    } else {
      this.filteredabouts = this.abouts;
    }
  }

  onCategoryChange() {
    this.filteraboutsByCategory();
  }

  showDialogAdd(position: string) {
    this.position = position;
    this.visibleAdd = true;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  submitabout() {
    if (this.aboutFrom.valid) {
      const aboutData = this.aboutFrom.value;
  
      const formData = new FormData();
      formData.append('title', aboutData.title);
      formData.append('desc', aboutData.desc);
      formData.append('text1', aboutData.text1);
      formData.append('text2', aboutData.text2);
      formData.append('btnlink', aboutData.btnlink);
      formData.append('category', aboutData.category);
  
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }
  
      if (this.selectedabout) {
        this.visibleAdd=false
        this.visibleEdit=false
        this.isLoading = true;
        // Edit existing about
        this.aboutService.putAbout(formData, this.selectedabout._id).subscribe({
          next: response => {
            console.log('About updated:', response);
            this.fetchabouts();
            this.visibleEdit = false;
            this.aboutFrom.reset();
            this.selectedabout = null;
            this.isLoading = false;
          },
          error: error => {
            console.log('Error updating about:', error);
            this.isLoading = false;
          }
        });
      } else {
        // Add new about
        this.visibleAdd=false
        this.visibleEdit=false
        this.isLoading = true;
        this.aboutService.postAbout(formData).subscribe({
          next: response => {
            console.log('About added:', response);
            this.fetchabouts();
            this.visibleAdd = false;
            this.aboutFrom.reset();
            this.isLoading = false;
          },
          error: error => {
            console.log('Error adding about:', error);
            this.isLoading = false;
          }
        });
      }
    } else {
      console.log('Form is invalid');
    }
  }
  
  showDialogEdit(position: string, about: About) {
    this.position = position;
    this.visibleEdit = true;
    this.selectedabout = about;
    if (about) {
      this.aboutFrom.patchValue(about);
    }
  }

  deleteabout(about: About): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete the about: ${about.title}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading=true
        this.aboutService.deleteAbout(about._id).subscribe({
          next: response => {
            Swal.fire('Deleted!', 'The about has been deleted.', 'success');
            this.fetchabouts();
            this.isLoading=false
          },
          error: error => {
            Swal.fire('Error!', 'There was an issue deleting the about.', 'error');
            console.log('Error deleting about:', error);
            this.isLoading=false
          }
        });
      }
    });
  }

  viewData(about: any) {
    this.selectedaboutForView = about;
  }
  ngOnInit(): void {
    this.fetchabouts();
    this.fetchSites()
  }
}
export interface About {
  _id: string;
  title: string;
  imageUrl: string,
  desc: string;
  category: string;
  date: string;
  text1: string;
  text2: string;
  btnlink: string;
}