import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { BackendService } from 'src/app/shared/backend.service';
import { CHILDREN_PER_PAGE } from 'src/app/shared/constants';
import { StoreService } from 'src/app/shared/store.service';
import { PageEvent } from '@angular/material/paginator';
import { ChildResponse } from 'src/app/shared/interfaces/Child';
import { Child } from 'src/app/shared/interfaces/Child';

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
  kindergartens: any[] = []; // Make sure to update the type accordingly

  selectedKindergarten: string | null = null;

  ngOnInit(): void {
    this.backendService.getKindergardens().subscribe(kindergartens => {
      this.kindergartens = kindergartens;
    });
    this.backendService.getChildren(this.currentPage).subscribe(() => {
      this.loadData();
    });
  }

  getAge(birthDate: string) {
    // ... existing getAge method ...
  }

  onPageChange(event: PageEvent): void {
    this.selectPageEvent.emit(event.pageIndex + 1);
    this.storeService.children = [];
    this.loadData();
  }

  returnAllPages(): number {
    return Math.ceil(this.storeService.childrenTotalCount / CHILDREN_PER_PAGE);
  }

  cancelRegistration(childId: string): void {
    this.loading = true;
    this.storeService.children = [];
    this.backendService.deleteChildData(childId, this.currentPage).subscribe(() => {
      this.loadData();
    });
  }

  sortChildren(property: string, order: 'asc' | 'desc'): void {
    this.storeService.children.sort((a, b) => {
      const comparison = order === 'asc' ? 1 : -1;

      // Use type assertion to avoid TypeScript errors
      const aValue = (a as any)[property];
      const bValue = (b as any)[property];

      return aValue.localeCompare(bValue) * comparison;
    });
  }

  private loadData(): void {
    this.loading = true;
    this.backendService.getChildren(this.currentPage).subscribe(() => {
      this.loading = false;
    });
  }
}
