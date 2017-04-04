/**
 * Created by ruic on 04/01/2017.
 */

import {Component, ViewContainerRef, EventEmitter, Output, Input, AfterViewInit} from "@angular/core";
import {Subscription} from "rxjs";
import {fromEvent} from "rxjs/observable/fromEvent";


@Component({
    selector: 'mp-modal',
    moduleId: module.id,
    templateUrl: 'modal.component.html',
})

export class ModalComponent implements AfterViewInit{
    @Output() onClose:EventEmitter<any> = new EventEmitter<any>();
    @Output() onLoad:EventEmitter<any> = new EventEmitter<any>();
    @Input() showOverlay:boolean = true;
    @Input() resizeable:boolean = false;
    @Input() draggable:boolean = false;
    @Input() isLoading:boolean = false;
    @Output() onConfirm:EventEmitter<any> = new EventEmitter<any>();
    @Input() showFooter:boolean = true;
    @Input() showHeader:boolean = true;
    element:HTMLElement;
    modalSelector:string = '.modal';
    modal:Element;

    closeOnEsc:boolean = false;

    mobileView:boolean = false;
    clientHeight:number = -1;
    clientWidth:number = -1;

    mouseDraggSubscription:Subscription;

    startPosition:Array<number> = [];
    endPosition:Array<number> = [];

    modalContent:Element;

    parentSelector:string;
    parent:Element = document.body;

    constructor(private viewContainerRef: ViewContainerRef){
        this.element = viewContainerRef.element.nativeElement;
        this.mobileView = window.innerWidth < 993;
    }

    close(ev){
        if(ev){
            ev.stopPropagation()
        }
        this.onClose.emit(null);
    }


    showContent(){
        if(this.showOverlay){
            let backdrop:Element = this.modal.querySelector('.modal-backdrop');
            backdrop.classList.add('in');
        }
        this.modalContent = this.modal.querySelector('.modal-content');

        if(this.mobileView){
            this.modalContent.classList.add('opened');
        }else{

            this.clientHeight = this.modalContent.clientHeight;

            if(this.parentSelector){
                this.parent = document.querySelector(this.parentSelector);
            }
            if(this.parent.clientHeight < this.clientHeight){
                this.modalContent['style']['top'] = 0;
            }else{
                this.modalContent['style']['margin-top'] = (-(this.clientHeight/2))+'px';
            }

            this.clientWidth = this.modalContent.clientWidth;
            this.modalContent['style']['margin-left'] = (-(this.clientWidth/2))+'px';
            this.modalContent.classList.add('opened');

            if(this.closeOnEsc){
                let closeOnEscSubscription:Subscription = fromEvent(window, 'keydown').subscribe((event:KeyboardEvent) => {
                    if(event.keyCode === 27){
                        this.close(event);
                    }
                });
            }

            if(this.draggable){
                this.setDraggable();
            }

            if(this.resizeable){
                this.setResizeable();
            }
        }

        this.onLoad.emit({});


    }

    addResizeHandler(container:Element, handler:Element, ...styleClasses:string[]):Element{
        styleClasses.forEach((styleClass:string) => {
            handler.classList.add(styleClass);
        })
        container.appendChild(handler);
        return handler;
    }

