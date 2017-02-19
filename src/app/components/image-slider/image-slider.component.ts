/**
 * Created by ruic on 17/02/2017.
 */


import {CommonModule} from '@angular/common'
import {NgModule, Component, Input, HostListener, OnInit, ElementRef, AfterContentInit} from '@angular/core';
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

    private touchStartX:number;
    private touchEndX:number;
    private touchDirection:string;

    index:number = 0;

    @Input() backgroundColor:string ='#383434';
    @Input() slideCaptionStyleClass:string = '';
    @Input() styleClass:string = '';

    @Input('index') set _index(index){
        this.index = -(index-1);
    }

    @Input() nameField = 'src';
    @Input() srcField = 'src';
    @Input() slideDuration:number = 200;
    @Input() images:Array<any> = [];

    @Input() slide:boolean = true;
    @Input() loop:boolean = true;
    @Input() balls:boolean = true;

    @Input('images') set _images(images:Array<any>){
        this.images = images;
        this.initImages();
    }

    constructor(private elementRef: ElementRef){

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
        }
    }

    transformSlide(translateXVal, transitionDuration?:number){

        let value = `translateX(${translateXVal}%)`;
        this.ul.style.transform =  value;
        this.ul.style['-webkit-transform'] =  value;
        this.ul.style['-ms-transform'] =  value;
        if(transitionDuration != undefined){
            this.ul.style['transition-duration'] =  `${transitionDuration}ms`;
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
        let percentage = this.liWidth * this.index;

        this.touchEndX = event.touches[0].clientX;
        let swipeLenght:number = this.touchStartX - this.touchEndX;

        let swipePercentage:number = (swipeLenght * percentage)/viewPortWidth;
        this.transformSlide(percentage+swipePercentage);
        if(swipeLenght < 0){
            //Right
            this.touchDirection = 'LEFT';
        }else if(swipeLenght > 0){
            //Left
            this.touchDirection = 'RIGHT';
        }
    }

    onTouchEnd(event:TouchEvent){
        if(!this.slide){
            return;
        }
        if(this.touchDirection === 'RIGHT'){
            this.goRight();
            this.touchDirection = '';
        }else if(this.touchDirection === 'LEFT'){
            this.goLeft();
            this.touchDirection = '';
        }
    }

    onTouchStart(event){
        if(!this.slide){
            return;
        }
        this.touchStartX = event.touches[0].clientX;
    }

    init(){
        this.liWidth= 100 / this.displayImages.length;
        this.ul = this.elementRef.nativeElement.querySelector('ul');
        if(this.ul){
            this.ul.style.width = `${100 * this.displayImages.length}%`;
        }

        let sliderViewport:HTMLElement = this.elementRef.nativeElement.querySelector('.slider-viewport');
        if(sliderViewport){
            if(this.styleClass){
                sliderViewport.classList.add(this.styleClass);
            }

            this.sliderViewportSize = sliderViewport.clientWidth;
        }
        let lis = this.elementRef.nativeElement.querySelector('li');
        if(this.index > 0){
            this.goRight(0);
        }else{
            this.goRight(0);
        }
    }

    ngAfterContentInit(){

        this.init();

    }
}