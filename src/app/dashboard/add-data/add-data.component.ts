import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BackendService } from 'src/app/shared/backend.service';
import { StoreService } from 'src/app/shared/store.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

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
    public dialog: MatDialog, // Inject MatDialog
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


    }
  }



  onToggleForm(): void {
    this.isFormOpen = !this.isFormOpen;
  }
}