    setResizeable(){

        let resizeHandleTop:HTMLElement = document.createElement("div");
        resizeHandleTop.classList.add('resize-handle', 'resize-handle-top');
        this.modalContent.appendChild(resizeHandleTop);

        let resizeHandleLeft:HTMLElement = document.createElement("div");
        resizeHandleLeft.classList.add('resize-handle', 'resize-handle-left');
        this.modalContent.appendChild(resizeHandleLeft);

        let resizeHandleRight:HTMLElement = document.createElement("div");
        resizeHandleRight.classList.add('resize-handle', 'resize-handle-right');
        this.modalContent.appendChild(resizeHandleRight);

        let resizeHandleBottom:HTMLElement = document.createElement("div");
        resizeHandleBottom.classList.add('resize-handle', 'resize-handle-bottom');
        this.modalContent.appendChild(resizeHandleBottom);

        let resizeHandleNE:HTMLElement = document.createElement("div");
        resizeHandleNE.classList.add('resize-handle', 'resize-handle-ne');
        this.modalContent.appendChild(resizeHandleNE);
        //
        let resizeHandleSE:HTMLElement = document.createElement("div");
        resizeHandleSE.classList.add('resize-handle', 'resize-handle-se');
        this.modalContent.appendChild(resizeHandleSE);

        let resizeHandleSW:HTMLElement = document.createElement("div");
        resizeHandleSW.classList.add('resize-handle', 'resize-handle-sw');
        this.modalContent.appendChild(resizeHandleSW);

        let resizeHandleNW:HTMLElement = document.createElement("div");
        resizeHandleNW.classList.add('resize-handle', 'resize-handle-nw');
        this.modalContent.appendChild(resizeHandleNW);

        this.addObservable(resizeHandleNE, (position)=>{
                let bottom:number = this.modal.getClientRects()[0].bottom - this.modalContent.getClientRects()[0].bottom;
                let right:number = this.modal.getClientRects()[0].right - this.modalContent.getClientRects()[0].right;
                this.setFixedSide('initial', right+'px', bottom+'px', 'initial');
            }, (dragDistance:Array<number>) => {
                this.modalContent['style']['max-width'] = 'none';
                this.modalContent['style']['height'] = (this.modalContent.getClientRects()[0].height - dragDistance[1])+'px';
                this.modalContent['style']['width'] = (this.modalContent.getClientRects()[0].width - dragDistance[0])+'px';
            }
        );
        this.addObservable(resizeHandleSE, (position)=>{
                let top:number = this.modal.getClientRects()[0].top + this.modalContent.getClientRects()[0].top;
                let right:number = this.modal.getClientRects()[0].right - this.modalContent.getClientRects()[0].right;
                this.modalContent['style']['margin-top'] = 0;
                this.setFixedSide(top+'px', right+'px', 'initial', 'initial');

            }, (dragDistance:Array<number>) => {
                this.modalContent['style']['max-width'] = 'none';
                this.modalContent['style']['height'] = (this.modalContent.getClientRects()[0].height + dragDistance[1])+'px';
                this.modalContent['style']['width'] = (this.modalContent.getClientRects()[0].width - dragDistance[0])+'px';
            }
        );
        this.addObservable(resizeHandleSW, (position)=>{
                let top:number = this.modalContent.getClientRects()[0].top;
                let left:number = this.modalContent.getClientRects()[0].left;
                this.modalContent['style']['margin-top'] = 0;
                this.modalContent['style']['margin-left'] = 0;
                this.setFixedSide(top+'px', 'initial', 'initial', left+'px');
            }, (dragDistance:Array<number>) => {
                this.modalContent['style']['max-width'] = 'none';
                this.modalContent['style']['height'] = (this.modalContent.getClientRects()[0].height + dragDistance[1])+'px';
                this.modalContent['style']['width'] = (this.modalContent.getClientRects()[0].width + dragDistance[0])+'px';
            }
        );
        this.addObservable(resizeHandleNW, (position)=>{
                let bottom:number = this.modal.getClientRects()[0].bottom-this.modalContent.getClientRects()[0].bottom;
                let left:number = this.modalContent.getClientRects()[0].left;
                this.modalContent['style']['margin-left'] = 0;
                this.setFixedSide('initial', 'initial', bottom+'px', left+'px');
            }, (dragDistance:Array<number>) => {
                this.modalContent['style']['max-width'] = 'none';
                this.modalContent['style']['height'] = (this.modalContent.getClientRects()[0].height - dragDistance[1])+'px';
                this.modalContent['style']['width'] = (this.modalContent.getClientRects()[0].width + dragDistance[0])+'px';
            }
        );


        this.addObservable(resizeHandleTop, (position)=>{
                let bottom:number = this.modal.getClientRects()[0].bottom-this.modalContent.getClientRects()[0].bottom;
                this.setFixedSide('initial', null, bottom+'px', null);

            }, (dragDistance:Array<number>) => {
                this.modalContent['style']['height'] = (this.modalContent.getClientRects()[0].height - dragDistance[1])+'px';
            }
        );
        this.addObservable(resizeHandleLeft, (position)=>{
                let right:number = this.modal.getClientRects()[0].right-this.modalContent.getClientRects()[0].right;
                this.setFixedSide(null, right+'px', null, 'initial');

            }, (dragDistance:Array<number>) => {
                this.modalContent['style']['max-width'] = 'none';
                let currentWidth:number = this.modalContent.getClientRects()[0].width;
                this.modalContent['style']['width'] = (this.modalContent.getClientRects()[0].width - dragDistance[0])+'px';
            }
        );
        this.addObservable(resizeHandleRight, (position)=>{
                let left:number = this.modalContent.getClientRects()[0].left - this.modal.getClientRects()[0].left;
                this.setFixedSide(this.modalContent.getClientRects()[0].top+'px', 'initial', null, left+'px');

                this.modalContent['style']['margin-left'] = 0;
                this.modalContent['style']['margin-top'] = 0;

            }, (dragDistance:Array<number>) => {
                let currentWidth:number = this.modalContent.getClientRects()[0].width;
                this.modalContent['style']['max-width'] = 'none';
                this.modalContent['style']['width'] = (this.modalContent.getClientRects()[0].width  + dragDistance[0])+'px';
            }
        );
        this.addObservable(resizeHandleBottom, (position)=>{
                let top:number = this.modalContent.getClientRects()[0].top;
                this.modalContent['style']['margin-top'] = 0;
                this.setFixedSide(top+'px', null, 'initial', null);
            }, (dragDistance:Array<number>) => {
                this.modalContent['style']['height'] = (this.modalContent.getClientRects()[0].height + dragDistance[1])+'px';
            }
        );

    }
    setFixedSide(top:string, right:string, bottom:string, left:string){
        if(top){
            this.modalContent['style']['top'] = top;
        }
        if(right){
            this.modalContent['style']['right'] = right;
        }
        if(bottom){
            this.modalContent['style']['bottom'] = bottom;
        }
        if(left){
            this.modalContent['style']['left'] = left;
        }
    }

