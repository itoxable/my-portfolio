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
import {ImageModel, Category, Settings} from "../../models/models";


@Component({
    selector: 'mp-edit-portfolio',
    moduleId: module.id,
    templateUrl: 'edit-portfolio.component.html'
})

export class EditPortfolioComponent {

    files:Array<FileWrapperModel> = [];
    images:Array<ImageModel> = [];
    selectedImage:ImageModel;
    categories:Array<Category> = [];
    newCategory:string = '';
    isAddingCategory:boolean;
    text:string = 'qwerty';
    settings:Settings = {};
    selectedSetting:string = 'portfolio';
    canvasContext:CanvasRenderingContext2D;
    canvas:HTMLCanvasElement;
    image:HTMLImageElement;


    constructor(private applicationService:ApplicationService, private fileUploadService:FileUploadService) {
        this.applicationService.imagesFirebaseListObservable.subscribe((data:any[]) => {
            this.images = data;
        }, err => {
            console.warn(err)
        });

        this.applicationService.categoriesFirebaseListObservable.subscribe((data:any[]) => {
            this.categories = data;
        });

        this.applicationService.settingsFirebaseListObservable.subscribe((data:any[]) => {
            // console.log(data);
            if(data && data.length > 0) {
                this.settings = data[0];
            }
            this.initSettings();
        });
    }

    initSettings(){
        if(!this.settings.social){
            this.settings.social = {}
        }
    }

    selectSetting(setting:string){
        this.selectedSetting = setting;
    }

    saveSocialSettings(socialForm){
        if(this.settings.$key){
            let key:string = this.settings.$key;
            delete this.settings['$exists'];
            delete this.settings['$key'];
            this.applicationService.settingsFirebaseListObservable.update(key, this.settings);
        }else{
            this.applicationService.settingsFirebaseListObservable.push(this.settings);
        }
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

    edit(image:ImageModel){
        this.selectedImage = image;
        console.log(image);
    }

    delete(image:ImageModel){
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

    canvasRotate(degrees:number){

        console.log('this.canvas.width: '+this.canvas.width);
        console.log('this.canvas.height: '+this.canvas.height);

        console.log('this.image.width: '+this.image.width);
        console.log('this.image.height: '+this.image.height);

        // this.canvasContext.rotate(degrees * Math.PI / 180);
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvasContext.save();
        this.canvasContext.translate(this.canvas.width/2,this.canvas.height/2);
        //
        this.canvasContext.drawImage(this.image, 0, 0, - this.canvas.width/2, -this.canvas.width/2);
        this.canvasContext.restore();

        //    drawImage(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, offsetX: number, offsetY: number, width?: number, height?: number, canvasOffsetX?: number, canvasOffsetY?: number, canvasImageWidth?: number, canvasImageHeight?: number): void;

    }


    setFile(fileWrapperArray:Array<FileWrapperModel>){
        // this.canvasContext = null;
        // this.image = null;
        console.log('setFile');
        fileWrapperArray.forEach((fileWrapper:FileWrapperModel, index) => {
            fileWrapper.isLoading = true;
            let fileModel:FileModel = fileWrapper.files[0];
            fileWrapper.data.name = fileModel.title;

            let reader = new FileReader();
            reader.addEventListener("load", ((event:ProgressEvent) => {
                var dataUri = (<FileReader>event.target).result;
                //this.canvas.
                if(!this.canvas){
                    this.canvas = <HTMLCanvasElement>document.getElementsByClassName("uploaded-file-image-canvas-"+index)[0];
                    this.canvasContext = this.canvas.getContext("2d");
                }else{
                    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.canvasContext.save();
                }

                this.image = new Image();
                this.image.src = dataUri;
                this.image.onload = (ev) => {

                    console.log(this.canvas);
                    console.log(this.canvas.getClientRects());

                    this.canvasContext.drawImage(this.image, 0, 0, this.canvas.getClientRects()[0].width, this.canvas.getClientRects()[0].height);
                };
                // console.log(fileModel.canvas);
                // this.canvas = fileModel.canvas;

                // fileModel.previewURL = reader.result;
                fileWrapper.isLoading = false;

            }).bind(this), false);
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

    saveImage(selectedImage:ImageModel){
        let mdate:Date = new Date();
        let image:ImageModel = {
            mdate: mdate.toString(),
            description: selectedImage.description,
            name: selectedImage.name,
            categories: selectedImage.categories?selectedImage.categories:[],
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

            let image:ImageModel = {
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