import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChartOptions } from 'chart.js';
import { SalesService } from 'src/app/services/tele/sales.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {

  basicData: any;
  basicOptions: any;
  selectedYear: string = '2024';
  filteredSales: any[] = [];
  totalSalesQuantity: number = 0;
  visibleAdd: boolean = false;
  visibleEdit: boolean = false;
  visibleData: boolean = false
  position: string = 'right';
  chartData: any;
  chartOptions: ChartOptions = {};
  salesForm: FormGroup
  isLoading: boolean = false
  users = [];
  searchedUsers:any[]=[]
  items = [
    { label: 'Red', value: 'red' },
    { label: 'Yellow', value: 'yellow' },
    { label: 'Green', value: 'green' },
  ];
  user: string = ''

  editingSalesId: any;
  allNames: string[] = [];  // Array to store only names
  allUsernames: string[] = [];  // Array to store only usernames

  filteredNames: string[] = [];
  filteredUsernames: string[] = [];

  constructor(private fb: FormBuilder, private salesService: SalesService) {
    this.salesForm = this.fb.group({
      name: ['', Validators.required],
      userName: ['', Validators.required],
      date: ['', Validators.required],
      accNo: ['', Validators.required],
      coName: ['', Validators.required],
      amount: ['', Validators.required],
      status: ['', Validators.required]
    })
  }

  mnt: any[] = [];

  editSales(user: any, position: string) {
    this.visibleEdit = true;
    this.position = position;
    this.salesForm.patchValue({
      name: user.name,
      userName:user.userName,
      date: user.date,
      accNo: user.accNo,
      coName: user.coName,
      amount: user.amount,
      status: user.status,
    });
    this.editingSalesId = user._id;
  }

  submitSales() {
    this.isLoading = true;
    this.visibleAdd = false;
    this.visibleEdit = false;

    if (this.salesForm.valid) {
      if (this.editingSalesId) {
        // Edit mode
        this.salesService.putSales(this.salesForm.value, this.editingSalesId).subscribe({
          next: () => {
            Swal.fire('Success', 'User Updated Successfully...', 'success');
            this.isLoading = false;
            this.salesForm.reset()
            this.fetchSales(); 
          },
          error: () => {
            Swal.fire('Failed!', 'Failed to update the user...', 'error');
            this.isLoading = false;
          },
        });
      } else {
        // Add mode
        this.salesService.postSales(this.salesForm.value).subscribe({
          next: () => {
            Swal.fire('Success', 'User Added Successfully...', 'success');
            this.isLoading = false;
            this.fetchSales(); // Refresh data
          },
          error: () => {
            Swal.fire('Failed!', 'Failed to add user...', 'error');
            this.isLoading = false;
          },
        });
      }
    } else {
      Swal.fire('Invalid!', 'Invalid data. Check all fields...', 'warning');
      this.isLoading = false;
    }
  }

  deleteSales(salesId: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.salesService.deleteSales(salesId).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'The sale has been deleted.', 'success');
            this.isLoading = false;
            this.fetchSales(); // Refresh the sales list
          },
          error: () => {
            Swal.fire('Failed!', 'Unable to delete the sale.', 'error');
            this.isLoading = false;
          },
        });
      }
    });
  }

  ngOnInit() {
    this.fetchSales()
    this.getAllTeleSale()
  }

  fetchSales() {
    this.salesService.getSales().subscribe({
      next: (response) => {
        this.users = response;
        const currentYear = new Date().getFullYear();
        let monthlyAmounts: { [key: string]: number } = {};
        let totalAmount = 0; // Variable to store the total sales for the current year

        response.forEach((sale: any) => {
          const date = new Date(sale.date);
          const saleYear = date.getFullYear();

          if (saleYear === currentYear) {
            const month = date.toLocaleString('default', { month: 'long' });

            if (!monthlyAmounts[month]) {
              monthlyAmounts[month] = 0;
            }
            monthlyAmounts[month] += parseFloat(sale.amount);
            totalAmount += parseFloat(sale.amount); // Add to the total sales amount
          }
        });

        // Prepare the data for the bar chart
        this.mnt = Object.keys(monthlyAmounts).map((month) => ({
          month: month,
          totalAmount: monthlyAmounts[month].toFixed(2),
        }));

        // Prepare the chart data for PrimeNG's p-chart
        const months = Object.keys(monthlyAmounts);
        const amounts = Object.values(monthlyAmounts);

        this.chartData = {
          labels: months,  // Month names as x-axis labels
          datasets: [
            {
              label: 'Total Amount',
              data: amounts,
              backgroundColor: 'rgb(103,58,183)', // Blue color for bars
              borderColor: 'rgb(103,58,183)',
              borderWidth: 1,
            },
          ],
        };

        // Optional: Chart options for customization
        this.chartOptions = {
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Month',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Amount',
              },
            },
          },
        };

        // Set the total sales quantity for the current year
        this.totalSalesQuantity = parseFloat(totalAmount.toFixed(2)); // Store the total sales as a number
      },
      error: (error) => {
        console.error('Error fetching sales data', error);
      },
    });
  }

  getAllTeleSale() {
    this.salesService.getAllTeleSale().subscribe({
      next: response => {
        if (response && Array.isArray(response)) {
          this.allNames = response.map(item => item.name);
          this.allUsernames = response.map(item => item.userName);
        }
        console.log('Names:', this.allNames);
        console.log('Usernames:', this.allUsernames);
      }
    });
  }

  filterNames(event: any) {
    let query = event.query.toLowerCase();
    this.filteredNames = this.allNames.filter(name =>
      name.toLowerCase().includes(query)
    );
  }

  filterUsernames(event: any) {
    let query = event.query.toLowerCase();
    this.filteredUsernames = this.allUsernames.filter(username =>
      username.toLowerCase().includes(query)
    );
  }
  
  searchUser() {
    if (this.user) {
      console.log('Searching for user:', this.user);  // Log the search term
      this.salesService.searchUser(this.user).subscribe({
        next: response => {
          this.searchedUsers=response
          console.log(this.searchedUsers)
        },
        error: error => {
          console.log(error);
        }
      });
    }
  }

  showDialogAdd(position: string) {
    this.position = position;
    this.salesForm.reset();
    this.editingSalesId = null;
    this.visibleEdit = true;
  }

  showDialogData(position: string) {
    this.position = position
    this.visibleData = true
  }
}
