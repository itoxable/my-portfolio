/**
 * Created by ruic on 18/02/2017.
 */



import {Component} from '@angular/core';
import {DataRequestModel} from "../../models/data-request.model";
import {DataTableModel} from "../data-table/data-table.component";
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {FirebaseListFactoryOpts, Query} from "angularfire2/interfaces";
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
        this.blogTitle = this.route.snapshot.params['blogTitle'];
        console.log("1 - "+this.blogTitle );
        this.applicationService.blogFirebaseListObservable.subscribe((data:Array<Blog>) => {
            this.newBlog = null;
            this.blogs = data;

            console.log("2 - "+this.blogTitle );
            if(this.blogTitle){
                console.log("3 - "+this.blogTitle );
                this.selectedBlog = this.blogs.filter((blog:Blog)=>{
                    return blog.title.toLowerCase() == this.blogTitle.toLowerCase();
                })[0];
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