import { Component, OnInit } from '@angular/core';
import { RequestsService } from 'src/app/services/more/requests.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adminreq',
  templateUrl: './adminreq.component.html',
  styleUrls: ['./adminreq.component.scss']
})
export class AdminreqComponent implements OnInit {

  allReq: any[] = []

  constructor(private reqService: RequestsService) { }

  fetchReq() {
    this.reqService.getReq().subscribe({
      next: response => {
        this.allReq = response
      },
      error: error => {
        Swal.fire({
          title: 'Failed',
          text: "Failed to fetch Requests",
          icon: 'error',
          timer: 1000
        })
      }
    })
  }

  deleteReq(reqId: any) {
    this.reqService.deleteReq(reqId).subscribe({
      next: () => {
        this.allReq = this.allReq.filter(req => req._id !== reqId); // Remove deleted item from the list
        Swal.fire({
          title: 'Deleted!',
          text: 'Request has been deleted.',
          icon: 'success',
          timer: 1000,
        });
      },
      error: () => {
        Swal.fire({
          title: 'Failed',
          text: 'Failed to delete the request.',
          icon: 'error',
          timer: 1000,
        });
      },
    });
  }

  ngOnInit(): void {
    this.fetchReq()
  }

}
