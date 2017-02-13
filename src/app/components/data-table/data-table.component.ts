/**
 * Created by ruic on 24/02/2016.
 */


import {Component, Input, EventEmitter, Output, OnDestroy} from '@angular/core';
import {Http, Response} from "@angular/http";

import {DataTablePaginationModel} from "./data-table-pagination-control.component";
import {DataRequestModel} from "../../models/data-request.model";
import {Subscription} from "rxjs";


@Component({
    selector: 'mp-data-table',
    moduleId: module.id,
    templateUrl: 'data-table.component.html'
})

export class DataTableComponent implements OnDestroy{
    ASCENDING:string = "asc";
    DESCENDING:string = "desc";

    private isStatic:boolean = false;

    totalItems:number;

    data:Array<any> = [];

    dataTable:DataTableModel;

    errorMessage:string;

    infoMessage:string;
    isLoading:boolean = true;
    private errorMessageTimeout:any;
    private infoMessageTimeout:any;
    instantErrorMessage:string;
    initialized:boolean = false;
    isFiltering:boolean = false;
    originalData:Array<any> = [];
    filters:any = {};

    @Input('dataTable') set _dataTable(dataTable:DataTableModel) {
        this.data = [];
        this.dataTable = dataTable;
        this.totalItems = 0;
        this.init();
    }

    @Input('data') set _data(data:any) {
        this.totalItems = 0;
        if(data && Object.keys(data).length > 0){
            this.setTableData(data);
            this.dataTable.data = data;
            this.init();
        }
    }

    @Output() selectEvent: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();
    @Output() selectItemEvent: EventEmitter<any> = new EventEmitter<any>();

    @Output() onDataChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() onError: EventEmitter<any> = new EventEmitter<any>();
    @Output() onRefresh: EventEmitter<any> = new EventEmitter<any>();

    private previousSelectionIndex:number = -1;

    originalSortDir:string;
    originalSortField:string;
    sortSet:boolean = false;

    getDataSubscription:Subscription;
    getTotalItemsSubscription:Subscription;

    constructor(private http: Http){
    }

    setDataTable(dataTable:DataTableModel) {
        this.dataTable = dataTable;
        this.init();
    }

    select(item){
        this.selectItemEvent.emit(item);
    }
    /**
     *
     * @param event
     */
    toggleSelectRows(event){
        if(event.target.checked){
            this.data.forEach(item => item.isSelected = true);
        }else{
            this.data.forEach(item => item.isSelected = false);
        }
        this.selectEvent.emit(this.data);
    }

    /**
     *
     * @param index
     */
    toggleSelectRow(index:number, action:string){

        if(this.data[index].isSelected && this.data[index].isSelected == true){
            this.data[index].isSelected = false;
        }else{
            this.data[index].isSelected = true;
        }

        if(!this.dataTable.multipleSelect){

            if(this.previousSelectionIndex > -1 && this.previousSelectionIndex != index){
                this.data[this.previousSelectionIndex].isSelected = false;
            }
            this.previousSelectionIndex = index;

        }

        this.selectEvent.emit([this.data[index]]);
    }

    /**
     *
     * @param pageNr
     */
    goToPage(pageNr:number){
        this.dataTable.dataRequestModel.page = pageNr;
        this.getData();
    }

    /**
     *
     * @param size
     */
    changePageSize(size){
        this.dataTable.dataRequestModel.pageSize = parseInt(size);
        this.setTableData([]);
        this.dataTable.dataRequestModel.page = 0;
        this.buildTable();
    }

    /**
     *
     * @returns {boolean}
     */
    private isPageable():boolean{
        if(typeof this.dataTable.data === 'string'){
            let url:string = this.dataTable.data;
            let result:boolean = ((url.indexOf("{START}") > -1) || (url.indexOf("{END}") > -1) || (url.indexOf("{SORT}") > -1) || (url.indexOf("{PAGE}") > -1) || (url.indexOf("{PAGESIZE}") > -1));
            return result;
        }
        return false;
    }

    /**
     *  Gets data either form a provided array or a provided URL
     *
     *
     */
    private getData(){
        if(this.dataTable.dataRequestModel.pages.length == 0){
            this.initialized = true;
            this.showLoading(false);
            return;
        }
        this.showLoading(true);
        if(!this.dataTable.pageCaching || this.dataTable.dataRequestModel.pages[this.dataTable.dataRequestModel.page].length == 0){
            if(this.isStatic){
                this.getArrayData();
            }else{
                this.getServerData(data => this.processData(data));
            }
        }else{
            this.setTableData(this.dataTable.dataRequestModel.pages[this.dataTable.dataRequestModel.page]);
        }
    }

