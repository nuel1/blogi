import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { Blog } from 'src/app/model/blog';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnChanges {
  @Input() blogs: Blog[] = [];
  @Output() onCloseModal = new EventEmitter();

  noResult = false;
  searchResult: Blog[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['blogs']) {
      this.searchResult = changes['blogs'].currentValue;
    }
  }

  onSearch(e: Event) {
    const input = e.target as HTMLInputElement;
    const query = input.value.trim();

    this.searchResult = this.blogs.filter((blog: Blog) =>
      blog.title.match(new RegExp(`${query}`, 'i'))
    );

    if (!this.searchResult.length) this.noResult = true;
    else this.noResult = false;
  }
}
