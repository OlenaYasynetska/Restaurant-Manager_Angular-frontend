import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' = 'primary';
}

