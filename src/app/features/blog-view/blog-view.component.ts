import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../shared/shared.service';
import { Blog } from '../../model/blog';
import { Subject } from 'rxjs';

@Component({
  selector: 'blog-view',
  templateUrl: './blog-view.component.html',
  styleUrls: ['./blog-view.component.scss'],
})
export class BlogViewComponent implements OnInit, AfterViewInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  sharedService = inject(SharedService);

  @ViewChild('blogContent', { static: false }) div: ElementRef | undefined;

  fabOpen = false;
  $blog: Subject<Blog> = new Subject();
  blog: Blog | undefined;
  loading = false;

  async ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.loading = true;
    const blogs = await this.sharedService.getBlogs();

    const result = blogs.filter((blog: Blog) => blog.id === id);
    this.loading = false;
    if (result) {
      this.$blog.next(result[0]);
    }
  }

  ngAfterViewInit(): void {
    this.$blog.subscribe((data) => {
      this.blog = data;
      const el = this.div?.nativeElement as HTMLElement;
      el.innerHTML = data.content;
    });
  }

  async deleteBlog() {
    if (this.blog) {
      this.loading = true;
      await this.sharedService.deleteBlog(this.blog);
      this.loading = false;
      document.getElementById('close-btn')?.click();
      this.router.navigateByUrl('/blogs');
    }
  }

  toggleFab() {
    this.fabOpen = !this.fabOpen;
  }

  updateCover(cover: string) {
    console.log(cover);
  }
}
