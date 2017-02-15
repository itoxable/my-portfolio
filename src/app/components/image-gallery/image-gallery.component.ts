/**
 * Created by ruic on 12/02/2017.
 */

import {Component} from '@angular/core';
import {DataTableComponent} from "../data-table/data-table.component";
import {Http} from "@angular/http";
import {ApplicationService} from "../../services/application.service";

@Component({
    selector: 'mp-image-gallery',
    moduleId: module.id,
    templateUrl: 'image-gallery.component.html'
})

export class ImageGalleryComponent extends DataTableComponent{

    constructor(private _http:Http, private applicationService:ApplicationService){
        super(_http, null);
    }
}
