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
import {AppComponent} from "./components/app.component";
import {NavDropDownDirective, TopNavigationComponent} from "./components/top-navigation/top-navigation.component";
import {ApplicationService} from "./services/application.service";
import {FileUploadService} from "./services/file-upload.service";
import {DataTableComponent} from "./components/data-table/data-table.component";
import {ImageGalleryComponent} from "./components/image-gallery/image-gallery.component";
import {LoadingComponent} from "./components/loading/loading.component";
import {AngularFireModule} from "angularfire2";
import {EditPortfolioService} from "./services/edit-portfolio.service";
import {FileUploadComponent} from "./components/file-upload/file-upload.component";
import {SizeFormatPipe, SafeURLPipe} from "./pipes/size-format.pipe";
import {ModalComponent} from "./components/modal/modal.component";
import {
    ImageSliderBalls, ImageSliderComponent,
    MPImageSliderModule
} from "./components/image-slider/image-slider.component";
import {TextEditorComponent} from "./components/text-editor/text-editor.component";
import {DataTablePaginationControlComponent} from "./components/data-table/data-table-pagination-control.component";
import {
    AboutComponent,
    ContactComponent,
    BlogComponent,
    EditPortfolioComponent,
    PortfolioComponent,
    HomeComponent,
    PageNotFoundComponent,
    NoPermissionsComponent
} from "./components/pages/index.d";

const FIREBASE_APP_CONFIG = {
    apiKey: "AIzaSyB6Isl4f6D1onyF07NfZqDfhUV_thnLbdg",
    authDomain: "my-portfolio-d2da7.firebaseapp.com",
    databaseURL: "https://my-portfolio-d2da7.firebaseio.com",
    storageBucket: 'my-portfolio-d2da7.appspot.com',
};

@NgModule({
    declarations: [
        AppComponent,
        NoPermissionsComponent,
        PageNotFoundComponent,
        HomeComponent,
        TopNavigationComponent,
        NavDropDownDirective,
        ImageGalleryComponent,
        DataTableComponent,
        DataTablePaginationControlComponent,
        LoadingComponent,
        PortfolioComponent,
        EditPortfolioComponent,
        FileUploadComponent,
        SizeFormatPipe,
        SafeURLPipe,
        ModalComponent,
        TextEditorComponent,
        BlogComponent,
        ContactComponent,
        AboutComponent
    ],
    imports     : [
        BrowserModule, 
        FormsModule, 
        HttpModule,
        routing,
        AngularFireModule.initializeApp(FIREBASE_APP_CONFIG),
        MPImageSliderModule
    ],
    providers   : [
        ApplicationService,
        EditPortfolioService,
        FileUploadService,
        Title,
        RouterModule,
        HttpModule,
        {provide: LocationStrategy, useClass: PathLocationStrategy},
        {provide: APP_BASE_HREF, useValue: '/'}
    ],
    bootstrap   : [AppComponent]
})


export class AppModule {}

