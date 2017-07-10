/**
 * Created by ruic on 05/04/2016.
 */

import { Component, Input,EventEmitter, Output } from '@angular/core';


@Component({
    selector: 'mp-data-table-pagination-control',
    moduleId: module.id,
    templateUrl: 'data-table-pagination-control.component.html',
})

export class DataTablePaginationControlComponent{
    totalItems:number;

    @Input('totalItems') set _totalItems(totalItems:number) {
        this.totalItems = totalItems;
        this.init();
    }

    @Input() pagination:DataTablePaginationModel = new DataTablePaginationModel();

    pageSize:number = 0;

    @Input('pageSize') set _pageSize(pageSize:number) {
        this.pageSize = pageSize;
        this.init();
    }

    @Input() set reset(data) {
        this.currentPage = 0;
        this.getPagesInterval();
        this.init();
    }
    
    @Output() goToPageEvent: EventEmitter<number> = new EventEmitter<number>();
    @Output() changePageSizeEvent: EventEmitter<number> = new EventEmitter<number>();

    @Input() currentPage:number = 0;
    totalPages:number = 0;

    constructor(){ }

    goToPage(pageNr:number){
        this.currentPage = pageNr;
        this.getPagesInterval();
        this.goToPageEvent.emit(this.currentPage);
    }

    goToPrevious(){
        if(this.currentPage > 0){
            this.goToPage(this.currentPage - 1);
        }
    }

    goToFirst(){
        if(this.currentPage > 0){
            this.goToPage(0);
        }
    }

    goToLast(){
        if(this.currentPage < (this.totalPages - 1)) {
            this.goToPage(this.totalPages - 1);
        }
    }

    goToNext(){
        if(this.currentPage < (this.totalPages - 1)) {
            this.goToPage(this.currentPage + 1);
        }
    }

    getPageLegend(){
        return this.pagination.legendTemplate.replace(/{CURRENT_PAGE}/g, String(this.currentPage + 1))
            .replace(/{CURRENT_NR_OF_PAGES}/g, String(this.totalPages))
            .replace(/{TOTAL_ITEMS}/g, String(this.totalItems))
            .replace(/{CURRENT_NR_ITEMS}/g, "this.data.length");
    }

    getPagesInterval(){
        this.pagination.pagesOnDisplay = [];
        let start:number;
        let end:number;

        if(this.totalPages < this.pagination.paginationNumbersSize){
            start = 0;
            end = this.totalPages;

        }else{
            let dif = Math.floor(this.pagination.paginationNumbersSize / 2);
            let maxDisplay:number = this.currentPage + dif;


            if((maxDisplay + 1) <= this.pagination.paginationNumbersSize){
                start = 0;
                end = this.pagination.paginationNumbersSize;
            }else if(maxDisplay >= this.totalPages){
                start = this.totalPages-this.pagination.paginationNumbersSize;
                end = this.totalPages;
            }else{
                start = this.currentPage - dif;
                end = maxDisplay+1;

            }
        }
        for(let i = start; i < end; i++){
            this.pagination.pagesOnDisplay.push(i);
        }
    }

    changePageSize(ev){
        this.pageSize = parseInt(ev.target.value);
        this.init();
        this.changePageSizeEvent.emit(this.pageSize);
    }

    init(){

        if(!(this.pagination.pageSizes.find(item => {return item == this.pageSize}))){
            this.pagination.pageSizes.push(this.pageSize);
        }

        this.pagination.pageSizes.sort((a, b) => {return a - b});


        if(this.pageSize == 0){
            this.totalPages = 1;
        }else{
            this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        }
        if(this.totalPages > 1){
            this.getPagesInterval();
        }

    }

}

export class DataTablePaginationModel {

    showPagination:boolean = true;

    showPageSizeSelection:boolean = true;

    /**
     * Array with available page sizes e.g.:[5, 10, 15, 20]
     * @type {Array}
     */
    pageSizes:Array<number> = [];

    showPaginationNumbers:boolean = true;

    /**
     * Number of numbers displayed on pagination e.g.: 3 => (3,4,5); 5 => (3,4,5,6,7)
     * @type {number}
     */
    paginationNumbersSize:number = 5;

    showPaginationArrows:boolean = true;

    showPaginationFirstLast:boolean = true;

    paginationFirstLabel:string = "First";

    paginationLastLabel:string = "Last";

    paginationStyleClass:string = '';

    showLegend:boolean = true;

    hideWhenEmpty:boolean = false;

    legendTemplate:string = "Page {CURRENT_PAGE} of {CURRENT_NR_OF_PAGES} ({TOTAL_ITEMS} Results)";

    /**
     * This parameter shouldn't be set, it's just for internal use
     * @type {Array}
     */
    pagesOnDisplay:Array<number> = [];

    constructor(data?:any){
        if(data){
            Object.assign(this, data);
        }

    }

}