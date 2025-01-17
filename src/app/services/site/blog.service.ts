import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private baseBlog='https://sonicadminbackend.vercel.app/api'

  constructor(private http: HttpClient) { }

  getBlogs(category?:string):Observable<any>{
    let params=new HttpParams();
    if(category){
      params=params.set('category',category)
    }
    return this.http.get(`${this.baseBlog}/getblog`,{params})
  } 

  postBlog(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseBlog}/postblog`, formData); 
  }

  putBlog(formData: FormData, blogId: string): Observable<any> {
    return this.http.put(`${this.baseBlog}/updateblog/${blogId}`, formData);
  }

  deleteBlog(blogId: string): Observable<any> {
    return this.http.delete(`${this.baseBlog}/deleteblog/${blogId}`);
  }
} 
