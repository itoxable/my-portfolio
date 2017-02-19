/**
 * Created by ruic on 03/03/2016.
 */

import { EventEmitter } from '@angular/core';
import { Response, ResponseOptions, Headers, ResponseType } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Subscriber } from "rxjs/Subscriber";
import * as firebase from 'firebase';
import UploadTask = firebase.storage.UploadTask;
import TaskEvent = firebase.storage.TaskEvent;


export class FileModel{
    metadata:any;
    canvas:HTMLCanvasElement;
    canvasContext:CanvasRenderingContext2D;
    title:string;
    optional:boolean;
    file:File;
    size:number;
    previewURL:string;

    constructor(file:File, data?:any){
        this.file = file;
        if(file){
            if(!('title' in data)){
                data.title = this.file.name
            }
            if(!('size' in data)){
                data.size = this.file.size;
            }
        }
        Object.assign(this, data);
    }
}

export class FileWrapperModel{

    isLoading:boolean;
    id:number;
    fileSize:number = 0;
    files:Array<FileModel> = [];
    data:any = {};
    uploadStatus:UploadStatus;
    xmlHttpRequest:XMLHttpRequest;
    uploadComplete:boolean;
    private uploadEventEmitter:EventEmitter<UploadEvent> = new EventEmitter<UploadEvent>();
    
    abortEventEmitter:EventEmitter<UploadEvent> = new EventEmitter<UploadEvent>();

    uploadCompleteObservable:Observable<any>;
    uploadCompleteSubscriber:Subscriber<any>;

    onEndEventEmitter:EventEmitter<any> = new EventEmitter<any>();

    private abortListener:(ev: Event) => void;
    private errorListener:(ev: Event) => void;
    private loadListener:(ev: Event) => void;
    private loadStartListener:(ev: Event) => void;
    private loadEndListener:(ev: Event) => void;
    private progressListener:(ev: Event) => void;
    private timeOutListener:(ev: Event) => void;

    uploadTask:UploadTask;

    constructor(data?:any){
        if(data) {
            Object.assign(this, data);
        }
        this.id = (new Date()).getTime() + Math.floor((Math.random() * 9999) + 1);

        this.uploadCompleteObservable = new Observable((subscriber:Subscriber<any>) => {
            this.uploadCompleteSubscriber = subscriber;
        });
    }



    setXMLHttpRequest(xmlHttpRequest:XMLHttpRequest){
        this.xmlHttpRequest = xmlHttpRequest;

        this.initListeners();
        this.attachEvents();

        this.xmlHttpRequest.onreadystatechange = ((event:Event) => this.onReadyStateChange(event));
    }

    onReadyStateChange(event:Event){

        if(this.xmlHttpRequest.readyState === XMLHttpRequest.DONE) {

            let headers:Headers = new Headers();
            if(this.xmlHttpRequest.getAllResponseHeaders()){
                this.xmlHttpRequest.getAllResponseHeaders().match(/[^\r\n]+/g).forEach((line:string) => {
                    let header:Array<string> = line.split(':');
                    headers.append(header[0].trim(), header[1].trim())
                });
            }

            let responseOptions:ResponseOptions = new ResponseOptions({
                body: this.xmlHttpRequest.response,
                status: this.xmlHttpRequest.status,
                headers: headers,
                statusText: this.xmlHttpRequest.statusText,
                type: ResponseType.Default,
                url: (this.xmlHttpRequest['responseURL']?this.xmlHttpRequest['responseURL']:'')
            });
            let response:Response = new Response(responseOptions);

            if(this.xmlHttpRequest.status === 200){
                this.uploadCompleteSubscriber.next(response);
            }else if(this.xmlHttpRequest.status === 0){
                this.removeUploadEvents();
                this.uploadCompleteSubscriber.error("Request aborted");
                responseOptions.merge(new ResponseOptions({type: ResponseType.Error}));

            }else{
                this.uploadStatus.error = true;
                responseOptions.merge(new ResponseOptions({type: ResponseType.Error}));
                this.uploadCompleteSubscriber.error(this.xmlHttpRequest.response);
            }
            this.onEndEventEmitter.emit({});
            this.uploadCompleteSubscriber.complete();
        }
    }

    removeUploadEvents(){
        this.xmlHttpRequest.removeEventListener(UploadEventType.ABORT, this.abortListener);
        this.xmlHttpRequest.removeEventListener(UploadEventType.ERROR, this.errorListener);
        this.xmlHttpRequest.removeEventListener(UploadEventType.LOAD, this.loadListener);
        this.xmlHttpRequest.removeEventListener(UploadEventType.LOAD_END, this.loadEndListener);
        this.xmlHttpRequest.removeEventListener(UploadEventType.LOAD_START, this.loadStartListener);
        this.xmlHttpRequest.removeEventListener(UploadEventType.PROGRESS, this.progressListener);
        this.xmlHttpRequest.removeEventListener(UploadEventType.TIME_OUT, this.timeOutListener);
    }

