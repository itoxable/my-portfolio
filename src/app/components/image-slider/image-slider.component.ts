/**
 * Created by ruic on 17/02/2017.
 */


import {CommonModule} from '@angular/common'
import {
    NgModule, Component, Input, HostListener, OnInit, ElementRef, AfterContentInit, Output,
    EventEmitter
} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {timeout} from 'rxjs/operator/timeout';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';


@Component({
    selector: 'mp-image-slider',
    moduleId: module.id,
    templateUrl: 'image-slider.component.html'
})

export class ImageSliderComponent implements AfterContentInit{
    ul:HTMLElement;
    liWidth:number = 0;

    sliderViewportSize = 0;
    displayImages:Array<any> = [];
    slideTimeOut:any;

    private swipePercentage:number = 0;
    private currentSlidePositionPercentage:number = 0;
    private touchStartX:number;
    private touchEndX:number;
    private touchDirection:string;
    private htmlElement:HTMLElement;
    index:number = 0;
    @Input() minimumSwipe:number = 25;
    @Input() backgroundColor:string ='#383434';
    @Input() slideCaptionStyleClass:string = '';
    @Input() styleClass:string = '';

    @Input('index') set _index(index){
        this.index = -(index-1);
    }

    @Input() nameField = 'src';
    @Input() srcField = 'src';
    @Input() slideDuration:number = 300;
    @Input() images:Array<any> = [];

    @Input() slide:boolean = true;
    @Input() loop:boolean = true;
    @Input() balls:boolean = true;
    isLoading:boolean = false;
    @Input('images') set _images(images:Array<any>){
        this.images = images;
        this.initImages();
    }

    @Output() onSlideChange:EventEmitter<any> = new EventEmitter<any>();

    constructor(private elementRef: ElementRef){
        this.isLoading = true;
    }

    cancelTimeout(){
        if(this.slideTimeOut){
            clearTimeout(this.slideTimeOut);
        }
    }
    isActive(index:number):boolean{
        return Math.abs(this.index) == index;
    }
    isBallActive(index:number):boolean{
        if((Math.abs(this.index) - 1) == index){
            return true;
        }
        if(this.index == 0){
            return index == (this.images.length -1);
        }
        return false;
    }
    showLeft():boolean{
        return this.index < -1;
    }
    showRight():boolean{
        return Math.abs(this.index) < this.images.length
    }
    goToSlide(i:number){
        this.index = -(i + 1);
        this.moveSlide();
    }
    goLeft(transitionDuration?:number){
        this.index++;
        this.cancelTimeout();
        this.moveSlide(transitionDuration);
    }

    goRight(transitionDuration?:number){
        this.index--;
        this.cancelTimeout();
        this.moveSlide(transitionDuration);
    }

    moveSlide(transitionDuration?:number){

        if(transitionDuration == undefined){
            transitionDuration = this.slideDuration;
        }
        this.transformSlide(this.liWidth * this.index, transitionDuration);

        if(Math.abs(this.index) > this.images.length){
            this.jumpToSlide(-1);

        }else if(this.index == 0){
            this.jumpToSlide(-1*(this.images.length));
        }else{
            this.onSlideChange.emit(Math.abs(this.index));
        }

    }

    transformSlide(translateXVal, transitionDuration?:number){

        let value = `translateX(${translateXVal}%)`;
        this.ul.style.transform =  value;
        this.ul.style['-webkit-transform'] =  value;
        this.ul.style['-ms-transform'] =  value;
        if(transitionDuration != undefined){
            this.ul.style['transition-duration'] =  `${transitionDuration}ms`;
        }else{
            this.ul.style['transition-duration'] =  `0ms`;
        }

    }

    jumpToSlide(index){
        this.index = index;
        this.slideTimeOut = setTimeout(() => {
            this.moveSlide(0);
        }, this.slideDuration);
    }

    initImages(){
        if(this.images && this.images.length > 0){
            this.displayImages = [];
            this.displayImages.push(this.images[this.images.length -1]);
            this.images.forEach(image => {
                this.displayImages.push(image);
            });
            this.displayImages.push(this.images[0]);

            this.init();
        }
    }

    onTouchMove(event){
        if(!this.slide){
            return;
        }
        let viewPortWidth:number = event.currentTarget.clientWidth;
        this.currentSlidePositionPercentage = this.liWidth * this.index;

        this.touchEndX = event.touches[0].clientX;
        let swipeLenght:number = this.touchStartX - this.touchEndX;

        this.swipePercentage = (swipeLenght * this.currentSlidePositionPercentage)/viewPortWidth;
        this.transformSlide(this.currentSlidePositionPercentage + this.swipePercentage);
        console.log(this.currentSlidePositionPercentage + ": " + this.swipePercentage);

        if(swipeLenght < 0){
            this.touchDirection = 'LEFT';
        }else if(swipeLenght > 0){
            this.touchDirection = 'RIGHT';
        }

    }

    private swipedMoreThanMinimum():boolean{
        let imagePercentage:number = 100/this.displayImages.length;
        let swipeTotalPercentage:number = Math.abs((this.swipePercentage * 100)/(imagePercentage));
        return (swipeTotalPercentage >= this.minimumSwipe);
    }

    onTouchEnd(event:TouchEvent){
        if(!this.slide){
            return;
        }
        if(this.swipedMoreThanMinimum()){
            if(this.touchDirection === 'RIGHT'){
                this.goRight();
                this.touchDirection = '';
            }else if(this.touchDirection === 'LEFT'){
                this.goLeft();
                this.touchDirection = '';
            }
        }else{
            this.transformSlide(this.currentSlidePositionPercentage, this.slideDuration);
        }

    }

    onTouchStart(event){
        if(!this.slide){
            return;
        }
        this.touchStartX = event.touches[0].clientX;
    }

    init(){
        console.log(this.displayImages.length);
        this.htmlElement = this.elementRef.nativeElement;
        this.liWidth= 100 / this.displayImages.length;
        this.ul = this.htmlElement.querySelector('ul');
        if(this.ul){
            this.ul.style.width = `${100 * this.displayImages.length}%`;
        }

        let sliderViewport:HTMLElement = this.htmlElement.querySelector('.slider-viewport')[0];
        if(sliderViewport){
            if(this.styleClass){
                sliderViewport.classList.add(this.styleClass);
            }
            this.sliderViewportSize = sliderViewport.clientWidth;
        }
        let lis = this.htmlElement.querySelector('li');
        if(this.index > 0){
            this.goRight(0);
        }else{
            this.goRight(0);
        }
    }

    ngAfterContentInit(){
        this.init();
        this.isLoading = false;
    }
}

// @NgModule({
//     declarations: [
//         SearchComponent,
//         SearchDetailsComponent,
//         SearchResultTableComponent,
//         RecentSearchComponent,
//         OnMapSearchViewComponent,
//         PropertyDetailComponent,
//         StreetDetailComponent,
//         DataDictionaryPipe
//     ],
//     providers:[
//         MapService,
//         SearchService,
//         AlpsService
//     ],
//     exports: [
//         SearchComponent,
//     ],
//     imports : [
//         GPCoreComponentsModule,
//         GPMapModule,
//         GPRightSiderbarModule,
//         CommonModule,
//         GPPipesModule,
//         FormsModule
//     ]
// })