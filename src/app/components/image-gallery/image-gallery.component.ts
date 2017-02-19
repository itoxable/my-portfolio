/**
 * Created by ruic on 12/02/2017.
 */

import {Component, Input, OnInit, AfterViewInit, ElementRef} from '@angular/core';
import {DataTableComponent} from "../data-table/data-table.component";
import {Http} from "@angular/http";
import {ApplicationService} from "../../services/application.service";
import {FirebaseListObservable, AngularFire} from "angularfire2";
import {FirebaseListFactoryOpts, Query} from "angularfire2/interfaces";
import {Image} from "../../models/models";
declare var Isotope:any

@Component({
    selector: 'mp-image-gallery',
    moduleId: module.id,
    templateUrl: 'image-gallery.component.html'
})

export class ImageGalleryComponent implements OnInit, AfterViewInit{

    @Input() set category(category: string){
        this.filter(category);
    };
    isLoading:boolean;
    imagesFirebaseListObservable:FirebaseListObservable<any[]>;
    firebaseListFactoryOpts:FirebaseListFactoryOpts;

    images:Array<Image> = [];
    totalItems:number = 0;
    selectedImage:Image;
    selectedIndex:number = 0;
    displayImages:Array<Image> = [];
    constructor(private _http:Http, private angularFire:AngularFire, private applicationService:ApplicationService, private elementRef: ElementRef){

    }
    isLast(last:boolean):boolean{
        if(last){
            setTimeout((()=>{
                this.initGrid();
            }).bind(this), 200);
        }
        return false
    }

    filter(category:string){
        if(category){
            this.displayImages = this.images.filter((image:Image) => {
                if(image.categories && image.categories.length > 0){
                    let foundCat:string = image.categories.find((cat:string) => {
                        return cat.toLowerCase() === category.toLowerCase();
                    });
                    console.log(foundCat);
                    if(foundCat && foundCat){
                        return true;
                    }
                }
                return false;
            });
        }else{
            this.displayImages = this.images.filter(() => {return true;});
        }



    }
    ngAfterViewInit(){
        console.log('ngAfterViewInit');
    }
    initGrid(){

        var grid = this.elementRef.nativeElement.querySelector('.gallery-wrapper');
        console.log(grid);
        var iso = new Isotope( grid, {
            // options...
            itemSelector: '.gallery-item',
            layoutMode: 'fitRows',
            masonry: {
                // columnWidth: 200
            }
        });
    }

    ngOnInit(){

        this.firebaseListFactoryOpts = {
            preserveSnapshot: false,
        }
        this.imagesFirebaseListObservable = this.angularFire.database.list('users/rui-cunha/images', this.firebaseListFactoryOpts);
        this.imagesFirebaseListObservable.subscribe((data:Image[]) => {
            this.images = data;
            this.filter('');
        });
    }

    select(image:Image, index:number){
        this.selectedIndex = index;
        this.selectedImage = image;
    }

    loadMore(){

    }
}
