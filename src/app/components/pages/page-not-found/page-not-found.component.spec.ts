/**
 * Created by ruic on 04/04/2017.
 */

import {
    TestBed,
    inject,
    async, ComponentFixture
} from '@angular/core/testing';
import {AppModule} from "../../../app.module";
import {PageNotFoundComponent} from "./page-not-found.component";

describe('PageNotFoundComponent', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule],
            providers: [
                PageNotFoundComponent

            ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents();
    }));

    it('should be initialised', inject([PageNotFoundComponent], (component) =>{
        expect(component).toBeTruthy();
    }));

});