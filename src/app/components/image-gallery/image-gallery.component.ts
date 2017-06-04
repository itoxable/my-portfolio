/**
 * Created by ruic on 12/02/2017.
 */

import {Component, Input, OnInit, AfterViewInit, ElementRef} from '@angular/core';
import {Http} from "@angular/http";
import {ApplicationService} from "../../services/application.service";
import {FirebaseListObservable} from "angularfire2";
import {FirebaseListFactoryOpts} from "angularfire2/interfaces";
import {ImageModel} from "../../models/models";
declare var Isotope:any;

@Component({
    selector: 'mp-image-gallery',
    moduleId: module.id,
    templateUrl: 'image-gallery.component.html'
})

export class ImageGalleryComponent implements OnInit, AfterViewInit{

    _category:string = '';
    @Input() images:Array<ImageModel> = [];
    @Input() set category(category: string){
        this._category = category?category.toLowerCase():category;
        this.filter();
    };
    isLoading:boolean;
    imagesFirebaseListObservable:FirebaseListObservable<any[]>;
    firebaseListFactoryOpts:FirebaseListFactoryOpts;

    totalItems:number = 0;
    selectedImage:ImageModel;
    selectedIndex:number = 0;
    displayImages:Array<ImageModel> = [];

    isotope:any;

    grid:HTMLDivElement;
    imagesLoadedCount:number = 0;

    constructor(private _http:Http, private applicationService:ApplicationService, private elementRef: ElementRef){

    }

    getImageCategories(image:ImageModel):string{
        if(image.categories && image.categories.length > 0){
            return image.categories.join(" ").toLowerCase();
        }
        return '';
    }

    onSlideChange(event){
        console.log('onSlideChange: '+event);
    }

    filter(){
        console.log('this._category: '+this._category);
        if (this.isotope) {
            if (this._category) {
                this.isotope.arrange({
                    filter: '.' + this._category
                })
            } else {
                this.isotope.arrange({
                    filter: '*'
                });
            }
        }
    }

    ngAfterViewInit(){
        console.log('ngAfterViewInit');
        this.grid = this.elementRef.nativeElement.querySelector('.gallery-wrapper');
    }

    initGrid(){
        this.isotope = new Isotope(this.grid);
        let options = {
            itemSelector: '.gallery-item',
            masonry: {
                // gutter: 10,
                // columnWidth: 10,
                transitionDuration: '0.8s',
                itemSelector: '.gallery-item'
            }
        };
        this.isotope.arrange(options);
    }

    init(){
        // this.isLoading = true;
        this.firebaseListFactoryOpts = {
            preserveSnapshot: false,
        }
        console.log(this.images);
        if(!this.images || this.images.length == 0){
            this.applicationService.imagesFirebaseListObservable.subscribe((data:ImageModel[]) => {
                this.images = data;
            });
        }
    }

    loadIsotope(){
        if(window['Isotope']){
           this.init();
        }else{
            let script = document.createElement('script');
            script.src = '/lib/isotope.pkgd.min.js';
            script.onload = script['onreadystatechange'] = function (event:Event) {
                var rs = event.target['readyState'];
                if (rs) if (rs != 'complete') if (rs != 'loaded') return;
                this.init();
            }.bind(this);
            let scr = document.body;
            scr.appendChild(script);
        }
    }

    ngOnInit(){
        this.isLoading = true;
        this.loadIsotope();
    }

    onImageLoad(event:Event, index:number, image:ImageModel){
        this.imagesLoadedCount++;

        image.height = event.target['naturalHeight'];
        image.width = event.target['naturalWidth'];

        image.displayHeight = event.target['height'];
        image.displayWidth = event.target['width'];

        if(this.imagesLoadedCount == this.images.length){
            setTimeout((()=>{
                this.initGrid();
                this.grid.classList.add('visible');
                this.isLoading = false;
            }).bind(this), 100);
        }
    }

    select(image:ImageModel, index:number){
        this.selectedIndex = index;
        this.selectedImage = image;
    }

    loadMore(){

    }
}
