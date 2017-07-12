/**
 * Created by ruic on 11/02/2017.
 */


import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';


@Component({
    moduleId: module.id,
    templateUrl: 'page-not-found.component.html'
})
export class PageNotFoundComponent {
    constructor(private titleService: Title) {
        this.titleService.setTitle('Not found');
    }
}
