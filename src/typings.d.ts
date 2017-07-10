/**
 * Created by ruic on 17/02/2017.
 */



interface EXIFStatic {
    getData(url: string, callback: any): any;
    getTag(img: any, tag: any): any;
    getAllTags(img: any): any;
    pretty(img: any): string;
    readFromBinaryFile(file: any): any;
}

declare var exif : EXIFStatic;
export = exif;



// declare module "fileSaver" {
//     var saveAs: any;
//     export = saveAs;
// }


// declare module "exif" {
//     var saveAs: any;
//     export = exif;
// }

interface flexImages {

}