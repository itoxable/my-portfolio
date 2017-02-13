/**
 * Created by ruic on 11/02/2017.
 */

import {Injectable, EventEmitter} from '@angular/core';
import {Response} from "@angular/http";
import {Observable} from "rxjs";
import {fromEvent} from "rxjs/observable/fromEvent";

@Injectable()
export class ApplicationService {

    onWindowResize:Observable<any>;
    onWindowScroll:Observable<any>;
    constructor(){
        this.onWindowResize = fromEvent(window, 'resize');
        this.onWindowScroll = fromEvent(document, 'scroll');
    }
}