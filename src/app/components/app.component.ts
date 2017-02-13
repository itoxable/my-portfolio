/**
 * Created by ruic on 11/02/2017.
 */

import {Component} from '@angular/core';
import {ApplicationService} from "../services/application.service";

@Component({
    selector: 'mp-app',
    moduleId: module.id,
    templateUrl: 'app.component.html'
})

export class AppComponent{

    mobileView:boolean = false;
    navOn:boolean = false;

    constructor(private applicationService:ApplicationService){
        this.mobileView = window.innerWidth < 992;
        this.applicationService.onWindowResize.subscribe(ev => {
            this.mobileView = window.innerWidth < 992;
            console.log(window.innerWidth+" this.mobileView: "+this.mobileView);
        });
    }

    onScroll(ev){

    }
}
