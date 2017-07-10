/**
 * Created by ruic on 04/04/2017.
 */

import {
    TestBed,
    inject,
    async, ComponentFixture
} from '@angular/core/testing';
import {AppModule} from "../../../app.module";
import {EditPortfolioComponent} from "./edit-portfolio.component";

describe('EditPortfolioComponent', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule],
            providers: [
                EditPortfolioComponent
            ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents();
    }));

    it('should be initialised', inject([EditPortfolioComponent], (component) =>{
        expect(component).toBeTruthy();
    }));

});