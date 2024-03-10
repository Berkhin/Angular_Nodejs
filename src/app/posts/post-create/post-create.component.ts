import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {Post} from "../post.model";
import {FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {PostService} from "../post.service";
import {ActivatedRoute} from "@angular/router";
import { mimeType } from "./mime-type.validator";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  constructor(public postsSeervice: PostService, public routes: ActivatedRoute) {}
  private mode: string = 'create';
  private postId: string;
  isLoading = false;
  post: Post;
  form: FormGroup;
  imagePreview: string | ArrayBuffer;


  ngOnInit(){
    this.form = new FormGroup({
      'title': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      'content': new FormControl(null, {validators: [Validators.required]}),
      'image': new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]}),
    })
    this.routes.paramMap.subscribe((route)=>{
        if(route.has('postId')){
            this.mode = 'edit'
          this.postId = route.get('postId');
            this.isLoading = true;
            this.postsSeervice.getPost(this.postId).subscribe((postData)=>{
              this.form.setValue({title: postData.title, content: postData.content})
              this.isLoading = false;
                  this.post = {id: postData._id, title: postData.title, content: postData.content}
            })
        }else{
          this.mode = 'create'
          this.postId = null;
        }
    })
  }

  onFilePicked(event: Event){
    console.log(event)
    const file = (event.target as HTMLInputElement).files[0]
    this.form.patchValue({image: file})
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result
    }
    reader.readAsDataURL(file)
  }


  onSaveMode(){
    if (this.form.invalid) return
    this.isLoading = true
    if(this.mode == 'create'){
      this.postsSeervice.setPost(this.form.value.title, this.form.value.content)
    }else{
      this.postsSeervice.updatePost(this.postId, this.form.value.title, this.form.value.content)
    }
    this.form.reset()
  }

  protected readonly unescape = unescape;
}
