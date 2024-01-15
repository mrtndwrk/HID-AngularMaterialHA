import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BackendService } from 'src/app/shared/backend.service';
import { StoreService } from 'src/app/shared/store.service';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SuccessDialogComponent } from 'src/app/success-dialog/success-dialog.component';
import { CHILDREN_PER_PAGE } from 'src/app/shared/constants';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-data',
  templateUrl: './add-data.component.html',
  styleUrls: ['./add-data.component.scss']
})


export class AddDataComponent implements OnInit {
  @Output() selectPageEvent: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    private formbuilder: FormBuilder,
    public storeService: StoreService,
    public backendService: BackendService,
    public dialog: MatDialog,
    private modalService: NgbModal,
  ) {}

  public addChildForm: any;
  @Input() currentPage!: number;
  public isFormOpen: boolean = false;

  ngOnInit(): void {
    this.addChildForm = this.formbuilder.group({
      name: ['', [Validators.required]],
      kindergardenId: ['', Validators.required],
      birthDate: [null, Validators.required]
    })
  }

  onSubmit(): void {
    if (this.addChildForm.valid) {
      this.backendService.addChildData(this.addChildForm.value, this.currentPage);
      this.addChildForm.reset();
      this.openSuccessDialog();
      this.isFormOpen = false;
  
      // Determine the last page after adding a child
      const lastPage = Math.ceil((this.storeService.childrenTotalCount + 1) / CHILDREN_PER_PAGE);
  
      // Emit the event to change the page to the last page
      this.selectPageEvent.emit(lastPage);
    }
  }
  


  
  

  openSuccessDialog(): void {
    const modalRef = this.modalService.open(SuccessDialogComponent);
    modalRef.result.then((result) => {
      // Close the form when the modal is closed
      if (result === 'OK') {
        this.isFormOpen = false;
      }
    }).catch(() => {
      // Handle the case when the modal is dismissed without clicking the OK button
      this.isFormOpen = false;
    });
  }

  onToggleForm(): void {
    this.isFormOpen = !this.isFormOpen;
  }
}
