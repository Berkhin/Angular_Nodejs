import {Component, EventEmitter, Output} from "@angular/core";
import {Post} from "../post.model";
import {NgForm} from "@angular/forms";
import {PostService} from "../post.service";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  constructor(public postsSeervice: PostService) {
  }

  onAddPost(myForm: NgForm){
    if (myForm.invalid) return
   this.postsSeervice.setPost(myForm.value.title, myForm.value.content)
    myForm.resetForm()
  }
}