    /**
     *
     */
    private getArrayData(){
        var first = this.dataTable.dataRequestModel.page * this.dataTable.dataRequestModel.pageSize;
        var last = ((this.dataTable.dataRequestModel.page + 1) * ( this.dataTable.dataRequestModel.pageSize));
        this.setTableData(this.dataTable.data.slice(first, last));
    }

    /**
     * Gets remote data with the provided URL in 'this.dataTable.data' and performs the callback function on server response
     *
     *
     * @param callback
     */
    private getServerData(callback:Function){

        let url = this.dataTable.data;

        let start:number = this.dataTable.dataRequestModel.pageSize * this.dataTable.dataRequestModel.page;
        let end:number = start+this.dataTable.dataRequestModel.pageSize;

        let isPageable:boolean = this.isPageable();
        if(isPageable){
            url = url.replace(/{START}/g, start);
            url = url.replace(/{END}/g, end);
            url = url.replace(/{SORT}/g, this.dataTable.dataRequestModel.sort);
            url = url.replace(/{SORT_DIR}/g, this.dataTable.dataRequestModel.sortDir);
            url = url.replace(/{PAGE}/g, this.dataTable.dataRequestModel.page);
            url = url.replace(/{PAGESIZE}/g, this.dataTable.dataRequestModel.pageSize);
        }

        if(callback){
            callback.bind(this);
        }
        this.getDataSubscription = this.http.get(url,{ headers: this.dataTable.httpHeaders }).map(res => res.json()).subscribe(data => {callback(data)}, err => this.processErrorMessages(err));

    }

    //TODO: To be improved
    processErrorMessages(err:Response){
        this.showLoading(false);
        console.warn(err);
        this.onError.emit(err);
        let errorBody = {};
        if(this.dataTable.errorMessage){
            errorBody['message'] = this.dataTable.errorMessage;
        }else{
            try{
                errorBody = JSON.parse(err['_body']);
            }catch(e){
                errorBody['message'] = 'Error getting table data';
            }
        }
        this.showErrorMessage(errorBody['error_description'] || errorBody['message']);
    }

    showErrorMessage(message:string){
        this.showLoading(false);
        this.errorMessage = message;
    }

    showInstantErrorMessage(message:string){
        if(this.errorMessageTimeout){
            clearTimeout(this.errorMessageTimeout);
        }
        this.instantErrorMessage = message;
        this.errorMessageTimeout = setTimeout(() => {
            this.instantErrorMessage = null;
        }, 3000);
    }
    
    showInfoMessage(message:string){
        if(this.infoMessageTimeout){
            clearTimeout(this.infoMessageTimeout);
        }
        this.infoMessage = message;
        this.infoMessageTimeout = setTimeout(() => {
            this.infoMessage = null;
        }, 3000);
    }
    
    
    /**
     *
     * @param data
     */
    private processData(data){
        data = this.getDataFormDataArrayField(data);
        this.setTableData(data);
        this.dataTable.dataRequestModel.pages[this.dataTable.dataRequestModel.page] = data;
    }

    private getObjectField(data, field:string){
        let returnData = data;
        let fieldsArray:Array<any> = field.split('.');

        for (let i = 0; i < fieldsArray.length; i++) {
            returnData = returnData[fieldsArray[i]];
            if (returnData === undefined) {
                break;
            }
        }
        return returnData;
    }

    private getDataFormDataArrayField(data){
        let returnData = data;
        if(this.dataTable.dataArrayField && this.dataTable.dataArrayField !="") {
            if (this.dataTable.dataArrayField.indexOf('.') < 0) {
                return returnData[this.dataTable.dataArrayField];
            }
            returnData = this.getObjectField(returnData, this.dataTable.dataArrayField);
        }
        return returnData;
    }

    /**
     *
     * @param item
     * @param column
     * @returns {any}
     */
    private getValue(item, column:ColumnModel){
        if(column.pipe){
            if(column.pipeFromObject) {
                return column.pipe.transform(item, column.pipeArg);
            }else{
                return column.pipe.transform(this.getObjectField(item, column.field), column.pipeArg);
            }
        }
        return this.getObjectField(item, column.field);

    }

