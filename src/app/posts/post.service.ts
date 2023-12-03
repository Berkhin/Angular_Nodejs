import {Post} from "./post.model";
import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private onSetPost = new Subject<Post[]>();

  constructor(private http: HttpClient) {
  }

  getPosts(){
    this.http.get<{ message: string, posts: Post[] }>('http://localhost:3000/api/posts').subscribe(res => {
      console.log(res)
      this.posts = res.posts
      this.onSetPost.next([...this.posts])
    })
  }

  onSetPostsListener(){
    return this.onSetPost.asObservable();
  }

  setPost(title: string, content: string){
    const newPost =  {title, content}
    this.http.post<{message: string}>('http://localhost:3000/api/posts', newPost).subscribe((res) => {
      console.log(res.message)
      this.posts.push(newPost)
      this.onSetPost.next([...this.posts])
    } )

  }
}
