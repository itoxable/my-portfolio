/**
 * Created by ruic on 11/02/2017.
 */

import {Component} from '@angular/core';
import {ApplicationService} from '../services/application.service';
import {Event, NavigationEnd, Router} from '@angular/router';

@Component({
    selector: 'mp-app',
    templateUrl: 'app.component.html'
})

export class AppComponent {

    mobileView = false;
    navOn = false;
    settings = {};

    constructor(private applicationService: ApplicationService, private router: Router){
        this.mobileView = window.innerWidth < 992;
        this.applicationService.onWindowResize.subscribe(ev => {
            this.mobileView = window.innerWidth < 992;
            // console.log(window.innerWidth+' this.mobileView: '+this.mobileView);
        });

        this.applicationService.settingsFirebaseListObservable.subscribe((data: any[]) => {

            if (data && data.length > 0) {
                this.settings = data[0];
            }
            // console.log(this.settings);
        });

        this.router.events.subscribe((event:Event) => {

            if (event instanceof NavigationEnd) {
                const ga = window['ga'];
                if (ga) {
                    ga('set', 'page', event.url);
                    ga('send', 'pageview');
                }


            }

        });
    }

    onScroll(ev) {

    }
}
