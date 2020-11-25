import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PostsService {
    private posts: Post[] = [];
    private postsUpdateListener = new Subject<Post[]>();

    constructor(private http: HttpClient) { }
    url = environment.baseUrl + 'posts';

    getPostUpdateListener(): Observable<Post[]> {
        return this.postsUpdateListener.asObservable();
    }

    addPost(title: string, content: string, image: File): void {
        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);

        this.http.post<{ message: string, post: Post }>(this.url, postData)
            .subscribe(responseData => {
                const post: Post = { id: responseData.post.id, title, content, imagePath: responseData.post.imagePath };
                this.posts.push(post);
                this.postsUpdateListener.next([...this.posts]);
            });
    }

    getPosts(): void {
        this.http.get<{ message: string; posts: any }>(this.url)
            .pipe(map((postsData) => {
                return postsData.posts.map(post => {
                    return {
                        title: post.title,
                        content: post.content,
                        id: post._id,
                        imagePath: post.imagePath
                    };
                });
            })).subscribe(transformedData => {
                this.posts = transformedData;
                this.postsUpdateListener.next([...this.posts]);
            });
    }

    deletePost(postId: string): void {
        this.http.delete(`${this.url}/${postId}`)
            .subscribe(() => {
                const updatedPosts = this.posts.filter(p => postId !== p.id);
                this.posts = updatedPosts;
                this.postsUpdateListener.next([...this.posts]);
            });
    }

    getPost(postId: string): Observable<any> {
        return this.http.get(`${this.url}/${postId}`);
    }

    editPost(postId: string, title: string, content: string, image: File | string): void {

        let postData: Post | FormData;
        if (typeof image === 'object') {
            postData = new FormData();
            postData.append('id', postId);
            postData.append('title', title);
            postData.append('content', content);
            postData.append('image', image, title);
        } else {
            postData = {
                id: postId,
                title,
                content,
                imagePath: image
            };
        }
        this.http.put(`${this.url}/${postId}`, postData)
            .subscribe((response) => {
                const uPosts = [...this.posts];
                const oldPostIdx = this.posts.findIndex(p => postId !== p.id);
                const post: Post = {
                    id: postId,
                    title,
                    content,
                    imagePath: ''
                };
                uPosts[oldPostIdx] = post;
                this.posts = uPosts;
                this.postsUpdateListener.next([...this.posts]);
            });
    }
}
