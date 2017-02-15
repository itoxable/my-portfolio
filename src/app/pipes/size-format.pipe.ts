/**
 * Created by ruic on 15/02/2017.
 */

import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

@Pipe({
    name: 'mpSizeFormat'
})
export class SizeFormatPipe implements PipeTransform {
    constructor() {}
    transform(value:any, decimals:number = 1):string {
        if(value == 0) return '0 Byte';
        var k = 1000;
        var dm = decimals + 1 || 3;
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var i = Math.floor(Math.log(value) / Math.log(k));
        return parseFloat((value / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
}


@Pipe({
    name: 'mpSafeURL'
})
export class SafeURLPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer){}
    transform(url:string){
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}