    /**
     * Determines what's the total items
     *
     * depending on the 'this.dataTable.dataRequestModel.totalItems' value  emits an event with the total items:
     *  - if the value is a number immediately emits an event with the total items
     *  - if is undefined but the array, 'this.dataTable.data', was passed emits an event with array length
     *  -
     *
     * @param eventEmitter
     */
    private getTotalItems(eventEmitter:EventEmitter<number>){

        if((typeof this.dataTable.dataRequestModel.totalItems === "undefined")) {
            if(this.isStatic){
                eventEmitter.emit(this.dataTable.data.length);
            }else{
                if(typeof this.dataTable.data === "string"){
                    this.getServerData(data => {

                        let tableData = this.getDataFormDataArrayField(data);
                        if(tableData){
                            let totalItems = tableData.length;
                            if(this.dataTable.totalItemsField != undefined){
                                totalItems = this.getObjectField(data, this.dataTable.totalItemsField);
                                this.isStatic = false;
                                this.setTableData(tableData);
                            }else{
                                this.dataTable.data = tableData;
                                this.isStatic = true;
                            }
                            eventEmitter.emit(totalItems);
                        }else{
                            this.showErrorMessage(`There is no field '${this.dataTable.dataArrayField}'`)
                        }

                    });

                }else{
                    let data = this.dataTable.data;
                    this.dataTable.data = [];

                    this.dataTable.data = this.getDataFormDataArrayField(data);
                    if(this.dataTable.data) {
                        this.isStatic = true;

                        eventEmitter.emit(this.dataTable.data.length);
                    }else{
                        this.showErrorMessage(`There is no field '${this.dataTable.dataArrayField}'`)
                    }
                }
            }

        }else if((typeof this.dataTable.dataRequestModel.totalItems === "number")) {

            eventEmitter.emit(this.dataTable.dataRequestModel.totalItems);

        }else{
            this.getTotalItemsSubscription= this.http.get(this.dataTable.dataRequestModel.totalItems,{}).map(res => res.json()).subscribe(data => {eventEmitter.emit(data)}, err => this.processErrorMessages(err));
        }
    }

    sort(column:ColumnModel, colIndex:number){
        this.dataTable.columns.forEach((col:ColumnModel, index:number) => {
            if(colIndex != index){
                col['isSorting'] = false;
                col['sortDir'] = null;
            }
        });

        if(column['isSorting']){
            if(column['sortDir'] == this.ASCENDING){
                column['sortDir'] = this.DESCENDING;
            }else{
                column['isSorting'] = false;
            }
        }else{
            column['isSorting'] = true;
            column['sortDir'] = this.ASCENDING;
        }

        if(!column['isSorting']){
            if(this.isStatic){
                this.dataTable.data = [];
                this.dataTable.data =  this.originalData.filter(()=> {return true;})
            }else{
                this.dataTable.dataRequestModel.sortDir = this.originalSortDir;
                this.dataTable.dataRequestModel.sort = this.originalSortField;
            }
            this.reset();
        }else {

            if(this.isStatic){
                this.dataSort(column);
            }else{
                let sortField:string = column.sortField || column.field;
                if(sortField){
                    this.dataTable.dataRequestModel.sortDir = column['sortDir'];
                    this.dataTable.dataRequestModel.sort = sortField;
                }
            }
            this.reset();
        }
    }

    isSorting():boolean{
        for(let i = 0; i < this.dataTable.columns.length; i++){
            if(this.dataTable.columns[i]['isSorting']){
                return true;
            }
        }
       return false;
    }

    private reset(){
        this.data = [];
        this.totalItems = 0;
        this.init();
        this.dataTable.dataRequestModel.page = 0;
    }

    private dataSort(column:ColumnModel){
        this.dataTable.data.sort((a, b) => {
            let valA:string = String(this.getValue(a, column));
            let valB:string = String(this.getValue(b, column));

            let numA:number = parseInt(valA);
            let numB:number = parseInt(valB);

            if(isNaN(numA) || isNaN(parseInt(valB))){
                if(column['sortDir'] == this.ASCENDING){
                    return valA.localeCompare(valB);
                }
                return valB.localeCompare(valA);
            }else{
                if(column['sortDir'] == this.ASCENDING){
                    return numA - numB;
                }
                return numB - numA;
            }
        });
    }

    getFilter(column:ColumnModel):FilterModel{
        return this.filters[column.field];
    }

