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

@Component({
    selector: 'mp-blog',
    moduleId: module.id,
    templateUrl: 'blog.component.html'
})

export class BlogComponent{

    isLoading:boolean;
    newBlog:Blog;
    blogs:Array<Blog> = [];

    constructor(private applicationService:ApplicationService){
        this.applicationService.blogFirebaseListObservable.subscribe((data:Array<Blog>) => {
            this.newBlog = null;
            console.log(data);
            this.blogs = data;
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