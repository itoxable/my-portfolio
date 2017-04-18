/**
 * Created by ruic on 04/04/2017.
 */

import {
    TestBed,
    inject,
    async, ComponentFixture
} from '@angular/core/testing';
import {AppModule} from "../../../app.module";
import {NoPermissionsComponent} from "./no-permissions.component";

describe('NoPermissionsComponent', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule],
            providers: [
                NoPermissionsComponent

            ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents();
    }));

    it('should be initialised', inject([NoPermissionsComponent], (component) =>{
        expect(component).toBeTruthy();
    }));

});