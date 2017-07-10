/**
 * Created by ruic on 18/04/2017.
 */

import {
    TestBed,
    inject,
    async, ComponentFixture
} from '@angular/core/testing';
import {AppModule} from "../../app.module";
import {ImageSliderComponent} from "./image-slider.component";
import {ElementRef} from "@angular/core";

export class MockElementRef extends ElementRef {
    constructor(){
        super(null);
    }
}

describe('ImageSliderComponent', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule],
            providers: [
                ImageSliderComponent,
                {provide: ElementRef, useClass: MockElementRef}
            ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents();
    }));

    it('should be initialised', inject([ImageSliderComponent], (component) =>{
        expect(component).toBeTruthy();
    }));

});
