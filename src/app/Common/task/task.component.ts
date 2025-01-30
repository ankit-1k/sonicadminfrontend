import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from 'src/app/services/task/task.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  taskForm: FormGroup;
  allTasks: any[] = [];
  selectedTask: any = null;
  notifiedTasks: Set<string> = new Set(); // Track notified tasks
  message: string = '';  

  constructor(private fb: FormBuilder, private taskService: TaskService) { 
    this.taskForm = this.fb.group({
      taskName: ['', Validators.required],
      setDate: [new Date(), Validators.required],
      message: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.requestNotificationPermission();
    this.getTask();
    this.startTaskChecker(); // Start checking for notifications
  }

  // Request permission for notifications
  requestNotificationPermission() {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }
  }

  // Submit task to backend
  submitTask() {
    if (this.taskForm.valid) {
      const postData = {
        ...this.taskForm.value,
        setDate: new Date(this.taskForm.value.setDate).toISOString()
      };

      this.taskService.postTask(postData).subscribe({
        next: () => {
          this.getTask();
          this.taskForm.reset(); 
        },
        error: () => {
          
        }
      });
    } else {
      Swal.fire('Warning', 'All fields are required', 'warning');
    }
  }
  // Fetch tasks from backend
  getTask() {
    this.taskService.getTask().subscribe({
      next: response => {
        this.allTasks = response;
      },
      error: error => {
        console.error('Error fetching tasks:', error);
      }
    });
  }

  selectTask(task: any) {
    this.selectedTask = task;
  }  

  // Delete a task
  deleteTask(taskId: string) {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.getTask();  
      },
      error: () => {
        Swal.fire('Error', 'Failed to delete task', 'error');
      }
    });
  }

  // Start checking if a task's time has come
  startTaskChecker() {
    setInterval(() => {
      const now = new Date().getTime();

      this.allTasks.forEach(task => {
        const taskTime = new Date(task.setDate).getTime();

        if (now >= taskTime && !this.notifiedTasks.has(task._id)) {
          this.sendNotification(task);
          this.notifiedTasks.add(task._id); // Mark task as notified
        }
      });
    }, 600); // Check every 60 seconds
  }

  // Show notification when task time arrives
  sendNotification(task: any) {
    if (Notification.permission === 'granted') {
      const notification = new Notification('Task Reminder', {
        body: `Task: ${task.taskName}\nClick here for details`,
        icon: 'assets/notification-icon.png'
      });
  
      notification.onclick = () => {
        window.open(``, '_blank'); // Redirect to task details page
      };
    } else {
      Swal.fire('Notification Disabled', 'Please enable notifications in browser settings', 'info');
    }
  }  

  isTaskExpired(task: any): boolean {
    return new Date().getTime() >= new Date(task.setDate).getTime();
  }

  getNextUpcomingTaskId(): string | null {
    const now = new Date().getTime();
    let nextTask: any = null;
  
    this.allTasks.forEach(task => {
      const taskTime = new Date(task.setDate).getTime();
      if (taskTime > now && (!nextTask || taskTime < new Date(nextTask.setDate).getTime())) {
        nextTask = task;
      }
    });
  
    return nextTask ? nextTask._id : null;
  }  
}
