import { AuthService } from './../auth/auth.service';
import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { map, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private onSetPost = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const pageQuery = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        'http://localhost:3000/api/posts' + pageQuery,
      )
      .pipe(
        map((posts) => {
          return {
            posts: posts.posts.map((post) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
              };
            }),
            maxPosts: posts.maxPosts,
          };
        }),
      )
      .subscribe((transformedPostsData) => {
        this.posts = transformedPostsData.posts;
        this.onSetPost.next({
          posts: [...this.posts],
          postCount: transformedPostsData.maxPosts,
        });
      });
  }

  onSetPostsListener() {
    return this.onSetPost.asObservable();
  }

  getPost(postId: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>('http://localhost:3000/api/posts/' + postId);
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id,
        title,
        content,
        imagePath: image,
        creator: null,
      };
    }
    this.http
      .put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe((res) => {
        const updatedPost = [...this.posts];
        const oldIndexPost = updatedPost.findIndex((p) => p.id === id);
        this.router.navigate(['/']);
      });
  }

  setPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http
      .post<{
        message: string;
        post: Post;
      }>('http://localhost:3000/api/posts', postData)
      .subscribe((res) => {
        this.router.navigate(['/']);
      });
  }

  deletePost(_id: string) {
    return this.http.delete<{ _id: string }>(
      'http://localhost:3000/api/posts/' + _id,
    );
  }
}
