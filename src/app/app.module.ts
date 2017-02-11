/**
 * Created by ruic on 11/02/2017.
 */

import { NgModule } from '@angular/core'
import { FormsModule } from "@angular/forms";
import { BrowserModule, Title } from "@angular/platform-browser";
import { HttpModule, RequestOptions, Http, XHRBackend } from "@angular/http";
import { RouterModule } from "@angular/router";
import { APP_BASE_HREF } from '@angular/common';


import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { routing } from "./app.routes";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { NoPermissionsComponent } from "./components/no-permissions/no-permissions.component";
import { AppComponent } from "./components/app.component";



@NgModule({
    declarations: [
        AppComponent,
        NoPermissionsComponent,
        PageNotFoundComponent
    ],
    imports     : [
        BrowserModule, 
        FormsModule, 
        HttpModule,
        routing
    ],
    providers   : [
        Title,
        RouterModule,
        HttpModule,
        {provide: LocationStrategy, useClass: PathLocationStrategy},
        {provide: APP_BASE_HREF, useValue: '/'}
    ],
    bootstrap   : [AppComponent]
})


export class AppModule {}

