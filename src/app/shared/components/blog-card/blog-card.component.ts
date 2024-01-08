import { Component, Input } from '@angular/core';

@Component({
  selector: 'blog-card',
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.scss'],
})
export class BlogCardComponent {
  @Input({ required: true }) cover = '';
  @Input({ required: true }) title = '';
  @Input({ required: true }) author = '';
  @Input({ required: true }) time: number | string = 0;
}
