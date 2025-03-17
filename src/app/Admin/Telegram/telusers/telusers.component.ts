import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeleusersService } from 'src/app/services/tele/teleusers.service';

@Component({
  selector: 'app-telusers',
  templateUrl: './telusers.component.html',
  styleUrls: ['./telusers.component.scss']
})
export class TelusersComponent implements OnInit {
  usersList: any[] = []; 
  selectedUser: any = null; 
  topCustomers: any[] = []; 
  isLoading:boolean=false
  activeTabIndex: number = 0;

  constructor(private usersService: TeleusersService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.fetchAllUsers();
    this.route.queryParams.subscribe(params => {
      this.activeTabIndex=params['data']
    });
  }

  fetchAllUsers() {
    this.isLoading=true
    this.usersService.getSales().subscribe({
      next: (response: any[]) => {
        const userTotals = new Map<string, { name: string; totalAmount: number }>();

        response.forEach(user => {
          const name = user.name;
          const amount = parseFloat(user.amount) || 0;

          if (userTotals.has(name)) {
            userTotals.get(name)!.totalAmount += amount;
          } else {
            userTotals.set(name, { name, totalAmount: amount });
          }
        });
        
        this.isLoading=false
        this.usersList = Array.from(userTotals.values());

        // Sort users by totalAmount and take top 10
        this.topCustomers = [...this.usersList]
          .sort((a, b) => b.totalAmount - a.totalAmount)
          .slice(0, 10);
      },
      error: (error) => {
        console.log('Error In Telusers - : ', error);
        this.isLoading=false
      }
    });
  }

  // Function to select user for viewing details
  viewUserDetails(user: any) {
    this.selectedUser = user;
  }

  switchTab(tabIndex: number) {
    this.activeTabIndex = tabIndex;
  }
}
