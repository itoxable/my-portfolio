/**
 * Created by ruic on 23/03/2016.
 */


/**
 * 
 * Model that tries to represent a current data request
 * 
 */
export class DataRequestModel {

    sort:string = '';
    sortDir:string = '';
    page:number = 0;
    pageSize:number = 10;

    /**
     *
     * Can be a number or a url
     *
     */
    totalItems:any;

    totalPages:number;
    data:Array<any>= [];
    pages:Array<Array<any>> = [];

    constructor(data?:any){
        if(data && data.totalItems){
            if(!(typeof data.totalItems === "string") && !(typeof data.totalItems === "number")){
                console.error("totalItems field must be of type number or string in case of an URL");
            }
        }

        (<any>Object).assign(this, data);
    }
}