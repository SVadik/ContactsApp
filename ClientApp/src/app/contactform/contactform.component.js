var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContactService } from '../_services/contact.service';
import { DBOperation } from '../shared/DBOperation';
import { Global } from '../shared/Global';
import { environment } from '@environments/environment';
let ContactformComponent = class ContactformComponent {
    constructor(data, fb, _contactService, dialogRef) {
        this.data = data;
        this.fb = fb;
        this._contactService = _contactService;
        this.dialogRef = dialogRef;
        this.indLoading = false;
        this.genders = [];
        // form errors model
        // tslint:disable-next-line:member-ordering
        this.formErrors = {
            'name': '',
            'email': '',
            'gender': '',
            'birth': '',
            'message': ''
        };
        // custom valdiation messages
        // tslint:disable-next-line:member-ordering
        this.validationMessages = {
            'name': {
                'maxlength': 'Name cannot be more than 50 characters long.',
                'required': 'Name is required.'
            },
            'email': {
                'email': 'Invalid email format.',
                'required': 'Email is required.'
            },
            'gender': {
                'required': 'Gender is required.'
            },
            'birth': {
                'required': 'Birthday is required.'
            },
            'message': {
                'required': 'message is required.'
            }
        };
    }
    ngOnInit() {
        // built contact form
        this.contactFrm = this.fb.group({
            id: [''],
            name: ['', [Validators.required, Validators.maxLength(50)]],
            email: ['', [Validators.required, Validators.email]],
            gender: ['', [Validators.required]],
            birth: ['', [Validators.required]],
            message: ['', [Validators.required]]
        });
        this.genders = Global.genders;
        // subscribe on value changed event of form to show validation message
        this.contactFrm.valueChanges.subscribe(data => this.onValueChanged(data));
        this.onValueChanged();
        if (this.data.dbops === DBOperation.create) {
            this.contactFrm.reset();
        }
        else {
            this.contactFrm.setValue(this.data.contact);
        }
        this.SetControlsState(this.data.dbops === DBOperation.delete ? false : true);
    }
    // form value change event
    onValueChanged(data) {
        if (!this.contactFrm) {
            return;
        }
        const form = this.contactFrm;
        // tslint:disable-next-line:forin
        for (const field in this.formErrors) {
            // clear previous error message (if any)
            this.formErrors[field] = '';
            const control = form.get(field);
            // setup custom validation message to form
            if (control && control.dirty && !control.valid) {
                const messages = this.validationMessages[field];
                // tslint:disable-next-line:forin
                for (const key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    }
    onSubmit(formData) {
        const contactData = this.mapDateData(formData.value);
        switch (this.data.dbops) {
            case DBOperation.create:
                this._contactService.addContact(`${environment.apiUrl}/home/addContact`, contactData).subscribe(data => {
                    // Success
                    if (data.message) {
                        this.dialogRef.close('success');
                    }
                    else {
                        this.dialogRef.close('error');
                    }
                }, error => {
                    this.dialogRef.close('error');
                });
                break;
            case DBOperation.update:
                this._contactService.updateContact(`${environment.apiUrl}/home/updateContact`, contactData.id, contactData).subscribe(data => {
                    // Success
                    if (data.message) {
                        this.dialogRef.close('success');
                    }
                    else {
                        this.dialogRef.close('error');
                    }
                }, error => {
                    this.dialogRef.close('error');
                });
                break;
            case DBOperation.delete:
                this._contactService.deleteContact(`${environment.apiUrl}/home/deleteContact`, contactData.id).subscribe(data => {
                    // Success
                    if (data.message) {
                        this.dialogRef.close('success');
                    }
                    else {
                        this.dialogRef.close('error');
                    }
                }, error => {
                    this.dialogRef.close('error');
                });
                break;
        }
    }
    SetControlsState(isEnable) {
        isEnable ? this.contactFrm.enable() : this.contactFrm.disable();
    }
    mapDateData(contact) {
        contact.birth = new Date(contact.birth).toISOString();
        return contact;
    }
};
ContactformComponent = __decorate([
    Component({
        selector: 'app-contactform',
        templateUrl: './contactform.component.html',
        styleUrls: ['./contactform.component.css']
    }),
    __param(0, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [Object, FormBuilder,
        ContactService,
        MatDialogRef])
], ContactformComponent);
export { ContactformComponent };