    initListeners(){
        this.abortListener = (ev: Event) => {
            this.uploadEventEmitter.emit({
                eventType: UploadEventType.ABORT,
                event: ev
            })
        };

        this.errorListener = (ev: Event) => {
            this.uploadEventEmitter.emit({
                eventType: UploadEventType.ERROR,
                event: ev
            })
        };

        this.loadListener = (ev: Event) => {
            this.uploadEventEmitter.emit({
                eventType: UploadEventType.LOAD,
                event: ev
            })
        };

        this.loadStartListener = (ev: Event) => {
            this.uploadEventEmitter.emit({
                eventType: UploadEventType.LOAD_START,
                event: ev
            })
        };

        this.loadEndListener = (ev: Event) => {
            this.uploadEventEmitter.emit({
                eventType: UploadEventType.LOAD_END,
                event: ev
            })
        };

        this.progressListener = (ev: Event)  => {
            this.uploadEventEmitter.emit({
                eventType: UploadEventType.PROGRESS,
                event: ev
            })
        };

        this.timeOutListener = (ev: Event) => {
            this.uploadEventEmitter.emit({
                eventType: UploadEventType.TIME_OUT,
                event: ev
            })
        };

        this.listenUploadEvents();
    }

    attachEvents(){
        this.xmlHttpRequest.upload.addEventListener(UploadEventType.ABORT, this.abortListener);
        this.xmlHttpRequest.upload.addEventListener(UploadEventType.ERROR, this.errorListener);
        this.xmlHttpRequest.upload.addEventListener(UploadEventType.LOAD, this.loadListener);
        this.xmlHttpRequest.upload.addEventListener(UploadEventType.LOAD_START, this.loadStartListener);
        this.xmlHttpRequest.upload.addEventListener(UploadEventType.LOAD_END, this.loadEndListener);
        this.xmlHttpRequest.upload.addEventListener(UploadEventType.PROGRESS, this.progressListener);
        this.xmlHttpRequest.upload.addEventListener(UploadEventType.TIME_OUT, this.timeOutListener);
    }

    listenUploadEvents(){
        this.uploadStatus = new UploadStatus();
        this.setFileSize();
        this.uploadStatus.fileSize = this.fileSize;
        this.uploadEventEmitter.subscribe((event:UploadEvent) => {
            let response:Response = this.uploadStatus.setEvent(event);
        });
    }

    setFileSize(){
        this.fileSize = 0;
        this.files.forEach((item:FileModel) => {
            this.fileSize = this.fileSize + item.size;
        });
    }
}

export module UploadEventType {
    export const ABORT = "abort";
    export const ERROR = "error";
    export const LOAD = "load";
    export const LOAD_END = "loadend";
    export const LOAD_START = "loadstart";
    export const PROGRESS = "progress";
    export const READY_STATE_CHANGE = "readystatechange";
    export const TIME_OUT = "timeout";
}

export class UploadEvent{
    eventType:string;
    event:Event;
}

export class UploadStatus{

    uploadEvent:UploadEvent;
    fileSize:number = 0;
    percentage:number = 0;
    uploaded:number = 0;
    loading:boolean;
    done:boolean;
    aborted:boolean;
    error:boolean;
    speed:number = -1;
    timeLeft:number = -1;

    private startedAt:number;
    private statusUpdateCount:number = 0;
    private statusUpdateInterval:number = 3;

    constructor(){}

    setEvent(uploadEvent:UploadEvent):any{
        // console.log(uploadEvent.eventType.toUpperCase());
        // console.log(uploadEvent.event);
        this.uploadEvent = uploadEvent;
        if(this.uploadEvent.eventType === UploadEventType.PROGRESS){
            if (this.uploadEvent.event['lengthComputable']) {
                this.percentage = Math.round((this.uploadEvent.event['loaded'] * 100) / this.uploadEvent.event['total']);
                this.uploaded = this.fileSize * (this.percentage / 100);
            }

            let currentTime:number = (new Date()).getTime();

            let timeLoading:number = currentTime - this.startedAt;

            if(this.uploaded > 0 && (this.statusUpdateCount === 0 || this.statusUpdateCount === this.statusUpdateInterval)){
                this.statusUpdateCount = 0;
                let timeLoadingSeconds:number = timeLoading/1000;
                let bytePerSecond:number = this.uploaded/timeLoadingSeconds;
                this.speed = Math.round(bytePerSecond);

                let totalTime:number = (100*timeLoading)/(this.percentage);
                this.timeLeft = Math.round(((totalTime * (100-this.percentage))/100)/1000);
            }
            this.statusUpdateCount++;


        }else if(this.uploadEvent.eventType === UploadEventType.ABORT){
            this.aborted = true;
            this.loading = false;

        }else if(this.uploadEvent.eventType === UploadEventType.ERROR){
            this.error = true;
            this.loading = false;

        }else if(this.uploadEvent.eventType === UploadEventType.LOAD){
            this.loading = false;
            this.timeLeft = 0;

        }else if(this.uploadEvent.eventType === UploadEventType.LOAD_START){
            let currentTime:number = (new Date()).getTime();
            this.startedAt = currentTime;

            this.percentage = 0;
            this.loading = true;

        }else if(this.uploadEvent.eventType === UploadEventType.LOAD_END){
            this.done = true;
            this.loading = false;
        }else if(this.uploadEvent.eventType === UploadEventType.TIME_OUT){
            this.error = true;
            this.loading = false;
        }
        return null;

    }
}
