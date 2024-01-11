import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { BackendService } from 'src/app/shared/backend.service';
import { CHILDREN_PER_PAGE } from 'src/app/shared/constants';
import { StoreService } from 'src/app/shared/store.service';
import { PageEvent } from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {
  constructor(public storeService: StoreService, private backendService: BackendService) {}

  @Input() currentPage!: number;
  @Output() selectPageEvent = new EventEmitter<number>();
  loading = true;

  ngOnInit(): void {
    this.backendService.getChildren(this.currentPage);
    this.loadData();

  }

  getAge(birthDate: string) {
    // ... existing getAge method ...
  }

  // MatPaginator Page Change Event
  onPageChange(event: PageEvent): void {
    this.selectPageEvent.emit(event.pageIndex + 1);
    
    // Clear the existing data before loading the new page
    this.storeService.children = [];
  
    this.loadData();
  }

  public returnAllPages() {
    return Math.ceil(this.storeService.childrenTotalCount / CHILDREN_PER_PAGE);
  }

  public cancelRegistration(childId: string) {
    this.loading = true;
    this.storeService.children = [];
    this.backendService.deleteChildData(childId, this.currentPage);
    setTimeout(() => {
      this.loading = false;
    }, 1000); 
  }

  private loadData(): void {
    this.loading = true;
    this.backendService.getChildren(this.currentPage);

    // Simulating a delay to show the spinner for a short duration
    setTimeout(() => {
      this.loading = false;
    }, 1000); 
  }
  

}
