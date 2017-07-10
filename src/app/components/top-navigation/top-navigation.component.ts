/**
 * Created by ruic on 11/02/2017.
 */

import {Component, Directive, HostListener} from '@angular/core';


@Component({
    selector: 'mp-top-navigation',
    moduleId: module.id,
    templateUrl: 'top-navigation.component.html'
})
export class TopNavigationComponent {
    constructor() {

    }
}


@Directive({
    selector: '[mpNavDropdown]'
})
export class NavDropDownDirective {
    mobileView = false;
    constructor() {

    }

    @HostListener('mouseenter', ['$event.target'])
    onMouseEnter(el) {
        if (this.mobileView) {
            return;
        }
        this.applyClass(el, elem => {this.showDropDown(elem)});
    }
    @HostListener('mouseleave', ['$event.target'])
    onMouseleave(el) {
        if (this.mobileView) {
            return;
        }
        this.applyClass(el, elem => {this.hideDropDown(elem)});
    }

    @HostListener('click', ['$event.target'])
    onClick(el) {
        this.applyClass(el, elem => {
            const match = elem.className.match(/\bopen\b/);
            if (match != null) {
                this.hideDropDown(elem);
            } else {
                this.showDropDown(elem)
            }
        });

    }

    applyClass(el, action: Function) {
        const namedNodeMap: NamedNodeMap = el.attributes;
        const attr = namedNodeMap.getNamedItem('gpNavDropdown');
        if (attr == null) {
            if (el.parentElement) {
                this.applyClass(el.parentElement, action);
            }
        }else {
            action(el);
        }
    }

    showDropDown(el) {
        if (el && el.classList) {
            el.classList.add('open');
        }
    }

    hideDropDown(el) {
        if (el && el.classList) {
            el.classList.remove('open');
        }

    }
}
