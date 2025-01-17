import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequestsService } from 'src/app/services/more/requests.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {

  reqForm:FormGroup

  constructor(private fb:FormBuilder, private reqService:RequestsService) { 
    this.reqForm=this.fb.group({
      name:['',Validators.required],
      subject:['',Validators.required],
      message:['',Validators.required]
    })
  }

  submitReq(){
    if(this.reqForm.valid){
      this.reqService.postReq(this.reqForm.value).subscribe({
        next:response=>{
          Swal.fire('Posted','Request Posted successfully','success')
        },
        error:error=>{
          Swal.fire({
            title:'Failed!',
            text:'Failed to post request...',
            icon:'error',
            timer:1000
          })
        }
      })
    }else{
      Swal.fire({
        title:'Invalid!',
        text:'Invalid Data...',
        icon:'warning',
        timer:800
      })
    }
  }

  ngOnInit(): void {
  }

}
