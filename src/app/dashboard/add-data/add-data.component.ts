import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BackendService } from 'src/app/shared/backend.service';
import { StoreService } from 'src/app/shared/store.service';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SuccessDialogComponent } from 'src/app/success-dialog/success-dialog.component';


@Component({
  selector: 'app-add-data',
  templateUrl: './add-data.component.html',
  styleUrls: ['./add-data.component.scss']
})
export class AddDataComponent implements OnInit {
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
    });
  }

  onSubmit(): void {
    if (this.addChildForm.valid) {
      this.backendService.addChildData(this.addChildForm.value, this.currentPage);
      this.addChildForm.reset();
      
      this.openSuccessDialog();

    }
  }


  openSuccessDialog(): void {
    const modalRef = this.modalService.open(SuccessDialogComponent);
    // You can perform additional actions with the modalRef if needed
  }

  onToggleForm(): void {
    this.isFormOpen = !this.isFormOpen;
  }
}
