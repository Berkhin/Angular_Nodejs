import {NgModule} from "@angular/core";
import {PostListComponent} from "../posts/post-list/post-list.component";
import {PostCreateComponent} from "../posts/post-create/post-create.component";
import {RouterModule} from "@angular/router";

const routes = [
  {path: '', component: PostListComponent},
  {path: 'create', component: PostCreateComponent},
  {path: 'edit/:postId', component: PostCreateComponent},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]

})
export class AppRoutingModule{}