import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WebsiteService } from 'src/app/services/setting/website.service';
import { ProjectService } from 'src/app/services/site/project.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  visibleAdd: boolean = false;
  visibleEdit: boolean = false;
  position: string = 'center';
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  categories: any[] = [];
  selectedCategory: string = '';
  projectFrom: FormGroup
  selectedproject: Project | null = null;
  selectedprojectForView: Project | null = null;
  isLoading: boolean = false
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private projectService: ProjectService, private siteService: WebsiteService) {
    this.projectFrom = this.fb.group({
      name: ['', Validators.required],
      category: [''],
      desc: ['', Validators.required],
      demo: ['', Validators.required]
    })
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  fetchprojects(category?: string): void {
    this.isLoading = true
    this.projectService.getprojects(category).subscribe({
      next: response => {
        this.projects = response;
        this.filterprojectsByCategory();
        this.isLoading = false
      },
      error: error => {
        console.log('Error fetching projects...');
        this.isLoading = false
      }
    });
  }

  fetchSites() {
    this.siteService.getWebsite().subscribe({
      next: (response: any[]) => {
        this.categories = response.map(site => ({
          label: site.name,
          value: site.value
        }))
      },
      error: () => {
        Swal.fire('Failed', 'failed to fetch sites...', 'error')
      }
    })
  }

  filterprojectsByCategory(): void {
    if (this.selectedCategory) {
      this.filteredProjects = this.projects.filter(project => project.category === this.selectedCategory);
    } else {
      this.filteredProjects = this.projects;
    }
  }

  onCategoryChange() {
    this.filterprojectsByCategory();
  }

  showDialogAdd(position: string) {
    this.position = position;
    this.visibleAdd = true;
  }

  submitProject() {
    if (this.projectFrom.valid) {
      this.visibleAdd = false
      this.visibleEdit = false
      const projectData = this.projectFrom.value;

      const formData = new FormData();
      formData.append('name', projectData.name);
      formData.append('category', projectData.category);
      formData.append('desc', projectData.desc);
      formData.append('demo', projectData.demo);
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      if (this.selectedproject) {
        this.isLoading = true;
        this.projectService.putproject(formData, this.selectedproject._id).subscribe({
          next: (response) => {
            console.log('project updated:', response);
            this.fetchprojects();
            this.visibleEdit = false;
            this.projectFrom.reset();
            this.selectedproject = null;
            this.selectedFile = null;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error updating project:', error);
            this.isLoading = false;
          }
        });
      } else {
        this.isLoading = true;
        this.visibleAdd = false
        this.visibleEdit = false
        this.projectService.postproject(formData).subscribe({
          next: (response) => {
            console.log('project added:', response);
            this.fetchprojects();
            this.visibleAdd = false;
            this.projectFrom.reset();
            this.selectedFile = null;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error adding project:', error);
            Swal.fire('Error', 'ISE or all field required', 'error')
            this.isLoading = false;
          }
        });
      }
    } else {
      console.error('Form is invalid');
    }
  }

  showDialogEdit(position: string, project: Project) {
    this.position = position;
    this.visibleEdit = true;
    this.selectedproject = project;
    if (project) {
      this.projectFrom.patchValue(project);
    }
  }

  deleteproject(project: Project): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete the project: ${project.name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.projectService.deleteproject(project._id).subscribe({
          next: response => {
            Swal.fire('Deleted!', 'The project has been deleted.', 'success');
            this.fetchprojects();
          },
          error: error => {
            Swal.fire('Error!', 'There was an issue deleting the project.', 'error');
            console.log('Error deleting project:', error);
          }
        });
      }
    });
  }

  viewData(project: any) {
    this.selectedprojectForView = project;
  }

  ngOnInit(): void {
    this.fetchprojects();
    this.fetchSites()
  }
}
// Interface for project data
export interface Project {
  _id: string;
  name: string;
  imageUrl: string;
  demo: string;
  desc: string;
  category: string;
  date: string;
}