import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HeroService } from 'src/app/services/layout/hero.service';
import { WebsiteService } from 'src/app/services/setting/website.service';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit {
visibleAdd: boolean = false;
  visibleEdit: boolean = false;
  position: string = 'center';
  heros: Hero[] = [];  
  filteredheros: Hero[] = [];  
  categories: any[] = [
    { label: 'Science', value: 'Science' },
    { label: 'Science & Technology', value: 'Science & Technology' },
    { label: 'Science and Technology', value: 'Science and Technology' }
  ];
  selectedCategory: string = '';
  heroFrom: FormGroup
  selectedhero: Hero | null = null;
  selectedheroForView: Hero | null = null;
  isLoading:boolean=false
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private heroService: HeroService, private seiteService:WebsiteService) {
    this.heroFrom = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      desc: ['', Validators.required],
      text1: [''],
      text2: [''],
    })
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  fetchSites(){
    this.seiteService.getWebsite().subscribe({
      next:(response:any[])=>{
        this.categories=response.map(site=>({
          label:site.name,
          value:site.name
        }))
      }
    })
  }

  fetchheros(category?: string): void {
    this.isLoading=true
    this.heroService.getHeros(category).subscribe({
      next: response => {
        this.heros = response;  
        this.filterherosByCategory();  
        this.isLoading=false
      },
      error: error => {
        console.log('Error fetching heros...');
        this.isLoading=false
      }
    });
  }

  filterherosByCategory(): void {
    if (this.selectedCategory) {
      this.filteredheros = this.heros.filter(hero => hero.category === this.selectedCategory);
    } else {
      this.filteredheros = this.heros;  
    }
  }

  onCategoryChange() {
    this.filterherosByCategory();  
  }

  showDialogAdd(position: string) {
    this.position = position;
    this.visibleAdd = true;
  }

  submitHero() {
    if (this.heroFrom.valid) {
      const heroData = this.heroFrom.value;

      const formData = new FormData();
      formData.append('title', heroData.title);
      formData.append('category', heroData.category);
      formData.append('desc', heroData.desc);
      formData.append('text1', heroData.text1);
      formData.append('text2', heroData.text2);
      if (this.selectedFile) {
        formData.append('image', this.selectedFile); 
      }

      if (this.selectedhero) {
        this.visibleAdd=false
        this.visibleEdit=false
        this.isLoading = true;
        this.heroService.putHero(formData, this.selectedhero._id).subscribe({
          next: (response) => {
            console.log('hero updated:', response);
            this.fetchheros();
            this.visibleEdit = false;
            this.heroFrom.reset();
            this.selectedhero = null;
            this.selectedFile = null; 
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error updating hero:', error);
            this.isLoading = false;
          }
        });
      } else {
        this.isLoading = true;
        this.visibleAdd=false
        this.visibleEdit=false
        this.heroService.postHero(formData).subscribe({
          next: (response) => {
            console.log('hero added:', response);
            this.fetchheros();
            this.visibleAdd = false;
            this.heroFrom.reset();
            this.selectedFile = null; // Clear selected file
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error adding hero:', error);
            this.isLoading = false;
          }
        });
      }
    } else {
      console.error('Form is invalid');
    }
  }

  showDialogEdit(position: string, hero: Hero) {
    this.position = position;
    this.visibleEdit = true;
    this.selectedhero = hero; 
    if (hero) {
      this.heroFrom.patchValue(hero); 
    }
  }

  deletehero(hero: Hero): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete the hero: ${hero.title}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true  
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading=true
        this.heroService.deleteHero(hero._id).subscribe({
          next: response => {
            Swal.fire('Deleted!', 'The hero has been deleted.', 'success'); 
            this.fetchheros();  
            this.isLoading=false
          },
          error: error => {
            Swal.fire('Error!', 'There was an issue deleting the hero.', 'error'); 
            console.log('Error deleting hero:', error);
            this.isLoading=false
          }
        });
      }
    });
  }

  viewData(hero:any){
    this.selectedheroForView = hero;    
  }

  ngOnInit(): void {
    this.fetchheros();
    this.fetchSites()
  }
}
export interface Hero {
  _id: string;
  title: string;
  imageUrl:string,
  desc: string;
  category: string;
  date: string;
  text1:string;
  text2:string;
}
