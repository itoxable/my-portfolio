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
import { DataTablePaginationModel } from "../../data-table/data-table-pagination-control.component";


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
    dataTableModel: DataTableModel;
    selectedImage:ImageModel;

    constructor(private angularFire:AngularFire, private applicationService:ApplicationService) {

        this.applicationService.imagesFirebaseListObservable.subscribe((data:ImageModel[]) => {
            this.images = data.filter((image:ImageModel) => {
                return image.featured;
            });
            //this.images['']
        });

        this.dataTableModel = new DataTableModel({
            data: `/styles/lpis.json`,
            noDataMessageStyleClass: "error-message",
            dataArrayField: '_embedded.AddressProperty',
            totalItemsField: 'page.totalElements',
            errorMessage: 'Error searching!',
            columns: [
                // {
                //     field:'logicalStatus',
                //     displayName: 'Status',
                //     sortable:true,
                //     resizable: true,
                //     width: '80px',
                // },
                {
                    field: 'uprn',
                    displayName: 'UPRN',
                    sortable: true,
                    resizable: true,
                    width: '120px',
                },
                // {
                //     field:'saoStartNo',
                //     displayName: 'saoStartNo',
                //     resizable: true,
                //     sortable:true
                // },
                // {
                //     field:'saoEndNo',
                //     displayName: 'saoEndNo',
                //     resizable: true
                // },
                {
                    field:'authName',
                    displayName: 'Organization',
                    sortField: 'auth_name',
                    sortable:true,
                    width: '175px',
                    resizable: true
                }
            ],
            dataRequestModel: new DataRequestModel({
                pageSize: 10
            }),
            pagination: new DataTablePaginationModel({
                pageSizes: [20, 50, 75, 100],
                paginationNumbersSize: 5,
                legendTemplate: "Page {CURRENT_PAGE} of {CURRENT_NR_OF_PAGES}"
            }),
        });
    }

    onSlideChange(event){
        //console.log(event);
        this.selectedImage = this.images[event];
    }
    // init(){
    //     // let data:Array<any> = [];
    //     //
    //     // for(let i = 1; i < 22 ; i++){
    //     //     data.push({
    //     //         url: '/images/'+i+'.JPG',
    //     //         name: 'something'+i
    //     //     })
    //     // }
    //     // console.log(data);
    //     this.dataTable = new DataTableModel({
    //         data: 'ruiCunha/portfolio',
    //         noDataMessageStyleClass: "error-message",
    //         firebaseListObservable: this.portfolioFirebaseListObservable,
    //         liveScroll: true,
    //         //isFirebase: true,
    //         columns:[
    //             {
    //                 field:'Filename',
    //                 displayName: 'Filename',
    //                 sortable: true,
    //                 sortField: 'filename'
    //             },
    //             {
    //                 field:'Status',
    //                 displayName: 'Status'
    //             }
    //         ],
    //         dataRequestModel:new DataRequestModel({
    //             pageSize: 6
    //         })
    //     })
    // }
}
