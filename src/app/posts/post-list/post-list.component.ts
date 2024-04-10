import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  postList: Post[] = [];
  private sub = new Subscription();
  isUserAuthenticated = false;
  authStatusSub: Subscription;
  isLoading = false;
  constructor(
    public postsService: PostService,
    private authService: AuthService,
  ) {}
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  pageIndex = 0;

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.sub = this.postsService
      .onSetPostsListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.postList = postData.posts;
      });

    this.isUserAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStateListener()
      .subscribe((isAuthenticated) => {
        console.log(isAuthenticated);
        this.isUserAuthenticated = isAuthenticated;
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onClickDelete(id: string) {
    this.isLoading = true;
    this.postsService.deletePost(id).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  onChangedPage(page: PageEvent) {
    this.pageIndex = page.pageIndex;
    this.isLoading = true;
    this.currentPage = page.pageIndex + 1;
    this.postsPerPage = page.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }
}
