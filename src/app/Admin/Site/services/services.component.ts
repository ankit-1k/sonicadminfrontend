import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WebsiteService } from 'src/app/services/setting/website.service';
import { ServicesService } from 'src/app/services/site/services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  visibleAdd: boolean = false;
  visibleEdit: boolean = false;
  position: string = 'center';
  services: Service[] = [];
  filteredservices: Service[] = [];
  categories: any[] = [];
  selectedCategory: string = '';
  serviceFrom: FormGroup
  selectedservice: Service | null = null;
  selectedserviceForView: Service | null = null;
  isLoading: boolean = false

  constructor(private fb: FormBuilder, private serviceService: ServicesService, private siteService: WebsiteService) {
    this.serviceFrom = this.fb.group({
      name: ['', Validators.required],
      icon: ['', Validators.required],
      category: ['', Validators.required],
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

  fetchservices(category?: string): void {
    this.visibleAdd = false
    this.visibleEdit = false
    this.isLoading = true
    this.serviceService.getServices(category).subscribe({
      next: response => {
        this.services = response;
        this.filterservicesByCategory();
        this.isLoading = false
      },
      error: error => {
        console.log('Error fetching services...');
        this.isLoading = false
      }
    });
  }

  filterservicesByCategory(): void {
    if (this.selectedCategory) {
      this.filteredservices = this.services.filter(service => service.category === this.selectedCategory);
    } else {
      this.filteredservices = this.services;
    }
  }

  onCategoryChange() {
    this.filterservicesByCategory();
  }

  showDialogAdd(position: string) {
    this.position = position;
    this.visibleAdd = true;
  }

  submitservice() {
    if (this.serviceFrom.valid) {
      const serviceData = this.serviceFrom.value;

      if (this.selectedservice) {
        this.visibleAdd=false
        this.visibleEdit=false
        this.isLoading = true
        // Edit existing service
        this.serviceService.putService({ ...serviceData, _id: this.selectedservice._id }).subscribe({
          next: response => {
            console.log('service updated:', response);
            this.fetchservices();
            this.visibleEdit = false;
            this.serviceFrom.reset();
            this.selectedservice = null;
            this.isLoading = false
          },
          error: error => {
            console.log('Error updating service:', error);
            this.isLoading = false
          }
        });
      } else {
        // Add new service
        this.isLoading = true
        this.visibleAdd=false
        this.visibleEdit=false
        this.serviceService.postService(serviceData).subscribe({
          next: response => {
            console.log('service added:', response);
            this.fetchservices();
            this.visibleAdd = false;
            this.serviceFrom.reset();
            this.isLoading = false
          },
          error: error => {
            console.log('Error adding service:', error);
            this.isLoading = false
          }
        });
      }
    } else {
      console.log('Form is invalid');
    }
  }

  showDialogEdit(position: string, service: Service) {
    this.position = position;
    this.visibleEdit = true;
    this.selectedservice = service;
    if (service) {
      this.serviceFrom.patchValue(service);
    }
  }

  deleteservice(service: Service): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete the service: ${service.name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading=true
        this.visibleAdd=false
        this.visibleEdit=false
        this.serviceService.deleteService(service._id).subscribe({
          next: response => {
            Swal.fire('Deleted!', 'The service has been deleted.', 'success');
            this.fetchservices();
            this.isLoading=false
          },
          error: error => {
            Swal.fire('Error!', 'There was an issue deleting the service.', 'error');
            console.log('Error deleting service:', error);
            this.isLoading=false
          }
        });
      }
    });
  }

  viewData(service: any) {
    this.selectedserviceForView = service;
  }

  ngOnInit(): void {
    this.fetchservices();
    this.fetchSites()
  }
}

export interface Service {
  _id: string;
  name: string;
  desc: string;
  category: string;
  date: string;
}