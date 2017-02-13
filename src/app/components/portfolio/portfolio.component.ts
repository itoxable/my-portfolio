/**
 * Created by ruic on 12/02/2017.
 */

import {Component} from '@angular/core';
import {DataTableComponent, DataTableModel} from "../data-table/data-table.component";
import {Http} from "@angular/http";
import {ApplicationService} from "../../services/application.service";
import {DataRequestModel} from "../../models/data-request.model";

@Component({
    selector: 'mp-portfolio',
    moduleId: module.id,
    templateUrl: 'portfolio.component.html'
})

export class PortfolioComponent{
    dataTable:DataTableModel;
    sections:Array<any> = [
        {
            name: "landscapes",
        },
        {
            name: "Portrait",
        },
        {
            name: "City",
        }
    ];
    selectedSection:string;
    constructor(){
        this.selectSection(this.sections[0]);
        this.init();
    }

    selectSection(section:any){
        this.selectedSection = section.name;
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