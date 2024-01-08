import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogViewComponent } from './features/blog-view/blog-view.component';
import { BlogsComponent } from './features/blogs/blogs.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'blogs',
    pathMatch: 'full',
  },
  {
    path: 'blogs',
    component: BlogsComponent,
  },
  {
    path: 'blogs/:id',
    component: BlogViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
