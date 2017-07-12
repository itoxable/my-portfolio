/**
 * Created by ruic on 11/02/2017.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class ApplicationService {

    onWindowResize: Observable<any>;
    onWindowScroll: Observable<any>;

    imagesFirebaseListObservable: FirebaseListObservable<any[]>;
    categoriesFirebaseListObservable: FirebaseListObservable<any[]>;
    blogFirebaseListObservable: FirebaseListObservable<any[]>;
    aboutFirebaseListObservable: FirebaseListObservable<any[]>;
    contactFirebaseListObservable: FirebaseListObservable<any[]>;
    settingsFirebaseListObservable: FirebaseListObservable<any>;
    // gallerySettingsFirebaseListObservable:FirebaseListObservable<any>;
    constructor(private angularFireDatabase: AngularFireDatabase) {
        this.onWindowResize = fromEvent(window, 'resize');
        this.onWindowScroll = fromEvent(document, 'scroll');

        this.imagesFirebaseListObservable = this.angularFireDatabase.list('users/rui-cunha/images');
        this.settingsFirebaseListObservable = this.angularFireDatabase.list('users/rui-cunha/settings');
        this.categoriesFirebaseListObservable = this.angularFireDatabase.list('users/rui-cunha/categories');
        this.blogFirebaseListObservable = this.angularFireDatabase.list('users/rui-cunha/blog');
        this.aboutFirebaseListObservable = this.angularFireDatabase.list('users/rui-cunha/about');
    }
}
