import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
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
    path: 'blog/:id',
    component: BlogViewComponent,
  },
];

const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'top',
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
