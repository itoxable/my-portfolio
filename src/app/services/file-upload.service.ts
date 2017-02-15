/**
 * Created by ruic on 11/10/2016.
 */

import { Injectable } from '@angular/core';
import { RequestOptions } from '@angular/http';

import { FileWrapperModel, FileModel } from "../models/file-wrapper.model";
import { Observable } from "rxjs/Observable";



@Injectable()
export class FileUploadService {

    constructor(private requestOptions:RequestOptions) {
    }

    abort(fileWrapper:FileWrapperModel){
        fileWrapper.xmlHttpRequest.abort();
    }


    uploadFile(url:string, fileWrapper:FileWrapperModel, data?:any, headers?:any):Observable<any>{

        let formData = new FormData();
        let xmlHttpRequest:XMLHttpRequest = new XMLHttpRequest();

        fileWrapper.files.forEach((file:FileModel, index:number) => {
            let fileName:string = file.title?file.title:'file_'+index;
            formData.append(fileName, file.file);
        });

        if(data){
            for(let key in data){
                formData.append(key, data);
            }
        }
        
        if(fileWrapper.data){
            for(let key in fileWrapper.data){
                formData.append(key, fileWrapper.data);
            }
        }

        try{
            fileWrapper.setXMLHttpRequest(xmlHttpRequest);
            
            xmlHttpRequest.open('post', url, true);
            if(headers) {
                Object.keys(headers).forEach((headerKey) => {
                    xmlHttpRequest.setRequestHeader(headerKey, headers[headerKey]);
                });
            }
            this.requestOptions.headers.keys().forEach((headerKey) => {
                xmlHttpRequest.setRequestHeader(headerKey, this.requestOptions.headers.get(headerKey));
            });

            xmlHttpRequest.send(formData);

            return fileWrapper.uploadCompleteObservable;

        }catch(e){
            console.error(e);
            return Observable.of({error: e});
        }

    }
}

