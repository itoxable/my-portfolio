/**
 * Created by ruic on 03/03/2016.
 */


import {Component,Input, Output, EventEmitter, OnInit, AfterViewInit, OnDestroy, ViewContainerRef} from '@angular/core';
import {FileWrapperModel, FileModel} from "../../models/file-wrapper.model";
import * as exif from 'exif';

@Component({
    selector:'mp-file-upload',
    moduleId: module.id,
    templateUrl: 'file-upload.component.html',
})
export class FileUploadComponent implements OnInit, AfterViewInit, OnDestroy{

    @Input() styleClass:string;

    @Input() buttonText:string;

    @Input() noFileLabel:string;

    @Input() multiple:boolean = false;

    @Input() showPreview:boolean = false;

    @Input() native:boolean = false;

    @Input() acceptDuplicatedFiles:boolean = false;

    @Input() showErrorMessages:boolean = true;

    @Input() processFilesIndividually:boolean = true;

    @Input() showFileName:boolean = true;

    @Input() file:FileModel;

    @Input() fileWrapper:FileWrapperModel = new FileWrapperModel();

    @Input() fileWrapperArray:Array<FileWrapperModel> = [];

    @Input() previewDefaultImage:string = "/images/icons/file-types.svg";

    @Input() accept:string = "*";

    @Input() dragAndDrop:boolean;

    @Input() dropElementSelector:string;

    dropElement:Element;

    fileLabel:string = '';

    dragAndDropTopMask:HTMLElement;

    files:FileList;

    inputElement:HTMLInputElement;

    errorMessages:Array<string> = [];

    dataTransfer:DataTransfer;

    @Output() fileSelected:EventEmitter<FileWrapperModel | Array<FileWrapperModel>> = new EventEmitter<FileWrapperModel | Array<FileWrapperModel>>();

    @Input()config:any = {};

    constructor(private viewContainerRef: ViewContainerRef){
    }
    
    preventDefault(event){
        event.preventDefault();
        event.stopPropagation();
    }

    onDrop(event:DragEvent){
        this.dragDropCommon(event, false);
        this.files = event.dataTransfer.files;
        this.processFileList();
    }

    onDragOver(event:DragEvent){
        this.preventDefault(event);
    }

    onDragLeave(event:DragEvent){
        this.dragDropCommon(event, false);
    }

    onDragEnter(event:DragEvent){
        this.dragDropCommon(event, true);
    }

    dragDropVisual(isDragging:boolean){
        if(isDragging){
            if(!this.dropElement.classList.contains('file-upload-is-dragging')){
                this.dropElement.classList.add('file-upload-is-dragging');
                this.dragAndDropTopMask = document.createElement("div");
                this.dragAndDropTopMask.classList.add('file-upload-is-dragging-mask');
                this.dropElement.appendChild(this.dragAndDropTopMask);

                this.dragAndDropTopMask.addEventListener("dragleave", this.onDragLeave.bind(this));
                this.dragAndDropTopMask.addEventListener("dragover", this.onDragOver.bind(this));
                this.dragAndDropTopMask.addEventListener("drop", this.onDrop.bind(this));
            }
        }else{
            this.dropElement.classList.remove('file-upload-is-dragging');
            if(this.dragAndDropTopMask){
                this.dragAndDropTopMask.removeEventListener("dragleave", this.onDragLeave);
                this.dragAndDropTopMask.removeEventListener("dragover", this.onDragOver);
                this.dragAndDropTopMask.removeEventListener("drop", this.onDrop);
                this.dropElement.removeChild(this.dragAndDropTopMask);
            }
        }
    }

    dragDropCommon(event:DragEvent, isDragging:boolean){
        this.preventDefault(event);
        this.dragDropVisual(isDragging);
    }

    chooseFile(event){
        this.inputElement = event.currentTarget.children[0];
        this.inputElement.click();
    }
    removeFile(index:number, event?:MouseEvent){
        //TODO:Check this
    }

    isDuplicate(file:File):boolean{
        if(this.processFilesIndividually){
            for (let i = 0; i < this.fileWrapper.files.length; i++) {
                let fl:File = this.fileWrapper.files[i].file;
                if(file.name == fl.name && file.size == fl.size){
                    return true;
                }
            }
        }else{
            for (let j = 0; j < this.fileWrapperArray.length; j++) {
                for (let i = 0; i < this.fileWrapperArray[j].files.length; i++) {
                    let fl:File = this.fileWrapperArray[j].files[i].file;
                    if (file.name == fl.name && file.size == fl.size) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    processFileList(){
        this.fileLabel = '';
        this.errorMessages = [];
        this.fileWrapperArray = [];
        for (let i = 0; i < this.files.length; i++) {
            var file = this.files[i];
            if(this.multiple && !this.acceptDuplicatedFiles && this.isDuplicate(file)){
                let message:string = `File '${file.name}' already in the list`;
                console.warn(message);
                this.errorMessages.push(message);
                continue;
            }
            let fileModel:FileModel;
            if(file.type.indexOf("image/") > -1){
                let previewURL = URL.createObjectURL(file);
                let metadata:any;
                fileModel = new FileModel(file, {
                    previewURL: previewURL
                });
                exif.getData(file, function(){});

            }else{
                fileModel = new FileModel(file, {previewURL: this.previewDefaultImage});
            }

            if(this.processFilesIndividually){
                let fileWrapperModel:FileWrapperModel = new FileWrapperModel();
                fileWrapperModel.files.push(fileModel);
                fileWrapperModel.setFileSize();
                this.fileWrapperArray.push(fileWrapperModel);
            }else{
                this.fileWrapper.files.push(fileModel);
            }
        }

        if(this.processFilesIndividually){
            this.fileSelected.emit(this.fileWrapperArray);
        }else{
            this.fileWrapper.setFileSize();
            this.fileLabel = this.getFileLabel(this.fileWrapper);
            this.fileSelected.emit(this.fileWrapper);
        }
        if(!this.native && this.inputElement){
            this.inputElement.value = '';
        }

    }

    changeDetect(event){
        this.files = event.target.files;
        this.processFileList();

    }

    getFileLabel(fileWrapper:FileWrapperModel):string{
        if(fileWrapper.files.length > 1){
            let name:Array<string> = []
            fileWrapper.files.forEach((file:FileModel, index:number) => {
                name.push(file.title);
            });

            return name.join(", ");

        }else if(fileWrapper.files.length === 1){
            return fileWrapper.files[0].file.name;
        }
        return this.noFileLabel;
    }

    ngOnInit(){
        Object.assign(this, this.config);
    }

    initDragDrop(){
        if(this.dropElementSelector){
            this.dropElement = document.querySelector(this.dropElementSelector);
        }else{
            this.dropElement = this.viewContainerRef.element.nativeElement.querySelector('.gp-file-upload');
        }

        window.addEventListener("dragover",function(e){
            e.preventDefault();
        },false);
        window.addEventListener("drop",function(e){
            e.preventDefault();
        },false);

        this.dropElement.addEventListener("dragenter", this.onDragEnter.bind(this));
    }
    ngAfterViewInit(){

        if(this.dragAndDrop){
            this.initDragDrop();
        }

    }
    ngOnDestroy(){
        if(this.dropElement){
            this.dropElement.removeEventListener("dragenter", this.onDragEnter);
        }
    }


}