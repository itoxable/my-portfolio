/**
 * Created by ruic on 11/02/2017.
 */

import {Component} from '@angular/core';
import {ApplicationService} from "../services/application.service";
import {Event, NavigationEnd, Router} from "@angular/router";

@Component({
    selector: 'mp-app',
    moduleId: module.id,
    templateUrl: 'app.component.html'
})

export class AppComponent{

    mobileView:boolean = false;
    navOn:boolean = false;
    settings:any = {};

    constructor(private applicationService:ApplicationService, private router: Router){
        this.mobileView = window.innerWidth < 992;
        this.applicationService.onWindowResize.subscribe(ev => {
            this.mobileView = window.innerWidth < 992;
            console.log(window.innerWidth+" this.mobileView: "+this.mobileView);
        });

        this.applicationService.settingsFirebaseListObservable.subscribe((data:any[]) => {

            if(data && data.length > 0) {
                this.settings = data[0];
            }
            console.log(this.settings);
        });

        this.router.events.subscribe((event:Event) => {

            if(event instanceof NavigationEnd){
                console.log(window['ga']);
                if(window['ga']){
                    window['ga']('send', 'pageview');
                    console.log(event.url);
                }


            }

        });
    }

    onScroll(ev){

    }
}
