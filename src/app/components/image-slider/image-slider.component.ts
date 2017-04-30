/**
 * Created by ruic on 17/02/2017.
 */


import {CommonModule} from '@angular/common'
import {
    NgModule, Component, Input, OnInit, ElementRef, AfterContentInit, Output,
    EventEmitter
} from '@angular/core';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import { fromEvent } from "rxjs/observable/fromEvent";
import { Subscription } from "rxjs/Subscription";


@Component({
    selector: 'mp-image-slider',
    moduleId: module.id,
    templateUrl: 'image-slider.component.html'
})

export class ImageSliderComponent<T> implements AfterContentInit{
    ul:HTMLElement;
    liWidth:number = 0;

    sliderViewportSize = 0;
    displayImages:T[] = [];
    slideTimeOut:any;
    sliderViewport:Element;

    mouseMoveSubscription:Subscription;

    touchStartX:number;
    swipeLength:number = 0;

    private touchDirection:string;
    private htmlElement:HTMLElement;
    index:number = 0;

    private currentSlidePosition:number;

    isLoading:boolean = false;

    @Input() minimumSwipe:number = 25;
    @Input() backgroundColor:string = 'transparent';//'#383434';
    @Input() slideCaptionStyleClass:string = '';
    @Input() styleClass:string = '';

    @Input() nameField = 'src';
    @Input() srcField = 'src';
    @Input() captionField = 'caption';
    @Input() transitionDuration:number = 200;
    @Input() images:T[] = [];
    @Input() slide:boolean = true;
    @Input() loop:boolean = false;
    @Input() balls:boolean = true;

    @Input('index') set _index(index){
        this.index = -(index-1);

    }
    @Input('images') set _images(images:Array<T>){
        this.images = images.filter(()=>{return true});
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

    goLeftClick(event:Event){
        event.stopPropagation();
        this.goLeft();
    }

    goRightClick(event:Event){
        event.stopPropagation();
        this.goRight();

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
            transitionDuration = this.transitionDuration;
        }
        this.transformSlide(this.liWidth * this.index, transitionDuration);
        let index:number = this.index;
        if(Math.abs(this.index) > this.images.length){
            this.jumpToSlide(-1);

        }else if(this.index == 0){
            this.jumpToSlide(-1*(this.images.length));
        }
        index = Math.abs(this.index)-1;


        this.onSlideChange.emit({
            index: index,
            val: this.images[index]
        });

    }

