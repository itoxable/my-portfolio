/**
 * Created by ruic on 15/02/2017.
 */

import {Component} from '@angular/core';
import {DataTableModel} from "../data-table/data-table.component";
import {AngularFire, FirebaseListObservable} from "angularfire2";
import Reference = firebase.storage.Reference;
import {FileWrapperModel, FileModel} from "../../models/file-wrapper.model";
import {FileUploadService} from "../../services/file-upload.service";

@Component({
    selector: 'mp-edit-portfolio',
    moduleId: module.id,
    templateUrl: 'edit-portfolio.component.html'
})

export class EditPortfolioComponent {
    dataTable: DataTableModel;
    portfolioFirebaseListObservable: FirebaseListObservable<any>;
    storageRef: Reference;
    files:Array<FileWrapperModel> = [];


    constructor(private angularFire: AngularFire, private fileUploadService:FileUploadService) {
    }

    removeFile(index:number){
        this.files.splice(index, 1);
    }

    setFile(fileWrapperArray:Array<FileWrapperModel>){
        fileWrapperArray.forEach((fileWrapper:FileWrapperModel, index) => {
            fileWrapper.isLoading = true;
            let fileModel:FileModel = fileWrapper.files[0];
            fileWrapper.data.name = fileModel.title;

            let reader = new FileReader();
            reader.addEventListener("load", (event:ProgressEvent) => {
                var dataUri = (<FileReader>event.target).result;
                fileModel.canvas = <HTMLCanvasElement>document.getElementsByClassName("uploaded-file-image-canvas-"+index)[0];
                let context = fileModel.canvas.getContext("2d");
                let img = new Image();
                img.onload = (ev) => {
                    console.log(ev);
                    context.drawImage(img, 0, 0, fileModel.canvas.getClientRects()[0].width, fileModel.canvas.getClientRects()[0].height);
                };
                img.src = dataUri;
                fileModel.previewURL = reader.result;
                fileWrapper.isLoading = false;
            }, false);
            reader.readAsDataURL(fileModel.file);

            this.files.unshift(fileWrapper);
        })
    }

    uploadAllFile() {
        this.files.forEach((fileWrapper:FileWrapperModel, index) => {
            this.saveFile(fileWrapper);
            // this.fileUploadService.uploadFile("", fileWrapper).map(res => res.json()).subscribe(res => {
            //         if(!res){
            //             fileWrapper.uploadStatus.error = true;
            //         }
            //     }, err => {
            //         console.error(err);
            //         fileWrapper.uploadStatus.error = true;
            //     }, () => {
            //         fileWrapper.abortEventEmitter.unsubscribe();
            //     }
            // );
        })

    }

    cancelUpload(fileWrapper:FileWrapperModel){
        this.fileUploadService.abort(fileWrapper);
    }

    saveFile(fileWrapper:FileWrapperModel){
        this.fileUploadService.uploadFile("", fileWrapper).map(res => res.json()).subscribe(res => {
                if(!res){
                    fileWrapper.uploadStatus.error = true;
                }
            }, err => {
                console.error(err);
                fileWrapper.uploadStatus.error = true;
            }, () => {
                fileWrapper.abortEventEmitter.unsubscribe();
            }
        );
    }

    cancelAllUploads(){
        this.files.forEach((fileWrapper:FileWrapperModel) => {
            this.cancelUpload(fileWrapper);
        });
    }


}