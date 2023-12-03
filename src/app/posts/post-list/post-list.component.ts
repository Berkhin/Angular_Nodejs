import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {Post} from "../post.model";
import {PostService} from "../post.service";
import {Subscription} from "rxjs";


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  postList: Post[] = []
  private sub = new Subscription();
  constructor(public postsService: PostService) {
  }

  ngOnInit(): void {
   this.postsService.getPosts();
    this.sub = this.postsService.onSetPostsListener().subscribe((posts: Post[])=>{
      this.postList = posts;
    })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

}
