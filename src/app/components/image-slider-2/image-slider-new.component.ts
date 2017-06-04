/**
 * Created by ruic on 25/05/2017.
 */

import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    ContentChildren,
    Directive,
    Input,
    QueryList,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation
} from '@angular/core';

@Component({
    selector: 'mp-image-sliderx',
    template: `
        <ng-container headerRowPlaceholder></ng-container>
        <ng-container rowPlaceholder></ng-container>
    `,
    host: {
        'class': 'image-sliderx',
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageSlider implements AfterViewInit{

    @Input() images: Array<any> = [];
    constructor() {}

    ngAfterViewInit() {
        this.images.forEach(image => {

        })

        // this.dataSource.connect(this).subscribe((rowsData: any[]) => {
        //     // TODO(andrewseguin): Add a differ that will check if the data has changed,
        //     //   rather than re-rendering all rows
        //     this._rowPlaceholder.viewContainer.clear();
        //     rowsData.forEach(rowData => this.insertRow(rowData));
        //     this._changeDetectorRef.markForCheck();
        // });
    }
}