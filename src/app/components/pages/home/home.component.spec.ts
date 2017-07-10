/**
 * Created by ruic on 04/04/2017.
 */

import {
    TestBed,
    inject,
    async, ComponentFixture
} from '@angular/core/testing';
import {AppModule} from "../../../app.module";
import {HomeComponent} from "./home.component";

describe('HomeComponent', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule],
            providers: [
                HomeComponent
            ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents();
    }));

    it('should be initialised', inject([HomeComponent], (component) =>{
        expect(component).toBeTruthy();
    }));

});