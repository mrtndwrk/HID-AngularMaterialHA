import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Output() toggleForm: EventEmitter<void> = new EventEmitter<void>();
  @Input() isFormOpen: boolean = false;

  onToggleForm(): void {
    console.log('Toggle form button clicked');
    this.toggleForm.emit();
    this.isFormOpen = !this.isFormOpen;
  }
}
