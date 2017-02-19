/**
 * Created by ruic on 18/02/2017.
 */

export interface FirabaseBaseModel {
    $key?:string;
}

export interface Blog extends FirabaseBaseModel{
    cdate?:string | Date;
    mdate?:string | Date;
    title?:string;
    content?:string;
    summary?:string;
}
export interface Settings extends FirabaseBaseModel{
    social?:any;
}

export interface Image extends FirabaseBaseModel{
    cdate?:string | Date;
    mdate?:string | Date;
    categories?: Array<string>;
    name?: string;
    url?:string;
    description?: string;
    featured?:boolean;
}

export interface Category extends FirabaseBaseModel{
    cdate?:string | Date;
    name?: string;
}