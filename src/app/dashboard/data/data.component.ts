import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { BackendService } from 'src/app/shared/backend.service';
import { CHILDREN_PER_PAGE } from 'src/app/shared/constants';
import { StoreService } from 'src/app/shared/store.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {
  constructor(public storeService: StoreService, private backendService: BackendService) {}

  @Input() currentPage!: number;
  @Output() selectPageEvent = new EventEmitter<number>();

  ngOnInit(): void {
    this.backendService.getChildren(this.currentPage);
  }

  getAge(birthDate: string) {
    // ... existing getAge method ...
  }

  // MatPaginator Page Change Event
  onPageChange(event: PageEvent): void {
    this.selectPageEvent.emit(event.pageIndex + 1);
    this.backendService.getChildren(event.pageIndex + 1);
  }

  public returnAllPages() {
    return Math.ceil(this.storeService.childrenTotalCount / CHILDREN_PER_PAGE);
  }

  public cancelRegistration(childId: string) {
    this.backendService.deleteChildData(childId, this.currentPage);
  }
}
