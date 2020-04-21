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
import { UserService } from '../_services/user.service';
import { DBOperation } from '../shared/DBOperation';
import { Global } from '../shared/Global';
import { environment } from '@environments/environment';
let UserformComponent = class UserformComponent {
    constructor(data, fb, userService, dialogRef) {
        this.data = data;
        this.fb = fb;
        this.userService = userService;
        this.dialogRef = dialogRef;
        this.roles = [];
        this.role = 'admin';
        // form errors model
        // tslint:disable-next-line:member-ordering
        this.formErrors = {
            // 'id': '',
            'username': '',
            'firstname': '',
            'lastname': '',
            'middlename': '',
            'password': '',
            'role': '',
            'token': '',
        };
        // custom valdiation messages
        // tslint:disable-next-line:member-ordering
        this.validationMessages = {
            // 'id': {
            //   'required': 'Id is required.'
            // },
            'username': {
                'required': 'Username is required.'
            },
            'firstname': {
                'required': 'Firstname is required.'
            },
            'lastname': {
                'required': 'Lastname is required.'
            },
            'password': {
                'required': 'Password is required.'
            },
            'role': {
                'required': 'Role is required.'
            },
        };
    }
    ngOnInit() {
        // built user form
        this.userFrm = this.fb.group({
            id: ['', Validators.required],
            username: ['', Validators.required],
            password: [''],
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            middlename: [''],
            role: ['', Validators.required],
            token: [''],
            contacts: [''],
            passwordHash: [''],
            passwordSalt: ['']
        });
        this.roles = Global.roles;
        this.role = this.data.user.role;
        // subscribe on value changed event of form to show validation message
        this.userFrm.valueChanges.subscribe(data => this.onValueChanged(data));
        this.onValueChanged();
        if (this.data.dbops === DBOperation.create) {
            this.userFrm.reset();
        }
        else {
            this.userFrm.setValue(this.data.user);
        }
        this.SetControlsState(this.data.dbops === DBOperation.delete ? false : true);
    }
    // form value change event
    onValueChanged(data) {
        if (!this.userFrm) {
            return;
        }
        const form = this.userFrm;
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
    onSubmit(userData) {
        switch (this.data.dbops) {
            // case DBOperation.create:
            //   this.userService.addUser(`${environment.apiUrl}/home/addUser`, userData).subscribe(
            //     data => {
            //       // Success
            //       if (data.message) {
            //         this.dialogRef.close('success');
            //       } else {
            //         this.dialogRef.close('error');
            //       }
            //     },
            //     error => {
            //       this.dialogRef.close('error');
            //     });
            //   break;
            case DBOperation.update:
                this.userService.updateUser(`${environment.apiUrl}/users/updateUser`, userData.value).subscribe(data => {
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
                this.userService.deleteUser(`${environment.apiUrl}/users/deleteUser`, userData.value.id).subscribe(data => {
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
        isEnable ? this.userFrm.enable() : this.userFrm.disable();
    }
};
UserformComponent = __decorate([
    Component({
        selector: 'app-userform',
        templateUrl: './userform.component.html',
    }),
    __param(0, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [Object, FormBuilder,
        UserService,
        MatDialogRef])
], UserformComponent);
export { UserformComponent };