    setFilter(column:ColumnModel, filterValue:string):FilterModel{
        filterValue = filterValue.toLowerCase();
        let filter:FilterModel = this.filters[column.field];
        if(!filter){
            if(filterValue){
                filter = {
                    column: column,
                    filterValue: filterValue
                };
                this.filters[column.field] = filter;
            }
        }else{
            if(filterValue){
                filter.column = column;
                filter.filterValue = filterValue;
            }else{
                delete this.filters[column.field];
                return null;
            }
        }
        return filter;
    }

    filterStatic(){
        let data:Array<any> = [];
        data = this.originalData.filter(item => {return true});
        if(this.filters){
            this.isFiltering = true;
            for(let key in this.filters){
                let filter:FilterModel = this.filters[key];
                if(filter.column.filterFunction){
                    data = filter.column.filterFunction(filter.column, event.currentTarget['value'], data);
                }else{
                    data = data.filter(dataRow => {
                        let value:string = this.getValue(dataRow, filter.column);
                        if(value){
                            return value.toLowerCase().indexOf(filter.filterValue.toLowerCase()) > -1;
                        }
                        return false;
                    })
                }
            }
        }else{
            this.isFiltering = false;
        }
        this.data = [];
        this.dataTable.data = data;
        this.totalItems = 0;
        this.init();
    }


    filterCurrentPage() {
        let data:Array<any> = [];
        data = this.originalData.filter(item => {return true});
        if(this.filters){
            this.isFiltering = true;
            for(let key in this.filters){
                let filter:FilterModel = this.filters[key];
                if(filter.column.filterFunction){
                    data = filter.column.filterFunction(filter.column, event.currentTarget['value'], data);
                }else{
                    data = data.filter(dataRow => {
                        let value:string = this.getValue(dataRow, filter.column);
                        return (value.trim().toLowerCase().startsWith(filter.filterValue))
                    })
                }
            }
            this.data = data;
        }
    }

    filterTable(column:ColumnModel, filterValue:string) {
        column.filterValue = filterValue;

        this.setFilter(column, filterValue);

        if (this.isStatic) {
            this.filterStatic();
        } else {
            this.filterCurrentPage();
        }
    }

    /**
     *
     */
    buildTable(){
        this.dataTable.dataRequestModel.totalPages = Math.ceil(this.totalItems / this.dataTable.dataRequestModel.pageSize);
        this.dataTable.dataRequestModel.pages = [];
        for(let i = 0; i < this.dataTable.dataRequestModel.totalPages; i++) {
            this.dataTable.dataRequestModel.pages[i] = [];
        }
        if(this.data.length == 0){
            this.getData();
        }else{
            this.dataTable.dataRequestModel.pages[this.dataTable.dataRequestModel.page] = this.data;
        }
    }

    showLoading(state:boolean){
        this.isLoading = state;
    }

    setTableData(tableData:Array<any> = []){
        this.initialized = true;
        //tableData:Array<any>
        if(this.dataTable.liveScroll){
            this.data = this.data.concat(tableData);
        }else{
            this.data = tableData || [];

        }

        if((this.data && this.data.length > 0) && (!this.dataTable.columns || this.dataTable.columns.length == 0)){
            let dataElement = this.data[1];
            this.dataTable.columns = [];
            this.dataTable.columns = Object.keys(dataElement).map(function(key){ return { field:key, displayName:key } })
        }
        this.onDataChange.emit(this.data);
        if(!this.isStatic){
            this.originalData = this.data.filter(item => {return true});
        }
        this.showLoading(false);
    }

    isDataEmpty():boolean{
        return (!this.data || this.data.length == 0) && !this.isFiltering;
    }

    hasFilter():boolean{
        for(let i = 0; i < this.dataTable.columns.length; i++){
            if(this.dataTable.columns[i].filter){
                return true;
            }
        }
        return false;
    }

    private init(){

        this.errorMessage = null;
        this.initialized = false;
        this.showLoading(true);
        if(this.dataTable && this.dataTable.data){
            if(!this.sortSet){
                this.originalSortDir = this.dataTable.dataRequestModel.sortDir;
                this.originalSortField = this.dataTable.dataRequestModel.sort;
                this.sortSet = true;
            }

            this.isStatic =  (this.dataTable.data instanceof Array);
            var eventEmitter:EventEmitter<number> = new EventEmitter<number>();
            eventEmitter.subscribe(totalItems =>{
                this.totalItems = totalItems;
                this.buildTable();

                if(this.isStatic && !this.isFiltering && !this.isSorting()){
                    this.originalData = this.dataTable.data.filter(item => {return true});
                }

            });
            this.getTotalItems(eventEmitter);
        }

    }
    setToEdit(column, item){
        if(column.editable){
            console.log('TODO');
        }
    }
    refresh(){
        this.data = [];
        this.onRefresh.emit(true);
    }

