import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CloudnaryService } from 'src/app/services/Test/cloudnary.service';

@Component({
  selector: 'app-cloudnary',
  templateUrl: './cloudnary.component.html',
  styleUrls: ['./cloudnary.component.scss']
})
export class CloudnaryComponent implements OnInit {
  // uploadForm: FormGroup;
  // selectedFile: File | null = null;

  // data:any[]=[]

  // constructor(private fb: FormBuilder, private cloudnaryService: CloudnaryService) {
  //   this.uploadForm = this.fb.group({
  //     name: ['', [Validators.required]],
  //     description: ['', [Validators.required]],
  //     file: [null, [Validators.required]]
  //   });
  // }

  // fetchImg(){
  //   this.cloudnaryService.getImg().subscribe(
  //     response=>{
  //       this.data=response
  //     }
  //   )
  // }
  // onFileSelected(event: any): void {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.selectedFile = file;
  //     this.uploadForm.patchValue({ file: file });
  //   }
  // }

  // onUpload(): void {
  //   if (this.uploadForm.valid && this.selectedFile) {
  //     const formData = new FormData();
  //     formData.append('image', this.selectedFile, this.selectedFile.name);
  //     formData.append('name', this.uploadForm.get('name')?.value);
  //     formData.append('description', this.uploadForm.get('description')?.value);
  //     console.log(this.selectedFile);
      
  //     this.cloudnaryService.uploadImage(formData).subscribe(
  //       response => {
  //         console.log('Image uploaded successfully:', response);
  //       },
  //       error => {
  //         console.error('Error uploading image:', error);
  //       }
  //     );
  //   } else {
  //     console.error('Form is invalid or file is not selected.');
  //   }
  // }

  // onDelete(imageId: string): void {
  //   this.cloudnaryService.deleteImage(imageId).subscribe(
  //     response => {
  //       console.log('Image deleted successfully:', response);
  //       this.fetchImg(); // Refresh the images list after deletion
  //     },
  //     error => {
  //       console.error('Error deleting image:', error);
  //     }
  //   );
  // }  

  value: string='Dummy text';

  ngOnInit(): void {
    // this.fetchImg()
  }
}