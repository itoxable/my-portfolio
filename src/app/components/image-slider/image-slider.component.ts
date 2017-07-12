/**
 * Created by ruic on 17/02/2017.
 */


import { CommonModule } from '@angular/common'
import {
    NgModule, Component, Input, OnInit, ElementRef, AfterContentInit, Output,
    EventEmitter, OnDestroy, Directive, ViewContainerRef, ViewChild, ViewChildren, ContentChildren, QueryList,
    TemplateRef, ChangeDetectionStrategy, ViewEncapsulation
} from '@angular/core';

import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import { AfterViewInit } from '@angular/core';


@Directive({ selector: '[mpSlide]'})
export class SlidePlaceholderDirective {
    constructor(public templateRef: TemplateRef<any>, public viewContainer: ViewContainerRef) {
        console.log(' **SlidePlaceholder** ');
        // const context = {$implicit: rowData};
        // this.templateRef.createEmbeddedView(row.template, context);
    }
}
@Directive({ selector: '[mpSlidePlaceholder]'})
export class SliderPlaceholderDirective {
    constructor(public templateRef: TemplateRef<any>, public viewContainer: ViewContainerRef) {
        console.log('SliderPlaceholderDirective+++++');
    }
}

@Component({
    selector: 'mp-image-slide',
    template: `<ng-container *mpSlide></ng-container>`,
})
export class ImageSlideComponent implements AfterViewInit {
    @ViewChild(SlidePlaceholderDirective) slide: SlidePlaceholderDirective;
    constructor() {}
    ngAfterViewInit() {
        console.log('ImageSlideComponent: ' + this.slide);
    }
}