    addObservable(htmlElement:Element, preAction:Function, action:Function, actionFinish?:Function){
        let lastPosition:Array<number> = [];
        htmlElement.addEventListener('mousedown', (event:MouseEvent) => {
            event.stopPropagation();
            event.preventDefault();
            lastPosition = [event.pageX, event.pageY];
            this.stopMovement(event, this.mouseDraggSubscription);
            preAction(lastPosition);
            let mouseMoveSubscription:Subscription = fromEvent(document, 'mousemove').subscribe((event:MouseEvent) => {
                let dragDistance:Array<number> = [event.pageX - lastPosition[0], event.pageY - lastPosition[1]];
                action(dragDistance)
                lastPosition = [event.pageX, event.pageY];
            });
            let mouseUpSubscription:Subscription = fromEvent(document, 'mouseup').subscribe((event:MouseEvent) => {
                this.stopMovement(event, mouseMoveSubscription);
                mouseUpSubscription.unsubscribe();
                if(actionFinish){
                    actionFinish(lastPosition);
                }
            });
        })
    }

    setDraggable(){
        let lastPosition:Array<number> = [];
        this.modalContent.addEventListener('mousedown', ((event: MouseEvent) => {
            event.stopPropagation();
            lastPosition = [event.pageX, event.pageY];

            this.modalContent['style']['left'] = (this.modalContent.getClientRects()[0].left)+'px';
            this.modalContent['style']['top'] = (this.modalContent.getClientRects()[0].top)+'px';

            this.modalContent['style']['margin-left'] = 0;
            this.modalContent['style']['margin-top'] = 0;

            this.mouseDraggSubscription = fromEvent(document, 'mousemove').subscribe((event:MouseEvent) => {
                let dragDistance:Array<number> = [event.pageX - lastPosition[0], event.pageY - lastPosition[1]];
                this.modalContent['style']['left'] = (Math.round(this.modalContent.getClientRects()[0].left + dragDistance[0]))+'px';
                this.modalContent['style']['top'] = (Math.round(this.modalContent.getClientRects()[0].top + dragDistance[1]))+'px';
                lastPosition = [event.pageX, event.pageY];
            });

            let mouseUpSubscription:Subscription = fromEvent(document, 'mouseup').subscribe((event:MouseEvent) => {
                this.stopMovement(event, this.mouseDraggSubscription);
                mouseUpSubscription.unsubscribe();
            });
        }).bind(this));

    }

    stopMovement(event:MouseEvent, mouseSubscription:Subscription){
        if(mouseSubscription){
            mouseSubscription.unsubscribe();
        }
    }

    ngAfterViewInit(){
        if(!this.modal){
            this.modal = this.element.querySelector(this.modalSelector);
            if(this.modal){
                this.modal.classList.add('open');
            }
        }
        setTimeout(()=>{
            this.showContent();
        },0);
    }




    // confirm(){
    //     this.onConfirm.emit({});
    // }
    //
    // ngAfterViewInit(){
    //     // super.ngAfterViewInit();
    //     this.onLoad.emit({});
    // }
}
