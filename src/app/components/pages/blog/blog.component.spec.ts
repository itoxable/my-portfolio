/**
 * Created by ruic on 04/04/2017.
 */

import {
    TestBed,
    inject,
    async, ComponentFixture
} from '@angular/core/testing';
import {AppModule} from "../../../app.module";
import {BlogComponent} from "./blog.component";

describe('BlogComponent', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule],
            providers: [
                BlogComponent
            ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents();
    }));

    it('should be initialised', inject([BlogComponent], (component) =>{
        expect(component).toBeTruthy();
    }));

});