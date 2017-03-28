/**
 * Created by ruic on 11/02/2017.
 */

import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {fromEvent} from "rxjs/observable/fromEvent";
import {AngularFire, FirebaseListObservable} from "angularfire2";

@Injectable()
export class ApplicationService {

    onWindowResize:Observable<any>;
    onWindowScroll:Observable<any>;

    imagesFirebaseListObservable:FirebaseListObservable<any[]>;
    categoriesFirebaseListObservable:FirebaseListObservable<any[]>;
    blogFirebaseListObservable:FirebaseListObservable<any[]>;
    aboutFirebaseListObservable:FirebaseListObservable<any[]>;
    contactFirebaseListObservable:FirebaseListObservable<any[]>;
    settingsFirebaseListObservable:FirebaseListObservable<any>;

    constructor(private angularFire:AngularFire){
        this.onWindowResize = fromEvent(window, 'resize');
        this.onWindowScroll = fromEvent(document, 'scroll');

        this.imagesFirebaseListObservable = this.angularFire.database.list('users/rui-cunha/images');
        this.settingsFirebaseListObservable = this.angularFire.database.list('users/rui-cunha/settings');
        this.categoriesFirebaseListObservable = this.angularFire.database.list('users/rui-cunha/categories');
        this.blogFirebaseListObservable = this.angularFire.database.list('users/rui-cunha/blog');
        this.aboutFirebaseListObservable = this.angularFire.database.list('users/rui-cunha/about');
        this.contactFirebaseListObservable = this.angularFire.database.list('users/rui-cunha/contact');
    }
}