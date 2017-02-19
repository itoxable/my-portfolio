/**
 * Created by ruic on 11/10/2016.
 */

import { Injectable } from '@angular/core';
import { RequestOptions } from '@angular/http';

import {FileWrapperModel, FileModel, UploadStatus} from "../models/file-wrapper.model";
import { Observable } from "rxjs/Observable";
import {AngularFire} from "angularfire2";

import * as firebase from 'firebase';

import UploadTask = firebase.storage.UploadTask;
import Reference = firebase.database.Reference;
import TaskEvent = firebase.storage.TaskEvent;
import {Subscriber} from "rxjs";
import "rxjs/add/observable/of";
import UploadTaskSnapshot = firebase.storage.UploadTaskSnapshot;



@Injectable()
export class FileUploadService {

    constructor(private requestOptions:RequestOptions, private angularFire:AngularFire) {
    }

    abort(fileWrapper:FileWrapperModel){
        fileWrapper.uploadTask.cancel();
    }

    pause(fileWrapper:FileWrapperModel){
        fileWrapper.uploadTask.pause();
    }

    resume(fileWrapper:FileWrapperModel){
        fileWrapper.uploadTask.resume();
    }

    deleteFile(fileUrl:string):Observable<any>{
        let subscriber:Subscriber<any>;
        let observable:Observable<any> = new Observable((_subscriber:Subscriber<any>) => {
            subscriber= _subscriber;
        });
        let promise:firebase.Promise<any> = firebase.storage().refFromURL(fileUrl).delete();
        promise.catch((error: Error) => {
            subscriber.error(error);
            subscriber.complete();
        });
        promise.then((val:any) => {
            subscriber.next(val);
            subscriber.complete();
        });
        return observable;
    }


    private setFirebaseRequest(reference:string, fileWrapper:FileWrapperModel):Observable<UploadTaskSnapshot>{
        fileWrapper.uploadStatus = new UploadStatus();
        fileWrapper.uploadStatus.fileSize = fileWrapper.fileSize;

        let subscriber:Subscriber<UploadTaskSnapshot>;
        let observable:Observable<UploadTaskSnapshot> = new Observable((_subscriber:Subscriber<UploadTaskSnapshot>) => {
            subscriber= _subscriber;
        });
        let storageRef = firebase.storage().ref(reference);
        fileWrapper.uploadTask = storageRef.put(fileWrapper.files[0].file);

        fileWrapper.uploadTask.on(TaskEvent.STATE_CHANGED, {
            'next': (snapshot:UploadTaskSnapshot) => {
                fileWrapper.uploadStatus.percentage = Math.round(100*(snapshot.bytesTransferred / snapshot.totalBytes));
            },
            'error': (error) => {
                subscriber.error(error);
                subscriber.complete();
            },
            'complete': () => {
                subscriber.next(fileWrapper.uploadTask.snapshot);
                subscriber.complete();
            }
        });

        return observable;
    }


    uploadFile(fileWrapper:FileWrapperModel, data?:any, headers?:any):Observable<UploadTaskSnapshot>{
        try{
            let reference:string = '/rui-cunha/'+fileWrapper.files[0].title;
            return this.setFirebaseRequest(reference, fileWrapper);
        }catch(e){
            console.error(e);
            return new Observable((subscriber:Subscriber<UploadTaskSnapshot>) => {
                subscriber.error(e)
            });
        }
    }
}

