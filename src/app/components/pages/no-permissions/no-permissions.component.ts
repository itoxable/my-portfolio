/**
 * Created by ruic on 11/02/2017.
 */

import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    moduleId: module.id,
    templateUrl: 'no-permissions.component.html'
})
export class NoPermissionsComponent{
    constructor(private titleService: Title){
        this.titleService.setTitle('No Permission');
    }

}