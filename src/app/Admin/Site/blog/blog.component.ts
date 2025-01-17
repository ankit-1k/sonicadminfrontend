import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { BlogService } from 'src/app/services/site/blog.service';
import { WebsiteService } from 'src/app/services/setting/website.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit { 

  visibleAdd: boolean = false; 
  visibleEdit: boolean = false;
  position: string = 'center';
  blogs: Blog[] = [];  
  filteredBlogs: Blog[] = [];  
  categories: any[] = [];
  selectedCategory: string = '';
  blogFrom: FormGroup
  selectedBlog: Blog | null = null;
  selectedBlogForView: Blog | null = null;
  isLoading:boolean=false
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private blogService: BlogService,private sitesService:WebsiteService) {
    this.blogFrom = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      desc: ['', Validators.required],
    })
  }

  fetchBlogs(category?: string): void {
    this.isLoading=true
    this.blogService.getBlogs(category).subscribe({
      next: response => {
        this.blogs = response;  
        this.filterBlogsByCategory();  
        this.isLoading=false
      },
      error: error => {
        console.log('Error fetching blogs...');
        this.isLoading=false
      }
    });
  }

  fetchSites(){
    this.sitesService.getWebsite().subscribe({
      next:(response:any[])=>{
        this.categories=response.map(site=>({
          label: site.name,
          value: site.name
        })) 
      },
      error:()=>{
        Swal.fire('Failed','failed to fetch sites...','error')
      }
    })
  }

  filterBlogsByCategory(): void {
    if (this.selectedCategory) {
      this.filteredBlogs = this.blogs.filter(blog => blog.category === this.selectedCategory);
    } else {
      this.filteredBlogs = this.blogs;  
    }
  }

  onCategoryChange() {
    this.filterBlogsByCategory();  
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

  submitBlog() {
    if (this.blogFrom.valid) {
      const blogData = this.blogFrom.value;

      const formData = new FormData();
      formData.append('name', blogData.name);
      formData.append('category', blogData.category);
      formData.append('desc', blogData.desc);
      
      if (this.selectedFile) {
        formData.append('image', this.selectedFile); // Append the selected file
      }

      if (this.selectedBlog) {
        this.visibleAdd=false
        this.visibleEdit=false
        this.isLoading = true;
        this.blogService.putBlog(formData, this.selectedBlog._id).subscribe({
          next: (response) => {
            console.log('Blog updated:', response);
            this.fetchBlogs();
            this.visibleEdit = false;
            this.blogFrom.reset();
            this.selectedBlog = null;
            this.selectedFile = null; // Clear selected file
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error updating blog:', error);
            this.isLoading = false;
          }
        });
      } else {
        this.visibleAdd=false
        this.visibleEdit=false
        this.isLoading = true;
        this.blogService.postBlog(formData).subscribe({ 
          next: (response) => {
            console.log('Blog added:', response);
            this.fetchBlogs();
            this.visibleAdd = false;
            this.blogFrom.reset();
            this.selectedFile = null; // Clear selected file
            this.isLoading = false;
          }, 
          error: (error) => {
            console.error('Error adding blog:', error);
            this.isLoading = false;
          }
        });
      }
    } else {
      console.error('Form is invalid');
    }
  }

  showDialogEdit(position: string, blog: Blog) {
    this.position = position;
    this.visibleEdit = true;
    this.selectedBlog = blog; 
    if (blog) {
      this.blogFrom.patchValue(blog); 
    }
  }

  deleteBlog(blog: Blog): void { 
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete the blog: ${blog.name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true  
    }).then((result) => {
      if (result.isConfirmed) {
        this.visibleAdd=false
        this.visibleEdit=false
        this.isLoading=true
        this.blogService.deleteBlog(blog._id).subscribe({
          next: response => {
            Swal.fire('Deleted!', 'The blog has been deleted.', 'success'); 
            this.fetchBlogs();  
            this.isLoading=false
          },
          error: error => {
            Swal.fire('Error!', 'There was an issue deleting the blog.', 'error'); 
            console.log('Error deleting blog:', error);
            this.isLoading=false
          }
        });
      }
    });
  }

  viewData(blog:any){
    this.selectedBlogForView = blog;    
  }

  ngOnInit(): void {
    this.fetchBlogs();
    this.fetchSites()
  }
}

// Interface for Blog data
export interface Blog {
  _id: string;
  name: string;
  desc: string;
  category: string;
  date: string;
}
