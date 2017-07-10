/**
 * Created by ruic on 12/02/2017.
 */

import {Component, Input} from '@angular/core';
import {Http} from "@angular/http";
import App = firebase.app.App;
import {FirebaseListFactoryOpts, Query} from "angularfire2/interfaces";
import {DataTableModel} from "../../data-table/data-table.component";
import {ApplicationService} from "../../../services/application.service";
import {Category, ImageModel} from "../../../models/models";
import {DataRequestModel} from "../../../models/data-request.model";
import {FirebaseListObservable} from "angularfire2";

@Component({
    selector: 'mp-portfolio',
    moduleId: module.id,
    templateUrl: 'portfolio.component.html'
})

export class PortfolioComponent{
    dataTable:DataTableModel;
    categories:Array<any> = [];

    selectedCategory:string;

    category:string = '';


    images:Array<ImageModel> = [];
    isLoading:boolean;
    imagesFirebaseListObservable:FirebaseListObservable<any[]>;
    firebaseListFactoryOpts:FirebaseListFactoryOpts;

    constructor(private applicationService:ApplicationService, private http:Http){
        this.applicationService.categoriesFirebaseListObservable.subscribe((data:any[]) => {
            this.categories = data;
            this.selectCategory('');
        });

        this.init();
    }

    selectCategory(category:Category){
        this.selectedCategory = category.name;
        console.log('selectCategory');
    }

    init(){

        this.firebaseListFactoryOpts = {
            preserveSnapshot: false,
        }
        console.log(this.images);
        if(!this.images || this.images.length == 0){
            this.applicationService.imagesFirebaseListObservable.subscribe((data:ImageModel[]) => {
                console.log('imagesFirebaseListObservable');
                this.images = data;
            });
        }
    }
}