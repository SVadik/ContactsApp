import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { User, IContact } from '@app/_models';
import { ContactformComponent } from '../contactform/contactform.component';
import { UserService, AuthenticationService, ContactService } from '@app/_services';
import { DBOperation } from '@app/shared/DBOperation';
import { Global } from '@app/shared/Global';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from '@environments/environment';

@Component({ 
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] 
})
export class HomeComponent implements OnInit {
  contacts: IContact[];
  contact: IContact;
  loadingState: boolean;
  dbops: DBOperation;
  modalTitle: string;
  modalBtnTitle: string;
  loading = false;
  currentUser: User;
  userFromApi: User;
  
  displayedColumns = ['name', 'email', 'gender', 'birth', 'message', 'action'];
  dataSource = new MatTableDataSource<IContact>();
    
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
      this.loadContacts();
    }

    openDialog(): void {
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
        } else if (result === 'error') {
          this.showMessage('There is some issue in saving records, please contact to system administrator!');
        } else {
          // this.showMessage('Please try again, something went wrong');
        }
      });
    }
    
    loadContacts(): void {
      this._contactService.getAllContacts(`${environment.apiUrl}/home/getAllContacts`)
      .subscribe(contacts => {
        this.loadingState = false;
        this.dataSource.data = contacts;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }
    
    getGender(gender: number): string {
      return Global.genders.filter(ele => ele.id === gender).map(ele => ele.name)[0];
    }
    
    addContact() {
      this.dbops = DBOperation.create;
      this.modalTitle = 'Add New Contact';
      this.modalBtnTitle = 'Add';
      this.openDialog();
    }
    editContact(id: number) {
      this.dbops = DBOperation.update;
      this.modalTitle = 'Edit Contact';
      this.modalBtnTitle = 'Update';
      this.contact = this.dataSource.data.filter(x => x.id === id)[0];
      this.openDialog();
    }
    deleteContact(id: number) {
      this.dbops = DBOperation.delete;
      this.modalTitle = 'Confirm to Delete ?';
      this.modalBtnTitle = 'Delete';
      this.contact = this.dataSource.data.filter(x => x.id === id)[0];
      this.openDialog();
    }
    showMessage(msg: string) {
      this.snackBar.open(msg, '', {
        duration: 3000
      });
    }
  }