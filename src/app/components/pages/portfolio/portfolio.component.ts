/**
 * Created by ruic on 12/02/2017.
 */

import {Component} from '@angular/core';
import {Http} from "@angular/http";
import App = firebase.app.App;
import {Query} from "angularfire2/interfaces";
import {DataTableModel} from "../../data-table/data-table.component";
import {ApplicationService} from "../../../services/application.service";
import {Category} from "../../../models/models";
import {DataRequestModel} from "../../../models/data-request.model";

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

    constructor(private applicationService:ApplicationService, private http:Http){
        this.applicationService.categoriesFirebaseListObservable.subscribe((data:any[]) => {
            this.categories = data;
            this.selectCategory('');
        });
    }

    selectCategory(category:Category){
        this.selectedCategory = category.name;
        console.log('selectCategory');
    }

    init(){
        let data:Array<any> = [];

        for(let i = 1; i < 22 ; i++){
            data.push({
                url: '/images/'+i+'.JPG'
            })
        }

        this.dataTable = new DataTableModel({
            data: data,
            liveScroll: true,
            columns:[
                {
                    field:'Filename',
                    displayName: 'Filename',
                    sortable: true,
                    sortField: 'filename'
                },
                {
                    field:'Status',
                    displayName: 'Status'
                }
            ],
            dataRequestModel:new DataRequestModel({
                pageSize: 6
            })
        })
    }
}