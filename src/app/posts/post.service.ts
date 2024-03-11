import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { map, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private onSetPost = new Subject<Post[]>();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map((posts) => {
          return posts.posts.map((post) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
            };
          });
        }),
      )
      .subscribe((transormedPosts) => {
        console.log(transormedPosts);
        this.posts = transormedPosts;
        this.onSetPost.next([...this.posts]);
      });
  }

  onSetPostsListener() {
    return this.onSetPost.asObservable();
  }

  getPost(postId: string) {
    return this.http.get<{ _id: string; title: string; content: string }>(
      'http://localhost:3000/api/posts/' + postId,
    );
  }

  updatePost(id: string, title: string, content: string, image: File) {
    const post: Post = { id, title, content };
    this.http
      .put('http://localhost:3000/api/posts/' + id, post)
      .subscribe((res) => {
        const updatedPost = [...this.posts];
        const oldIndexPost = updatedPost.findIndex((p) => p.id === post.id);
        updatedPost[oldIndexPost] = post;
        this.posts = updatedPost;
        this.onSetPost.next([...this.posts]);
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
        const post: Post = { id: res.post.id, title, content };
        this.posts.push(post);
        this.onSetPost.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(_id: string) {
    console.log('try to delete fron service ' + _id);
    this.http
      .delete<{ _id: string }>('http://localhost:3000/api/posts/' + _id)
      .subscribe(() => {
        const updatedPosts = this.posts.filter((post) => post.id !== _id);
        console.log(updatedPosts);
        this.posts = updatedPosts;
        this.onSetPost.next([...this.posts]);
      });
  }
}
