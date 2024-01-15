import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  public currentPage: number = 1;

  receiveMessage(newPageCount: number) {
    this.currentPage = newPageCount;
  }

  showForm = true;

toggleForm(): void {
  this.showForm = !this.showForm;
}


}
