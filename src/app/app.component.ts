import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  value: string='';

  ngOnInit(): void {
    this.enableFullScreen();
  }

  enableFullScreen(): void {
    const element = document.documentElement; // Get the root element
    if (element.requestFullscreen) {
      element.requestFullscreen(); // Standard Fullscreen API
    } else if ((element as any).webkitRequestFullscreen) {
      (element as any).webkitRequestFullscreen(); // Safari compatibility
    } else if ((element as any).msRequestFullscreen) {
      (element as any).msRequestFullscreen(); // IE compatibility
    }
  }
}
