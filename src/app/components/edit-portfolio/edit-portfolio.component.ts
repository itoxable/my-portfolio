/**
 * Created by ruic on 15/02/2017.
 */

import {Component} from '@angular/core';
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {FileWrapperModel, FileModel} from "../../models/file-wrapper.model";
import {FileUploadService} from "../../services/file-upload.service";
import UploadTaskSnapshot = firebase.storage.UploadTaskSnapshot;
import Reference = firebase.storage.Reference;
import {ApplicationService} from "../../services/application.service";
import {Image, Category} from "../../models/models";


@Component({
    selector: 'mp-edit-portfolio',
    moduleId: module.id,
    templateUrl: 'edit-portfolio.component.html'
})

export class EditPortfolioComponent {

    files:Array<FileWrapperModel> = [];
    images:Array<Image> = [];
    selectedImage:Image;
    categories:Array<Category> = [];
    newCategory:string = '';
    isAddingCategory:boolean;
    text:string = 'qwerty';

    constructor(private applicationService:ApplicationService, private fileUploadService:FileUploadService) {
        this.applicationService.imagesFirebaseListObservable.subscribe((data:any[]) => {
            this.images = data;
        });

        this.applicationService.categoriesFirebaseListObservable.subscribe((data:any[]) => {
            this.categories = data;
        });
    }

    addNewCategory(){
        this.isAddingCategory = true;
        this.newCategory = '';
    }

    saveCategory(){
        if(this.newCategory){
            this.applicationService.categoriesFirebaseListObservable.push({
                cdate: new Date(),
                name: this.newCategory,
            });
        }
    }

    deleteCategory(category:Category){
        this.applicationService.categoriesFirebaseListObservable.remove(category.$key)
    }

    edit(image:Image){
        this.selectedImage = image;
        console.log(image);
    }

    delete(image:Image){
        this.fileUploadService.deleteFile(image.url).subscribe(data => {
            console.log(data);
            this.applicationService.imagesFirebaseListObservable.remove(image.$key)
        }, (err:Error) =>{
            if(err['code'] == "storage/object-not-found"){
                this.applicationService.imagesFirebaseListObservable.remove(image.$key)
            }
            console.warn(err);
        })
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
        })

    }

    cancelUpload(fileWrapper:FileWrapperModel){
        this.fileUploadService.abort(fileWrapper);
    }

    pauseUpload(fileWrapper:FileWrapperModel){
        this.fileUploadService.pause(fileWrapper)
    }

    resumeUpload(fileWrapper:FileWrapperModel){
        this.fileUploadService.resume(fileWrapper);
    }

    getPhotoMetadata(fileWrapper:FileWrapperModel){
        console.log(fileWrapper.files[0].file['exifdata']);
    }
    saveImage(selectedImage:Image){
        let mdate:Date = new Date();
        let image:Image = {
            mdate: mdate.toString(),
            description: selectedImage.description,
            name: selectedImage.name,
            categories: selectedImage.categories,
            featured: selectedImage.featured,
            url : selectedImage.url
        };
        this.applicationService.imagesFirebaseListObservable.update(selectedImage.$key, image);
    }
    saveFile(fileWrapper:FileWrapperModel){
        fileWrapper.uploadComplete = false;
        this.fileUploadService.uploadFile(fileWrapper).subscribe((snapshot:UploadTaskSnapshot) => {
            let cdate:Date = new Date();
            console.log(fileWrapper.data.categories);
            this.getPhotoMetadata(fileWrapper);

            let image:Image = {
                cdate: cdate.toString(),
                mdate: cdate.toString(),
                description: fileWrapper.data.description?fileWrapper.data.description:'',
                name: fileWrapper.data.name,
                categories: fileWrapper.data.categories?fileWrapper.data.categories:[],
                featured: fileWrapper.data.featured?fileWrapper.data.featured:false,
                url : snapshot.downloadURL
            };

            this.applicationService.imagesFirebaseListObservable.push(image);

        });
    }

    cancelAllUploads(){
        this.files.forEach((fileWrapper:FileWrapperModel) => {
            this.cancelUpload(fileWrapper);
        });
    }


}