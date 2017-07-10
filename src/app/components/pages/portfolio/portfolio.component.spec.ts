/**
 * Created by ruic on 04/04/2017.
 */

import {
    TestBed,
    inject,
    async, ComponentFixture
} from '@angular/core/testing';
import {AppModule} from "../../../app.module";
import {PortfolioComponent} from "./portfolio.component";

describe('PortfolioComponent', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule],
            providers: [
                PortfolioComponent
            ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents();
    }));

    it('should be initialised', inject([PortfolioComponent], (component) =>{
        expect(component).toBeTruthy();
    }));

});