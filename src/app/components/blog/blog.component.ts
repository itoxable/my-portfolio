/**
 * Created by ruic on 18/02/2017.
 */



import {Component} from '@angular/core';
import Reference = firebase.storage.Reference;
import {NgForm} from "@angular/forms";
import {ApplicationService} from "../../services/application.service";
import {Blog} from "../../models/models";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'mp-blog',
    moduleId: module.id,
    templateUrl: 'blog.component.html'
})

export class BlogComponent{

    isLoading:boolean;
    newBlog:Blog;
    blogs:Array<Blog> = [];
    blogTitle:string;
    selectedBlog:Blog = {};


    constructor(private applicationService:ApplicationService, private route: ActivatedRoute){
        this.isLoading = true;
        this.blogTitle = this.route.snapshot.params['blogTitle'];
        this.applicationService.blogFirebaseListObservable.subscribe((data:Array<Blog>) => {
            this.newBlog = null;
            this.blogs = data;
            if(this.blogTitle){
                setTimeout((()=>{
                    let blogs:Array<Blog> = this.blogs.filter((blog:Blog)=>{
                        return blog.title.toLowerCase() == this.blogTitle.toLowerCase();
                    });
                    if(blogs && blogs.length > 0){
                        this.selectedBlog = blogs[0];
                    }
                    this.isLoading = false;
                }), 500);

            }else{
                this.isLoading = false;
            }
        })
    }

    addNewEntry(){
        this.newBlog = {}
    }

    saveNewBlog(newBlogForm:NgForm){
        let cdate:Date = new Date();
        this.newBlog.cdate = cdate.toString();
        this.newBlog.mdate = cdate.toString();

        this.applicationService.blogFirebaseListObservable.push(this.newBlog);
    }
}