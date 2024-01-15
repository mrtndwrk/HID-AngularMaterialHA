import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { BackendService } from 'src/app/shared/backend.service';
import { CHILDREN_PER_PAGE } from 'src/app/shared/constants';
import { StoreService } from 'src/app/shared/store.service';
import { PageEvent } from '@angular/material/paginator';
import { ChildResponse } from 'src/app/shared/interfaces/Child';
import { Child } from 'src/app/shared/interfaces/Child';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {
  constructor(public storeService: StoreService, private backendService: BackendService, private snackBar: MatSnackBar) {}

  sortProperty: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';
  dataSource: MatTableDataSource<ChildResponse> = new MatTableDataSource<ChildResponse>([]);


  @ViewChild(MatSort, { static: true }) sort!: MatSort;


  @Input() currentPage!: number;
  @Output() selectPageEvent = new EventEmitter<number>();
  loading = true;
  kindergartens: any[] = []; // Make sure to update the type accordingly

  selectedKindergarten: string | null = null;
  selectedSortOption: 'name' | 'kindergarten' | 'registrationDate' = 'name';
  filteredChildren: ChildResponse[] = [];



ngOnInit(): void {
  this.backendService.getKindergardens().subscribe(kindergartens => {
    this.kindergartens = kindergartens;
  });

  this.backendService.getChildren(this.currentPage).subscribe(() => {
    this.filteredChildren = this.storeService.children.slice();
    this.loading = false;

    // Initialize the MatTableDataSource after loading the data
    this.dataSource = new MatTableDataSource<ChildResponse>(this.storeService.children);

    // Assign the MatSort to your data source
    this.dataSource.sort = this.sort;
  });
}


  getAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
  
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
  
    return Math.max(0, age);
  }
  
  

  onPageChange(event: PageEvent): void {
    this.selectPageEvent.emit(event.pageIndex + 1);
    this.storeService.children = [];
    this.loadData();
  }

  returnAllPages(): number {
    return Math.ceil(this.storeService.childrenTotalCount / CHILDREN_PER_PAGE);
  }

  cancelRegistration(child: ChildResponse): void {
    this.loading = true;
    this.storeService.children = [];
    this.backendService.deleteChildData(child.id, this.currentPage).subscribe(() => {
      this.loadData();
      this.showNotification(`${child.name} wurde aus Kindergarten ${child.kindergarden.name} abgemeldet`);
    });
  }
  


  
  sortChildren(property: string): void {
    if (this.sortProperty === property) {
      // Toggle sort order if the same property is clicked
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // Set default sort order when a new property is clicked
      this.sortOrder = 'asc';
    }
  
    this.sortProperty = property;
  
    this.storeService.children = this.storeService.children.slice().sort((a, b) => {
      const aValue = this.getPropertyValue(a, property);
      const bValue = this.getPropertyValue(b, property);
  
      if (aValue !== undefined && bValue !== undefined) {
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return aValue.localeCompare(bValue) * (this.sortOrder === 'asc' ? 1 : -1);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          return (aValue - bValue) * (this.sortOrder === 'asc' ? 1 : -1);
        }
      }
  
      return 0;
    });
  }
  
  
  getSortIcon(property: string): string {
    if (this.sortProperty === property) {
      return this.sortOrder === 'asc' ? '▲' : '▼';
    }
    return ''; // Empty string if not currently sorted by this property
  }
  
  

  
  private getPropertyValue(obj: any, key: string): any {
    return key.split('.').reduce((acc, current) => acc?.[current], obj);
  }
  
  
  

  sortedChildren(): ChildResponse[] {
    this.sortChildren('asc'); // You can specify the default sorting order here
    return this.storeService.children;
  }
  
  
  

  private loadData(): void {
    this.loading = true;
    this.backendService.getChildren(this.currentPage).subscribe(() => {
      this.loading = false;
    });
  }

  private showNotification(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 3000, 
    });
  }
}
