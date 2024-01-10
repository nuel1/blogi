import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { doc, deleteDoc } from 'firebase/firestore';
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
    } catch (e: any) {
      this.toastrService.error(e.message);
      console.log(e);
    }
  }

  public async getBlogs() {
    let result: any[] | undefined;
    try {
      const resp = await this.afs.collection('blogs').get().toPromise();
      result = resp?.docs;
    } catch (e) {
      console.log(e);
    }
    return result ? result.map((doc) => ({ id: doc.id, ...doc.data() })) : [];
  }

  public async getBlog(blogID: string) {
    let result: any | undefined;

    try {
      const docRef = this.afs.collection('blogs').doc(blogID);
      const doc = await docRef.get().toPromise();
      if (!doc?.exists) throw new Error('Document not found');

      result = { id: doc.id, ...(doc.data() as any) };
    } catch (e: any) {
      this.toastrService.error(e.message);
      console.error(e);
    }
    return result;
  }

  public async addBlog(blog: Blog) {
    try {
      blog.time = new Date().getTime();
      await this.afs.collection('blogs').add(blog);

      this.toastrService.success(
        "Congrats! You've just created a new blog!🚀✨"
      );
    } catch (e) {
      this.toastrService.error('An unknown error occured');
      console.error(e);
    }
  }

  public async editBlog(blog: Blog) {
    try {
      const docRef = this.afs.collection('blogs').doc(blog.id);

      await docRef.update(blog);

      this.toastrService.success('Blog updated successfully! 🚀✨');
    } catch (e) {
      this.toastrService.error('An error occurred while updating the blog');
      console.error('Error updating document:', e);
    }
  }

  public async deleteBlog(blog: Blog) {
    try {
      await this.afs.doc('blogs/' + blog.id).delete();
      this.toastrService.success('Blog successfully deleted');
    } catch (e) {
      this.toastrService.error('An unknown error occured');
      console.error(e);
    }
  }
}