    ngOnDestroy(){
        this.cancelGetRequest();
    }

    cancelGetRequest(){
        if(this.getTotalItemsSubscription){
            this.getTotalItemsSubscription.unsubscribe();
        }
        if(this.getDataSubscription){
            this.getDataSubscription.unsubscribe();
        }
    }
    loadMore(){
        if((this.dataTable.dataRequestModel.page + 1) < this.dataTable.dataRequestModel.totalPages){
            this.dataTable.dataRequestModel.page++;
            this.getData();
        }
        console.log(this.dataTable.dataRequestModel.totalPages);
        console.log(this.dataTable.dataRequestModel.page);
        // this.dataTable.dataRequestModel.page++;
        console.log(this.dataTable.dataRequestModel.page);
        console.log("---------");
        // this.getData();
    }
    onScroll(ev){

        let target = ev.currentTarget;
        let safeGap:number = 10;

        console.log("scrollTop: "+target.scrollTop);
        console.log("offsetHeight: "+target.offsetHeight);
        console.log("scrollHeight: "+target.scrollHeight);

        if ((target.scrollTop + target.offsetHeight) >= (target.scrollHeight-safeGap)){

            this.loadMore();

            // goToPage(pageNr:number){
            //     this.dataTable.dataRequestModel.page = pageNr;
            //     this.getData();
            // }

            // if(action === 'postcodes'){
            //     this.searchAndReportState.postcodesScroll = target.scrollTop;
            //     if(this.hasNoMoreItems(this.searchAndReportState.currentSearchModels['postcodes'])) {
            //         return;
            //     }
            //     let nextPage:string = String(parseInt(this.searchAndReportState.currentSearchModels['postcodes'].number) + 1);
            //     this.searchService.findPostcodes(this.searchAndReportState.query, nextPage).subscribe(result => this.transformPostcodeResult(result), err => this.searchPostcodeError(err));
            // }else if(action === 'streets'){
            //     this.searchAndReportState.streetsScroll = target.scrollTop;
            //     if(this.hasNoMoreItems(this.searchAndReportState.currentSearchModels['streets'])) {
            //         return;
            //     }
            //     let nextPage:string = String(parseInt(this.searchAndReportState.currentSearchModels['streets'].number) + 1);
            //     this.searchService.findStreets(this.searchAndReportState.query, nextPage).subscribe(result => this.transformStreetResult(result), err => this.searchStreetError(err));
            // }else if(action === 'lpis'){
            //
            // }
        }
    }

}

export class DataTableModel {

    /**
     * Table caption
     */
    caption:string;

    /**
     * If the total items are part
     */
    totalItemsField:string;

    noDataMessage:string = "Empty table";
    noDataMessageStyleClass:string = '';

    wrapperStyleClass:string;
    tableStyleClass:string;

    selectable:boolean = false;
    showSelectAll:boolean = true;

    selectionType:string;
    multipleSelect:boolean = true;
    refreshButton:boolean = false;
    errorMessage:string;

    liveScroll:boolean = false;

    /**
     *
     * @type {Array}
     */
    columns:Array<ColumnModel> = [];

    /**
     *
     */
    dataRequestModel:DataRequestModel = new DataRequestModel();// = new DataRequestModel({pageSize: 0});

    pageCaching:boolean = true;


    data:any;
    dataArrayField:string;
    httpHeaders:any;

    pagination:DataTablePaginationModel = new DataTablePaginationModel();
    showHeader:boolean = true;

    constructor(data?:any){
        Object.assign(this, data);
    }

}
export interface ColumnModel {
    field?:string;
    displayName?:string;
    pipeFromObject?:boolean;
    pipe?:any;
    pipeArg?:any;
    sortable?:boolean;
    sortField?:string;
    filterValue?:string;
    filter?:boolean;
    actionType?:string;
    actionIcon?:string;
    editable?:boolean;
    columnClass?:string;
    width?:string | number;
    filterFunction?: (column:ColumnModel, filterValue:string, dataArray:Array<any>) => Array<any>;
}

export interface FilterModel {
    column:ColumnModel;
    filterValue: string;
}