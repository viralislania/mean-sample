import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss']
})
export class PostEditComponent implements OnInit {
  title = 'Post Edit';
  postId: string;
  post: Post;
  form: FormGroup;
  imagePreview: string | ArrayBuffer;

  isloading = false;
  constructor(public postsService: PostsService, public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, { validators: [Validators.required] })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.postId = paramMap.get('postId');
        this.isloading = true;
        this.postsService.getPost(this.postId)
          .subscribe((responseData) => {
            this.isloading = false;
            this.post = {
              id: responseData.post._id, title: responseData.post.title,
              content: responseData.post.content, imagePath: responseData.post.imagePath
            };
            this.imagePreview = this.post.imagePath;
            this.form.setValue({
              title: this.post.title,
              content: this.post.content,
              image: this.post.imagePath
            });
          });
      }
    });

  }

  onEditPost(): void {
    if (this.form.invalid) return;
    this.postsService.editPost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
  }

  onImagePicked(event: Event): void {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imagePreview = reader.result;
    };

  }
}