@Component({
    selector: 'mp-image-slider',
    templateUrl: './image-slider.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageSliderComponent implements AfterContentInit, OnDestroy, AfterViewInit {
    ul: HTMLElement;
    liWidth: number = 0;

    sliderViewportSize = 0;
    displayImages: any[] = [];
    slideTimeOut: any;
    sliderViewport: Element;

    mouseMoveSubscription: Subscription;

    touchStartX: number;
    swipeLength: number = 0;

    private touchDirection: string;
    private htmlElement: HTMLElement;
    index: number = 0;
    private resizeSubscription: Subscription;
    private currentSlidePosition: number;
    dragPercentage: number = 0;
    isLoading: boolean = false;

    @Input() minimumSwipe: number = 25;
    @Input() backgroundColor: string = 'transparent'; // '#383434';
    @Input() slideCaptionStyleClass: string = '';
    @Input() styleClass: string = '';

    @Input() nameField = 'name';
    @Input() srcField = 'src';
    @Input() descriptionField = 'description';
    @Input() transitionDuration: number = 200;
    @Input() images: any[] = [];
    @Input() slide: boolean = true;
    @Input() loop: boolean = false;
    @Input() balls: boolean = true;

    @Input('index') set _index(index) {
        this.index = -(index - 1);

    }
    @Input('images') set _images(images: Array<any>) {
        this.images = images.filter(() => true);
        this.initImages();
    }

    @Output() onSlideChange: EventEmitter<any> = new EventEmitter<any>();

    @ViewChildren(SliderPlaceholderDirective) sliderPlaceholders: QueryList<SliderPlaceholderDirective>;

    @ContentChildren(ImageSlideComponent) imageSlides: QueryList<ImageSlideComponent>;


    constructor(private elementRef: ElementRef) {
        this.isLoading = true;
    }

    private cancelTimeout() {
        if (this.slideTimeOut) {
            clearTimeout(this.slideTimeOut);
        }
    }

    isActive(index: number): boolean {
        return Math.abs(this.index) === index;
    }


    showLeft(): boolean {
        return this.index < -1;
    }
    showRight(): boolean {
        return Math.abs(this.index) < this.images.length
    }
    goToSlide(i: number) {
        this.index = -(i + 1);
        this.moveSlide();
    }

    goLeftClick(event: Event) {
        event.stopPropagation();
        this.goLeft();
    }

    goRightClick(event: Event) {
        event.stopPropagation();
        this.goRight();
        console.log('goRightClick: ' + this.sliderPlaceholders);
        console.log('goRightClick2: ' + this.imageSlides);

    }

    goLeft(transitionDuration?: number) {
        this.index++;
        this.cancelTimeout();
        this.moveSlide(transitionDuration);
    }

    goRight(transitionDuration?: number) {
        this.index--;
        this.cancelTimeout();
        this.moveSlide(transitionDuration);
    }

    moveSlide(transitionDuration?: number) {

        if (transitionDuration === undefined) {
            transitionDuration = this.transitionDuration;
        }
        this.transformSlide(this.liWidth * this.index, transitionDuration);
        let index: number = this.index;
        if (Math.abs(this.index) > this.images.length) {
            this.jumpToSlide(-1);

        } else if (this.index === 0) {
            this.jumpToSlide(-1 * (this.images.length));
        }
        index = Math.abs(this.index) - 1;


        this.onSlideChange.emit({
            index: index,
            val: this.images[index]
        });

    }

    transformSlide(translateXVal, transitionDuration?: number) {

        const value = `translateX(${translateXVal}px)`;
        this.ul.style.transform =  value;
        this.ul.style['-webkit-transform'] =  value;
        this.ul.style['-ms-transform'] =  value;
        if (transitionDuration !== undefined) {
            this.ul.style['transition-duration'] =  `${transitionDuration}ms`;
        } else {
            this.ul.style['transition-duration'] =  `0ms`;
        }

    }

    jumpToSlide(index) {
        this.index = index;
        this.slideTimeOut = setTimeout(() => {
            this.moveSlide(0);
        }, this.transitionDuration);
    }

    onDragStart(event: MouseEvent | TouchEvent) {
        event.stopPropagation();
        if (!this.slide ) {
            return;
        }
        if (event instanceof TouchEvent) {
            this.touchStartX = event.touches[0].clientX;
        } else {
            this.touchStartX  = event.clientX;
        }

        this.currentSlidePosition = this.liWidth * this.index;
    }

    onDragSlide(event: MouseEvent | TouchEvent) {
        event.stopPropagation();
        let touchEndX: number = 0;
        if (event instanceof TouchEvent) {
            touchEndX = event.touches[0].clientX;
        } else {
            touchEndX = event.clientX;
        }
        if (!this.slide) {
            return;
        }
        this.swipeLength = this.touchStartX - touchEndX;
        if (this.swipeLength < 0) {
            this.touchDirection = 'LEFT';
            if (!this.loop && this.index === -1) {
                this.swipeLength = 0;
            }
        }else if (this.swipeLength > 0) {
            this.touchDirection = 'RIGHT';
            if (!this.loop && this.index === -this.images.length) {
                this.swipeLength = 0;
            }
        }
        this.dragPercentage = (100 * this.swipeLength) / (this.liWidth / 2);
        this.transformSlide(this.currentSlidePosition - this.swipeLength);
    }

    onDragEnd(event: TouchEvent | MouseEvent) {
        if (!this.slide) {
            return;
        }
        if (this.swipedMoreThanMinimum()) {
            if (this.touchDirection === 'RIGHT') {
                this.goRight();
                this.touchDirection = '';
            }else if (this.touchDirection === 'LEFT') {
                this.goLeft();
                this.touchDirection = '';
            }
        } else {
            this.transformSlide(this.currentSlidePosition, this.transitionDuration);
        }

    }

    private swipedMoreThanMinimum(): boolean {
        return (Math.abs(this.dragPercentage) >= this.minimumSwipe);
    }

    attachInteractionEvents() {
        const mouseDownSubscription: Subscription = fromEvent(this.sliderViewport, 'mousedown').subscribe((event: MouseEvent) => {
            if (this.mouseMoveSubscription) {
                this.mouseMoveSubscription.unsubscribe();
            }
            this.onDragStart(event);
            this.mouseMoveSubscription = fromEvent(document, 'mousemove').subscribe((moveEvent: MouseEvent) => {
                this.onDragSlide(moveEvent)
            })
            const mouseUpSubscription: Subscription = fromEvent(document, 'mouseup').subscribe((upEvent: MouseEvent) => {
                this.mouseMoveSubscription.unsubscribe();
                mouseUpSubscription.unsubscribe();
                this.onDragEnd(upEvent);
            });
        })
    }

    initImages() {
        if (this.images && this.images.length > 0) {
            this.displayImages = [];
            this.displayImages.push(this.images[this.images.length - 1]);
            this.images.forEach(image => {
                this.displayImages.push(image);
            });
            this.displayImages.push(this.images[0]);

            this.init();
        }
    }

    setULSize() {
        if (!this.ul) {
            this.ul = this.htmlElement.querySelector('ul');
        }
        if (this.ul) {
            this.ul.style.width = `${this.sliderViewport.getClientRects()[0].width * this.displayImages.length}px`;
            this.liWidth = this.sliderViewport.getClientRects()[0].width;
        }
    }

    init(isResize?: boolean) {
        console.log('init: ' + this.imageSlides);
        this.htmlElement = this.elementRef.nativeElement;

        this.sliderViewport = this.htmlElement.querySelector('.slider-viewport');
        if (this.sliderViewport) {
            if (this.styleClass) {
                this.sliderViewport.classList.add(this.styleClass);
            }
            this.sliderViewportSize = this.sliderViewport.clientWidth;
            this.attachInteractionEvents();
            this.setULSize();
        }

        if (this.index > 0) {
            this.goRight(0);
        } else {
            this.goRight(0);
        }
        if (!this.resizeSubscription) {
            this.resizeSubscription = fromEvent(window, 'resize').subscribe((moveEvent) => {
                this.setULSize();
                this.moveSlide(0);
            });
        }
    }
    onload(event) {
        console.log(event);
    }
    ngOnDestroy() {
        if (this.resizeSubscription) {
            this.resizeSubscription.unsubscribe();
        }
    }

    ngAfterContentInit() {
        // this.init();
        // console.log('ngAfterContentInit: '+ this._slidePlaceholders);
        this.isLoading = false;
    }

    ngAfterViewInit() {
        console.log('ngAfterViewInit sliderPlaceholders: ' + this.sliderPlaceholders);
        this.sliderPlaceholders.forEach((placeHolder: SliderPlaceholderDirective, index: number) => {

            const context = {$implicit: this.images[index]};
            const templateRef: TemplateRef<any> = this.imageSlides.first.slide.templateRef;
            // ublic viewContainer: ViewContainerRef
            console.log(templateRef.elementRef.nativeElement);
            placeHolder.viewContainer.createEmbeddedView(templateRef, context);
            // placeHolder.

        });
        console.log('ngAfterViewInit2 imageSlides: ' + this.imageSlides);
        // console.log('ngAfterViewInit: '+ this._slidePlaceholders);
        // console.log('ngAfterViewInit: ');
        // // TODO(andrewseguin): Re-render the header when the header's columns change.
        // this.renderHeaderRow();
        //
        // // TODO(andrewseguin): Re-render rows when their list of columns change.
        // // TODO(andrewseguin): If the data source is not
        // //   present after view init, connect it when it is defined.
        // // TODO(andrewseguin): Unsubscribe from this on destroy.
        // this.dataSource.connect(this).subscribe((rowsData: any[]) => {
        //     // TODO(andrewseguin): Add a differ that will check if the data has changed,
        //     //   rather than re-rendering all rows
        //     this._rowPlaceholder.viewContainer.clear();
        //     rowsData.forEach(rowData => this.insertRow(rowData));
        //     this._changeDetectorRef.markForCheck();
        // });
    }
}

@Component({
    selector: 'mp-image-slides-balls',
    styleUrls: ['./image-slides-balls.component.scss'],
    template: `
        <ng-template ngFor let-image [ngForOf]="images" let-idx="index">
            <div class="ball" [style.width]="ballPercentage + '%'" (click)="ballClick(idx)"></div>
        </ng-template>
        <div class="index-ball" [style.width]="ballPercentage + '%'"></div>
        <div class="clearfix"></div>`
})
export class ImageSliderBallsComponent<T> implements AfterContentInit, OnInit {

    htmlElement: HTMLElement;
    indexBall: HTMLElement;
    dragPercentage: number = 0;
    index: number = 0;
    currentPercentage: number = 0;
    ballPercentage: number = 0;
    @Input() images: T[] = [];
    @Input() transitionDuration: number = 0;
    @Input('dragPercentage') set _dragPercentage(dragPercentage: number) {
        this.dragPercentage = dragPercentage / 2;
        if (this.indexBall) {
            this.indexBall.style['transition-duration'] = '0ms';
            this.indexBall.style.transform =  `translateX(${this.currentPercentage + this.dragPercentage}%)`;
        }
    }
    @Input('index') set _index(index) {
        this.index = Math.abs(index) - 1;
        if (this.indexBall) {
            this.indexBall.style['transition-duration'] = `${this.transitionDuration}ms`;
        }
        this.setIndexPosition();
    }

    @Output() ballClicked: EventEmitter<number> = new EventEmitter<number>();

    constructor(private elementRef: ElementRef) {}

    ngAfterContentInit() {
        this.htmlElement = this.elementRef.nativeElement;
        this.indexBall = <HTMLElement>this.htmlElement.querySelector('.index-ball');

        this.setIndexPosition();


    }

    ngOnInit() {
        this.ballPercentage = 100 / this.images.length;
    }

    setIndexPosition() {
        this.currentPercentage = 100 * this.index;
        if (this.indexBall) {
            this.indexBall.style.transform = `translateX(${this.currentPercentage}%)`;
            this.indexBall.style['transition-duration'] =  0;
        }
    }

    ballClick(index: number) {
        this.ballClicked.emit(index);
    }
}

@NgModule({
    declarations: [
        ImageSliderComponent,
        ImageSliderBallsComponent,
        SlidePlaceholderDirective,
        ImageSlideComponent,
        SliderPlaceholderDirective
    ],
    exports: [
        ImageSliderComponent,
        ImageSlideComponent,
        SlidePlaceholderDirective
    ],
    imports : [
        CommonModule,
    ]
})
export class MPImageSliderModule { }
