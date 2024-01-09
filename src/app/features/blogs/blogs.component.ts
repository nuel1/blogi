import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { Blog } from '../../model/blog';

@Component({
  selector: 'blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss'],
})
export class BlogsComponent implements OnInit {
  sharedService = inject(SharedService);

  currentPage = 1;

  fabOpen = false;
  blogs: Blog[] = [];
  loading = false;

  async ngOnInit() {
    this.loading = true;
    this.blogs = await this.sharedService.getBlogs();
    this.loading = false;
  }

  async addBlog(blog: Blog) {
    this.loading = true;
    await this.sharedService.addBlog(blog);
    this.blogs = await this.sharedService.getBlogs();
    this.loading = false;
  }

  closeModal(id: string) {
    document.getElementById(id)?.click();
  }

  toggleFab() {
    this.fabOpen = !this.fabOpen;
  }
}
