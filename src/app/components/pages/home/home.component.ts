/**
 * Created by ruic on 11/02/2017.
 */


import {Component} from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {DataTableModel} from "../../data-table/data-table.component";
import {DataRequestModel} from "../../../models/data-request.model";
import {ApplicationService} from "../../../services/application.service";
import {ImageModel} from "../../../models/models";
import Reference = firebase.storage.Reference;


@Component({
    selector: 'mp-home',
    moduleId: module.id,
    templateUrl: 'home.component.html'
})

export class HomeComponent{
    dataTable:DataTableModel;
    portfolioFirebaseListObservable:FirebaseListObservable<any>;
    storageRef:Reference;
    x:any = {};
    images:Array<ImageModel> = [];

    constructor(private angularFire:AngularFire, private applicationService:ApplicationService) {

        this.applicationService.imagesFirebaseListObservable.subscribe((data:ImageModel[]) => {
            this.images = data.filter((image:ImageModel) => {
                return image.featured;
            });
            this.images['']
        });
    }


    init(){
        let data:Array<any> = [];

        for(let i = 1; i < 22 ; i++){
            data.push({
                url: '/images/'+i+'.JPG',
                name: 'something'+i
            })
        }
        console.log(data);
        this.dataTable = new DataTableModel({
            data: 'ruiCunha/portfolio',
            noDataMessageStyleClass: "error-message",
            firebaseListObservable: this.portfolioFirebaseListObservable,
            liveScroll: true,
            //isFirebase: true,
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
