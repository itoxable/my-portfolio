/**
 * Created by ruic on 01/05/2017.
 */

import {CommonModule} from '@angular/common'
import {
    NgModule, Component, Input, OnDestroy, ElementRef, AfterContentInit, Output,
    EventEmitter
} from '@angular/core';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import { fromEvent } from "rxjs/observable/fromEvent";
import { Subscription } from "rxjs/Subscription";
import {ImageModel} from "../../models/models";



@Component({
    selector: 'mp-flex-images',
    moduleId: module.id,
    template: `
            <ng-template ngFor let-image [ngForOf]="images" let-idx="index">
                <div class="flex-image" [attr.data-w]="image.width" [attr.data-h]="image.height">
                    <img [src]="image[srcField]" (load)="onImageLoad($event, idx, image)">
                </div>
            </ng-template>
    `
})
export class FlexImages<T> implements AfterContentInit, OnDestroy{

    images:T[] = [];
    @Input('images') set _images(images:T[]){
        this.images = images;
    }
    @Input() flexImages:FlexImagesModel = {object: 'img', maxRows: 0, truncate: false };
    resizeSubscription:Subscription;
    grid:HTMLElement;
    container:string = '.flex-image';
    containers:NodeListOf<HTMLElement>;
    private imagesLoadedCount:number = 0;
    @Input() nameField = 'src';
    @Input() srcField = 'url';
    @Input() captionField = 'caption';
    @Input() rowHeight = 250;
    @Output() onReady:EventEmitter<any> = new EventEmitter<any>();
    items:Array<any> = [];

    constructor(private elementRef: ElementRef){}

    ngAfterContentInit(){
        this.grid = this.elementRef.nativeElement;
    }

    onImageLoad(event:Event, index:number, image:ImageModel){
        this.imagesLoadedCount++;
        let imgEl:HTMLElement = <HTMLElement>event.target;
        image.height = imgEl['naturalHeight'];
        image.width = imgEl['naturalWidth'];

        image.displayHeight = imgEl['height'];
        image.displayWidth = imgEl['width'];

        if(this.imagesLoadedCount == this.images.length){
            setTimeout((()=>{
                this.setGrid();
                this.onReady.emit(true);
            }).bind(this), 0);
        }
    }

    setGrid(){
        if(!this.images || this.images.length == 0){
            return;
        }
        this.containers = <NodeListOf<HTMLElement>>this.grid.querySelectorAll(this.container);

        if (!this.containers && !this.containers.length){
            return;
        }

        var currentStyle:CSSStyleDeclaration = window.getComputedStyle ? getComputedStyle(this.containers.item(0), null) : this.containers.item(0)['currentStyle'];

        this.flexImages.margin = (parseInt(currentStyle.marginLeft) || 0) + (parseInt(currentStyle.marginRight) || 0) + (Math.round(parseFloat(currentStyle.borderLeftWidth)) || 0) + (Math.round(parseFloat(currentStyle.borderRightWidth)) || 0);


        for (var j = 0; j < this.containers.length; j++) {
            var container:HTMLElement = this.containers.item(j),
                width:number = parseInt(container.getAttribute('data-w')),
                normalizedWidth = width*(this.rowHeight/parseInt(container.getAttribute('data-h'))), // normalized width
                obj = container.querySelector(this.flexImages.object);
            this.items.push({
                'container': container,
                'width': width,
                'normalizedWidth': normalizedWidth,
                'obj': obj,
                'src': obj.getAttribute('data-src')});
        }
        this.buildGrid();
    }

    buildGrid(noResize?:boolean){

        var currentImageIndex:number,
            newWidth:number,
            exact_w:number,
            ratio:number = 1,
            rows:number = 1,
            maxWidth:number = this.grid.clientWidth-2,
            row:Array<any> = [],
            row_width:number = 0,
            height:number,
            row_h:number = this.rowHeight;

        // define inside makeGrid to access variables in scope
        var helper = function (lastRow?:boolean){
            let rowItem = row[currentImageIndex];
            if (this.flexImages.maxRows && rows > this.flexImages.maxRows || this.flexImages.truncate && lastRow && rows > 1) {
                rowItem.container.style.display = 'none';
            }
            else {
                if (rowItem.src) {
                    rowItem.obj.setAttribute('src', rowItem.src); rowItem.src = '';
                }
                rowItem.container.style.width = newWidth+'px';
                rowItem.container.style.height = row_h+'px';
                rowItem.container.style.display = 'block';
            }
        }.bind(this);


        for (var i = 0; i < this.items.length; i++) {
            row.push(this.items[i]);

            row_width += this.items[i].normalizedWidth + this.flexImages.margin;

            if (row_width >= maxWidth) {
                var margins_in_row = row.length * this.flexImages.margin;
                ratio = (maxWidth-margins_in_row) / (row_width-margins_in_row), row_h = Math.ceil(this.rowHeight*ratio), exact_w = 0, newWidth;

                for (currentImageIndex = 0; currentImageIndex < row.length; currentImageIndex++) {
                    newWidth = Math.ceil(row[currentImageIndex].normalizedWidth*ratio);
                    exact_w += newWidth + this.flexImages.margin;
                    if (exact_w > maxWidth) newWidth -= exact_w - maxWidth;
                    helper();
                }
                // reset for next row
                row = [];
                row_width = 0;
                rows++;
            }
        }

        // layout last row - match height of last row to previous row
        for (currentImageIndex = 0; currentImageIndex < row.length; currentImageIndex++) {
            newWidth = Math.floor(row[currentImageIndex].normalizedWidth*ratio);
            height = Math.floor(this.rowHeight*ratio);
            helper(true);
        }

        // scroll bars added or removed during rendering new layout?
        if (!noResize && maxWidth != this.grid.clientWidth){
            this.buildGrid(true);
        }

        if(!this.resizeSubscription){
            this.resizeSubscription = fromEvent(window, 'resize').subscribe((event) => {
                this.buildGrid();
            })
        }
    }

    ngOnDestroy(){
        if(this.resizeSubscription){
            this.resizeSubscription.unsubscribe();
        }
    }
}

export interface FlexImagesModel{
    //selector:string|HTMLElement;//	string or DOM element	Required selector for container or DOM element that holds the individual images/objects.
    //container:string;//		Selector of the individual image/object containers.
    object:string;//		'img'	Selector of the image/object inside a container.
    rowHeight?:number;//		180	Maximum height of a row.
    maxRows?:number; // Maximum number of rows to display. Images/Objects exceeding this row are hidden.
    truncate?:boolean;//Hide incomplete last row of images/objects.
    margin?:number;
}

export interface FlexImagesItemModel{

}