import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { User, IContact } from '@app/_models';
import { UserService, AuthenticationService, ContactService } from '@app/_services';
import { DBOperation } from '@app/shared/DBOperation';
import { Global } from '@app/shared/Global';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from '@environments/environment';
import { UserformComponent } from '@app/userform/userform.component';

@Component({ 
  selector: 'app-admin',
  templateUrl: 'admin.component.html',
  styleUrls: ['admin.component.css'] 
})
export class AdminComponent implements OnInit {
  loading = false;
  users: User[] = [];
  selectedUser: User;
  loadingState: boolean;
  dbops: DBOperation;
  modalTitle: string;
  modalBtnTitle: string;
  currentUser: User;
  userFromApi: User;
  
  displayedColumns = [ 'id', 'username', 'firstname', 'lastname', 'middlename', 'role', 'action'];
  dataSource = new MatTableDataSource<User>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
    public snackBar: MatSnackBar,
    private _contactService: ContactService,
    private dialog: MatDialog
    ) {
      this.currentUser = this.authenticationService.currentUserValue;
    }
    
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
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
    
    openUserDialog(): void {
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
        } else if (result === 'error') {
          this.showMessage('There is some issue in saving records, please contact to system administrator!');
        } else {
          // this.showMessage('Please try again, something went wrong');
        }
      });
    }
    
    loadUsers(): void {
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
    
    editUser(id: number) {
      this.dbops = DBOperation.update;
      this.modalTitle = 'Edit User';
      this.modalBtnTitle = 'Update';
      this.selectedUser = this.dataSource.data.filter(x => x.id === id)[0];
      this.openUserDialog();
    }
    deleteContact(id: number) {
      this.dbops = DBOperation.delete;
      this.modalTitle = 'Confirm to Delete ?';
      this.modalBtnTitle = 'Delete';
      this.selectedUser = this.dataSource.data.filter(x => x.id === id)[0];
      this.openUserDialog();
    }
    showMessage(msg: string) {
      this.snackBar.open(msg, '', {
        duration: 3000
      });
    }
    
    getRecordId(id: number) {
      console.log(id);
      
    }
  }