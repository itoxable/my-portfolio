/**
 * Created by ruic on 18/02/2017.
 */

export interface FirabaseBaseModel {
    $exists?: () => any;
    $key?: string;
}

export interface Blog extends FirabaseBaseModel {
    cdate?: string | Date;
    mdate?: string | Date;
    title?: string;
    content?: string;
    summary?: string;
}
export interface Settings extends FirabaseBaseModel {
    social?: {[key: string]: string; };
    siteName?: string;
}

export interface ImageModel extends FirabaseBaseModel {
    cdate?: string | Date;
    mdate?: string | Date;
    categories?: Array<string>;
    name?: string;
    url?: string;
    description?:  string;
    featured?: boolean;
    width?: string;
    height?: string;
    displayWidth?: string;
    displayHeight?: string;
}

export interface Category extends FirabaseBaseModel {
    cdate?: string | Date;
    name?: string;
}

export interface GallerySettings extends FirabaseBaseModel {
    displayType?: string;
}
