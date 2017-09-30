import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { MenuItem } from '../../interfaces/dropdown.interface';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelectorComponent implements OnChanges {

  @Input() list: any[];                             // List of elements to display
  @Input() label: string = '';                      // Label of the list
  @Input() field: string = 'empty';                 // Field of the item to display
  @Input() isLoading: boolean = true;               // Loading flag
  @Output() selectedItemOutput: EventEmitter<any>;  // Event emitter when the user selects one element

  menuList: MenuItem[];                              // Menu item list

  constructor() {
    this.selectedItemOutput = new EventEmitter<any>();
  }

  /**
   * Update component when the list changes
   */
  ngOnChanges(change: SimpleChanges): void {
    if (change && change['list'] && change['list'].currentValue) {
      this.menuList = this.getMenuItems(this.list);
    }
  }

  /**
   * Update selected item and emits the new value
   * @param item
   */
  selectedItemEvent(item: any): void {
    this.selectedItemOutput.emit(item.value);
  }

  /**
   * Returns a Menu Item list
   * @param list
   */
  private getMenuItems(list: any[]): MenuItem[] {
    let ret: any[];
    if (list) {
      ret = list.map((elem) => {
        return {
          label: elem[this.field],
          value: elem
        };
      });
    }

    return ret;
  }

}