    transformSlide(translateXVal, transitionDuration?:number){

        let value = `translateX(${translateXVal}px)`;
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
        }, this.transitionDuration);
    }

    onDragStart(event:MouseEvent | TouchEvent){
        event.stopPropagation();
        if(!this.slide){
            return;
        }
        if(event instanceof TouchEvent){
            this.touchStartX = event.touches[0].clientX;
        }else{
            this.touchStartX  = event.clientX;
        }

        this.currentSlidePosition = this.liWidth * this.index;
    }

    onDragSlide(event:MouseEvent | TouchEvent){
        event.stopPropagation();
        let touchEndX:number = 0;
        if(event instanceof TouchEvent){
            touchEndX = event.touches[0].clientX;
        }else{
            touchEndX = event.clientX;
        }
        if(!this.slide){
            return;
        }
        this.swipeLength = this.touchStartX - touchEndX;
        if(this.swipeLength < 0){
            this.touchDirection = 'LEFT';
            if(!this.loop && this.index === -1){
                this.swipeLength = 0;
            }
        }else if(this.swipeLength > 0){
            this.touchDirection = 'RIGHT';
            if(!this.loop && this.index === -this.images.length){
                this.swipeLength = 0;
            }
        }
        this.dragPercentage = (100*this.swipeLength)/(this.liWidth/2);
        this.transformSlide(this.currentSlidePosition - this.swipeLength);
    }
    dragPercentage:number = 0
    onDragEnd(event:TouchEvent | MouseEvent){
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
            this.transformSlide(this.currentSlidePosition, this.transitionDuration);
        }

    }

    private swipedMoreThanMinimum():boolean{
        return (Math.abs(this.dragPercentage) >= this.minimumSwipe);
    }

    attachInteractionEvents(){
        var mouseDownSubscription:Subscription = fromEvent(this.sliderViewport, 'mousedown').subscribe((event:MouseEvent) => {
            if(this.mouseMoveSubscription){
                this.mouseMoveSubscription.unsubscribe();
            }
            this.onDragStart(event);
            this.mouseMoveSubscription = fromEvent(document, 'mousemove').subscribe((moveEvent:MouseEvent) => {
                this.onDragSlide(moveEvent)
            })
            var mouseUpSubscription:Subscription = fromEvent(document, 'mouseup').subscribe((upEvent:MouseEvent) => {
                this.mouseMoveSubscription.unsubscribe();
                mouseUpSubscription.unsubscribe();
                this.onDragEnd(upEvent);
            });
        })
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

    init(){
        this.htmlElement = this.elementRef.nativeElement;

        this.ul = this.htmlElement.querySelector('ul');

        this.sliderViewport = this.htmlElement.querySelector('.slider-viewport');

        if(this.sliderViewport){
            if(this.styleClass){
                this.sliderViewport.classList.add(this.styleClass);
            }
            this.sliderViewportSize = this.sliderViewport.clientWidth;

            this.attachInteractionEvents();
            if(this.ul){
                this.ul.style.width = `${this.sliderViewport.getClientRects()[0].width * this.displayImages.length}px`;
                this.liWidth= this.sliderViewport.getClientRects()[0].width;
            }

        }

        if(this.index > 0){
            this.goRight(0);
        }else{
            this.goRight(0);
        }

        fromEvent(window, 'resize').subscribe((moveEvent) => {
            this.init();
        })
    }

    ngAfterContentInit(){
        this.init();
        this.isLoading = false;
    }
}

@Component({
    selector: 'mp-image-slides-balls',
    moduleId: module.id,
    template: `
        <ng-template ngFor let-image [ngForOf]="images" let-i="index">
            <div class="ball" [style.width]="ballPercentage+'%'"></div>
        </ng-template>
        <div class="index-ball" [style.width]="ballPercentage+'%'">
        </div>
        <div class="clearfix"></div>`
})
export class ImageSliderBalls<T> implements AfterContentInit, OnInit{

    htmlElement:HTMLElement;
    indexBall:HTMLElement;
    dragPercentage:number = 0;
    index:number = 0;
    currentPercentage:number = 0;
    @Input() images:T[] = [];
    @Input() transitionDuration:number = 0;
    @Input('dragPercentage') set _dragPercentage(dragPercentage:number){
        this.dragPercentage = dragPercentage/2;
        if(this.indexBall){
            this.indexBall.style['transition-duration'] = '0ms';
            this.indexBall.style.transform =  `translateX(${this.currentPercentage + this.dragPercentage}%)`;
        }
    }
    @Input('index') set _index(index){
        this.index = Math.abs(index)-1;
        if(this.indexBall) {
            this.indexBall.style['transition-duration'] = `${this.transitionDuration}ms`;
        }
        this.setIndexPosition();
    }

    constructor(private elementRef: ElementRef){}

    ngAfterContentInit(){
        this.htmlElement = this.elementRef.nativeElement;
        this.indexBall = <HTMLElement>this.htmlElement.querySelector('.index-ball');

        this.setIndexPosition();


    }
    ballPercentage:number = 0;
    ngOnInit(){
        this.ballPercentage = 100/this.images.length;
    }

    setIndexPosition(){
        this.currentPercentage = 100*this.index;
        if(this.indexBall) {
            this.indexBall.style.transform = `translateX(${this.currentPercentage}%)`;
            this.indexBall.style['transition-duration'] =  0;
        }
    }
}

@NgModule({
    declarations: [
        ImageSliderComponent,
        ImageSliderBalls,
    ],
    providers:[],
    exports: [
        ImageSliderComponent,
    ],
    imports : [
        CommonModule,
    ]
})
export class MPImageSliderModule {}