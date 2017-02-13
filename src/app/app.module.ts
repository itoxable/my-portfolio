/**
 * Created by ruic on 11/02/2017.
 */

import {NgModule} from '@angular/core'
import {FormsModule} from "@angular/forms";
import {BrowserModule, Title} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {RouterModule} from "@angular/router";
import {APP_BASE_HREF} from '@angular/common';


import {LocationStrategy, PathLocationStrategy} from '@angular/common';
import {routing} from "./app.routes";
import {PageNotFoundComponent} from "./components/page-not-found/page-not-found.component";
import {NoPermissionsComponent} from "./components/no-permissions/no-permissions.component";
import {AppComponent} from "./components/app.component";
import {HomeComponent} from "./components/home/home.component";
import {TopNavigationComponent} from "./components/top-navigation/top-navigation.component";
import {ApplicationService} from "./services/application.service";
import {DataTableComponent} from "./components/data-table/data-table.component";
import {ImageGalleryComponent} from "./components/image-gallery/image-gallery.component";
import {LoadingComponent} from "./components/loading/loading.component";
import {PortfolioComponent} from "./components/portfolio/portfolio.component";



@NgModule({
    declarations: [
        AppComponent,
        NoPermissionsComponent,
        PageNotFoundComponent,
        HomeComponent,
        TopNavigationComponent,
        ImageGalleryComponent,
        DataTableComponent,
        LoadingComponent,
        PortfolioComponent
    ],
    imports     : [
        BrowserModule, 
        FormsModule, 
        HttpModule,
        routing
    ],
    providers   : [
        ApplicationService,
        Title,
        RouterModule,
        HttpModule,
        {provide: LocationStrategy, useClass: PathLocationStrategy},
        {provide: APP_BASE_HREF, useValue: '/'}
    ],
    bootstrap   : [AppComponent]
})


export class AppModule {}

