import { Component, Input } from '@angular/core';
import { DialogService } from '../../services/dialog/dialog.service'

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {

  @Input() title: string;       // Title
  @Input() text: string;        // Main text of the dialog
  @Input() dialogShow: boolean; // Flag to show the dialog
  isReady: boolean;             // Component ready flag

  constructor(
    private dialogService: DialogService
  ) {
  }

  /**
   * Close dialog event
   */
  closeClick() {
    this.dialogService.hide();
  }
}
