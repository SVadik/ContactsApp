var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { ContactformComponent } from '../contactform/contactform.component';
import { UserService, AuthenticationService, ContactService } from '@app/_services';
import { DBOperation } from '@app/shared/DBOperation';
import { Global } from '@app/shared/Global';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '@environments/environment';
let HomeComponent = class HomeComponent {
    constructor(userService, authenticationService, snackBar, _contactService, dialog) {
        this.userService = userService;
        this.authenticationService = authenticationService;
        this.snackBar = snackBar;
        this._contactService = _contactService;
        this.dialog = dialog;
        this.loading = false;
        this.dataSource = new MatTableDataSource();
        this.currentUser = this.authenticationService.currentUserValue;
    }
    ngOnInit() {
        this.loading = true;
        this.userService.getById(this.currentUser.id).pipe(first()).subscribe(user => {
            this.loading = false;
            this.userFromApi = user;
        });
        this.loadContacts();
    }
    openDialog() {
        const dialogRef = this.dialog.open(ContactformComponent, {
            width: '500px',
            data: {
                dbops: this.dbops,
                modalTitle: this.modalTitle,
                modalBtnTitle: this.modalBtnTitle,
                contact: this.contact
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            if (result === 'success') {
                this.loadingState = true;
                this.loadContacts();
                switch (this.dbops) {
                    case DBOperation.create:
                        this.showMessage('Data successfully added.');
                        break;
                    case DBOperation.update:
                        this.showMessage('Data successfully updated.');
                        break;
                    case DBOperation.delete:
                        this.showMessage('Data successfully deleted.');
                        break;
                }
            }
            else if (result === 'error') {
                this.showMessage('There is some issue in saving records, please contact to system administrator!');
            }
            else {
                // this.showMessage('Please try again, something went wrong');
            }
        });
    }
    loadContacts() {
        this._contactService.getAllContacts(`${environment.apiUrl}/home/getAllContacts`)
            .subscribe(contacts => {
            this.loadingState = false;
            this.dataSource.data = contacts;
        });
    }
    getGender(gender) {
        return Global.genders.filter(ele => ele.id === gender).map(ele => ele.name)[0];
    }
    addContact() {
        this.dbops = DBOperation.create;
        this.modalTitle = 'Add New Contact';
        this.modalBtnTitle = 'Add';
        this.openDialog();
    }
    editContact(id) {
        this.dbops = DBOperation.update;
        this.modalTitle = 'Edit Contact';
        this.modalBtnTitle = 'Update';
        this.contact = this.dataSource.data.filter(x => x.id === id)[0];
        this.openDialog();
    }
    deleteContact(id) {
        this.dbops = DBOperation.delete;
        this.modalTitle = 'Confirm to Delete ?';
        this.modalBtnTitle = 'Delete';
        this.contact = this.dataSource.data.filter(x => x.id === id)[0];
        this.openDialog();
    }
    showMessage(msg) {
        this.snackBar.open(msg, '', {
            duration: 3000
        });
    }
};
HomeComponent = __decorate([
    Component({ templateUrl: 'home.component.html' }),
    __metadata("design:paramtypes", [UserService,
        AuthenticationService,
        MatSnackBar,
        ContactService,
        MatDialog])
], HomeComponent);
export { HomeComponent };
