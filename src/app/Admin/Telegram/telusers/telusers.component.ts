import { Component, OnInit } from '@angular/core';
import { TeleusersService } from 'src/app/services/tele/teleusers.service';

@Component({
  selector: 'app-telusers',
  templateUrl: './telusers.component.html',
  styleUrls: ['./telusers.component.scss']
})
export class TelusersComponent implements OnInit {

  getAllUsers: any[] = [];
  aggregatedUsers: any[] = [];
  filteredUsers: any[] = [];
  selectedFilter: string = '';
  selectedUser: any = null;

  items = [
    { label: 'L1 (Below 500)', value: 'l1' },
    { label: 'L2 (500 - 1000)', value: 'l2' },
    { label: 'L3 (2000 - 3000)', value: 'l3' },
    { label: 'L4 (Above 3000)', value: 'l4' },
  ];

  constructor(private usersService: TeleusersService) {}

  fetchUsers() {
    this.usersService.getSales().subscribe({
      next: (response) => {
        this.getAllUsers = response.map((user: any) => ({
          ...user,
          amount: parseFloat(user.amount),
        }));
        this.aggregateUsers();
        this.filteredUsers = [...this.aggregatedUsers];
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  aggregateUsers() {
    const userMap = new Map<string, any>();

    this.getAllUsers.forEach((user) => {
      if (userMap.has(user.userName)) {
        const existingUser = userMap.get(user.userName);
        existingUser.amount += user.amount;
      } else {
        userMap.set(user.userName, { ...user });
      }
    });

    this.aggregatedUsers = Array.from(userMap.values());
  }

  applyFilter() {
    switch (this.selectedFilter) {
      case 'l1':
        this.filteredUsers = this.aggregatedUsers.filter(user => user.amount < 500);
        break;
      case 'l2':
        this.filteredUsers = this.aggregatedUsers.filter(user => user.amount >= 500 && user.amount < 1000);
        break;
      case 'l3':
        this.filteredUsers = this.aggregatedUsers.filter(user => user.amount >= 2000 && user.amount <= 3000);
        break;
      case 'l4':
        this.filteredUsers = this.aggregatedUsers.filter(user => user.amount > 3000);
        break;
      default:
        this.filteredUsers = [...this.aggregatedUsers];
    }
  }

  // Set selected user for detail view
  viewUserDetails(user: any) {
    this.selectedUser = user;
  }

  // Get the level based on the amount
  getLevel(amount: number): string {
    if (amount < 500) return 'L1';
    if (amount >= 500 && amount < 1000) return 'L2';
    if (amount >= 2000 && amount <= 3000) return 'L3';
    return 'L4';
  }

  // Get the color for the level
  getLevelColor(amount: number): string {
    if (amount < 500) return 'level-l1';
    if (amount >= 500 && amount < 1000) return 'level-l2';
    if (amount >= 2000 && amount <= 3000) return 'level-l3';
    return 'level-l4';
  }  

  ngOnInit(): void {
    this.fetchUsers();
  }
}
