import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Injectable, inject } from '@angular/core';
import { Blog } from '../model/blog';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';

@Injectable()
export class SharedService {
  private http = inject(HttpClient);
  private afs = inject(AngularFirestore);
  toastrService = inject(ToastrService);

  constructor() {
    window.addEventListener('online', () => {
      this.toastrService.success('Your internet is restored');
    });

    window.addEventListener('offline', () => {
      this.toastrService.error('You are offline');
    });
  }

  imageURL = '';
  // constructor(private afs: A) {}

  public async uploadFile(file: File) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', environment.cloudinary.upload_preset);

      const { url } = (await this.http
        .post(environment.cloudinary.url, formData)
        .toPromise()) as {
        url: string;
      };

      this.imageURL = url;
    } catch (e) {
      console.log(e);
    }
  }

  public async getBlogs() {
    let result: any[] | undefined;
    try {
      const resp = await this.afs.collection('/blogs').get().toPromise();
      result = resp?.docs;
    } catch (e) {
      console.log(e);
    }

    return result ? result.map((doc) => doc.data()) : [];
  }

  public async addBlog(blog: Blog) {
    try {
      blog.id = this.afs.createId();
      blog.time = new Date().getTime();

      await this.afs.collection('blogs').add(blog);

      this.toastrService.success(
        "Congrats! You've just created a new blog!🚀✨"
      );
    } catch (e) {
      console.log(e);
    }
  }

  public async editBlog(blog: Blog) {
    await this.deleteBlog(blog);
    await this.addBlog(blog);
  }

  public async deleteBlog(blog: Blog) {
    try {
      await this.afs.collection('blogs').doc(blog.id).delete();
      this.toastrService.success('Blog successfully deleted');
    } catch (e) {}
  }
}
