import { Injectable } from '@angular/core';

@Injectable()
export class DialogService {

  private isDialogShown: boolean; // Show dialog flag
  private title: string;          // Title
  private text: string;           // Text

  constructor() {
    this.isDialogShown = false;
    this.text = '';
    this.title = '';
  }

  /**
   * Returns show dialog flag
   */
  isShown(): boolean {
    return this.isDialogShown;
  }

  /**
   * Show dialog
   */
  show(title: string, text: string): void {
    this.title = title;
    this.text = text;
    this.isDialogShown = true;
  }

  /**
   * Hide dialog flag
   */
  hide(): void {
    this.isDialogShown = false;
  }

  /**
   * Returns title
   */
  getTitle(): string {
    return this.title;
  }

  /**
   * Returns text
   */
  getText(): string {
    return this.text;
  }
}
