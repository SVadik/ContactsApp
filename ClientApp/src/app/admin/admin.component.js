var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { UserService, AuthenticationService, ContactService } from '@app/_services';
import { DBOperation } from '@app/shared/DBOperation';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from '@environments/environment';
import { UserformComponent } from '@app/userform/userform.component';
import { ContactformComponent } from '@app/contactform';
let AdminComponent = class AdminComponent {
    constructor(userService, authenticationService, snackBar, _contactService, dialog) {
        this.userService = userService;
        this.authenticationService = authenticationService;
        this.snackBar = snackBar;
        this._contactService = _contactService;
        this.dialog = dialog;
        this.loading = false;
        this.users = [];
        this.displayedColumns = ['id', 'username', 'firstname', 'lastname', 'middlename', 'role', 'action'];
        this.displayedContactColumns = ['name', 'email', 'gender', 'birth', 'message', 'action'];
        this.dataSource = new MatTableDataSource();
        this.dataSourceContact = new MatTableDataSource();
        this.currentUser = this.authenticationService.currentUserValue;
    }
    applyFilter(event) {
        const filterValue = event.target.value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    ngOnInit() {
        this.loading = true;
        this.userService.getById(this.currentUser.id).pipe(first()).subscribe(user => {
            this.loading = false;
            this.userFromApi = user;
        });
        this.loadUsers();
    }
    openUserDialog() {
        const dialogRef = this.dialog.open(UserformComponent, {
            width: '500px',
            data: {
                dbops: this.dbops,
                modalTitle: this.modalTitle,
                modalBtnTitle: this.modalBtnTitle,
                user: this.selectedUser
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            if (result === 'success') {
                this.loadingState = true;
                this.loadUsers();
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
    loadUsers() {
        this.userService.getAllUsers(`${environment.apiUrl}/users/getAllUsers`)
            .subscribe(users => {
            this.loadingState = false;
            this.dataSource.data = users;
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        });
    }
    // addUser() {
    //     this.dbops = DBOperation.create;
    //     this.modalTitle = 'Add New User';
    //     this.modalBtnTitle = 'Add';
    //     this.openDialog();
    // }
    editUser(id) {
        this.dbops = DBOperation.update;
        this.modalTitle = 'Edit User';
        this.modalBtnTitle = 'Update';
        this.selectedUser = this.dataSource.data.filter(x => x.id === id)[0];
        this.openUserDialog();
    }
    deleteUser(id) {
        this.dbops = DBOperation.delete;
        this.modalTitle = 'Confirm to Delete ?';
        this.modalBtnTitle = 'Delete';
        this.selectedUser = this.dataSource.data.filter(x => x.id === id)[0];
        this.openUserDialog();
    }
    showMessage(msg) {
        this.snackBar.open(msg, '', {
            duration: 3000
        });
    }
    loadUserContacts(userId) {
        this._contactService.getUserContacts(`${environment.apiUrl}/home/getUserContacts`, userId)
            .subscribe(contacts => {
            this.loadingState = false;
            this.dataSourceContact.data = contacts;
            this.dataSourceContact.paginator = this.paginator;
            this.dataSourceContact.sort = this.sort;
        });
    }
    editContact(id) {
        this.dbops = DBOperation.update;
        this.modalTitle = 'Edit Contact';
        this.modalBtnTitle = 'Update';
        this.contact = this.dataSourceContact.data.filter(x => x.id === id)[0];
        this.openContactDialog();
    }
    deleteContact(id) {
        this.dbops = DBOperation.delete;
        this.modalTitle = 'Confirm to Delete ?';
        this.modalBtnTitle = 'Delete';
        this.contact = this.dataSourceContact.data.filter(x => x.id === id)[0];
        this.openContactDialog();
    }
    openContactDialog() {
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
                this.loadUserContacts(this.selectedUserId);
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
    getRecordId(selectedUserId) {
        this.selectedUserId = selectedUserId;
        this.loadUserContacts(selectedUserId);
    }
};
__decorate([
    ViewChild(MatPaginator),
    __metadata("design:type", MatPaginator)
], AdminComponent.prototype, "paginator", void 0);
__decorate([
    ViewChild(MatSort),
    __metadata("design:type", MatSort)
], AdminComponent.prototype, "sort", void 0);
AdminComponent = __decorate([
    Component({
        selector: 'app-admin',
        templateUrl: 'admin.component.html',
        styleUrls: ['admin.component.css']
    }),
    __metadata("design:paramtypes", [UserService,
        AuthenticationService,
        MatSnackBar,
        ContactService,
        MatDialog])
], AdminComponent);
export { AdminComponent };
