/**
 * Created by ruic on 17/02/2017.
 */

import { Component, ViewContainerRef, EventEmitter, Output, Input, AfterViewInit, forwardRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
// import * as CKEDITOR from 'ckeditor';
declare var CKEDITOR: any


@Component({
    selector: 'mp-text-editor',
    moduleId: module.id,
    templateUrl: 'text-editor.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TextEditorComponent),
            multi: true
        }
    ]
})

export class TextEditorComponent implements ControlValueAccessor, AfterViewInit {

    text: string;
    @Input() config = {
        // CKEDITOR_BASEPATH: '/lib/ckeditor/'
        // skin: 'moono-lisa'
    };

    instance: any;
    get value(): string {
        console.log('get value');
        return this.text
    }

    set value(value: string) {
        console.log('set value' + value);
        this.text = value;
        this.onChangeCallback(this.text);
    }

    private onTouchedCallback: () => void = () => { };
    private onChangeCallback: (_: any) => void = () => {};

    constructor() {

    }

    registerOnChange(fn: any) {
        console.log('registerOnChange');
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any) {
        console.log('registerOnTouched');
        this.onTouchedCallback = fn;
    }

    writeValue(value: string) {
        console.log('writeValue: ' + value);
        // if (this.instance)
        //     this.instance.setData(value);
        this.text = value;
    }

    // Set touched on blur
    onBlur() {
        this.onTouchedCallback();
    }

    _handleChange(event: Event) {
        console.log('_handleChange');
        this.onTouchedCallback();
    }

    ngAfterViewInit() {
        CKEDITOR = window['CKEDITOR'];
        // var editorElement = CKEDITOR.document.getById('text-editor');
        // editorElement.setHtml(this.text);
        this.instance = CKEDITOR.replace('text-editor', this.config);
        this.instance.on('change', (event) => {
            // console.log(event);
            this.text = event.editor.getData();
            this.value = this.text;

            // let date: CalendarDate = this.days[i];
            // let dateString:string = `${date.day}.${date.month}.${date.year}`;
            // this.date = moment(dateString, 'DD.MM.YYYY');
            // this.value = this.date.format(this.format);
            // this.viewDate = this.date.format(this.viewFormat);
            // this.close();


        });
        this.instance.on('blur', function(event) {
            // console.log( 'Saving...', editor.name, editor.getData() );
            console.log(event);
            this.text = event.editor.getData();
            this.value = this.text;
        } );
    }

}
