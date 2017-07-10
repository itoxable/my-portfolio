/**
 * Created by ruic on 04/04/2017.
 */

import {
    TestBed,
    inject,
    async, ComponentFixture
} from '@angular/core/testing';
import {AppModule} from "../../../app.module";
import {AboutComponent} from "./about.component";

describe('AboutComponent', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule],
            providers: [
                AboutComponent
            ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents();
    }));

    it('should be initialised', inject([AboutComponent], (component) =>{
        expect(component).toBeTruthy();
    }));

});