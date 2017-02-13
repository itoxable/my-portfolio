/**
 * Created by ruic on 11/02/2017.
 */


import {Component} from '@angular/core';
import {DataRequestModel} from "../../models/data-request.model";
import {DataTableModel} from "../data-table/data-table.component";

@Component({
    selector: 'mp-home',
    moduleId: module.id,
    templateUrl: 'home.component.html'
})

export class HomeComponent{
    dataTable:DataTableModel;

    constructor(){
        this.init();
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
            noDataMessageStyleClass: "error-message",
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
