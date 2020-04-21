import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UserService } from '../_services/user.service';
import { DBOperation } from '../shared/DBOperation';
import { Global } from '../shared/Global';
import { environment } from '@environments/environment';
import { User, Role } from '@app/_models';
import { AdminComponent } from '@app/admin';

@Component({
  selector: 'app-userform',
  templateUrl: './userform.component.html',
  // styleUrls: ['./userform.component.css']
})

export class UserformComponent implements OnInit {
  msg: string;
  userFrm: FormGroup;
  dbops: DBOperation;
  modalTitle: string;
  modalBtnTitle: string;
  listFilter: string;
  selectedOption: string;
  user: User;
  roles = [];
  role = 'admin';
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private fb: FormBuilder,
  private userService: UserService,
  public dialogRef: MatDialogRef<AdminComponent>) { }
  
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
    } else {
      this.userFrm.setValue(this.data.user);
    }
    this.SetControlsState(this.data.dbops === DBOperation.delete ? false : true);
  }
  // form value change event
  onValueChanged(data?: any) {
    if (!this.userFrm) { return; }
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
  // form errors model
  // tslint:disable-next-line:member-ordering
  formErrors = {
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
  validationMessages = {
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
  
  onSubmit(userData: any) {
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
      this.userService.updateUser(`${environment.apiUrl}/users/updateUser`, userData.value).subscribe(
        data => {
          // Success
          if (data.message) {
            this.dialogRef.close('success');
          } else {
            this.dialogRef.close('error');
          }
        },
        error => {
          this.dialogRef.close('error');
        });
        break;
        case DBOperation.delete:
        this.userService.deleteUser(`${environment.apiUrl}/users/deleteUser`, userData.value.id).subscribe(
          data => {
            if (data.message) {
              this.dialogRef.close('success');
            }
            else {
              this.dialogRef.close('error');
            }
          },
          error => {
            this.dialogRef.close('error');
          });
          break;
        }
      }
      
      SetControlsState(isEnable: boolean) {
        isEnable ? this.userFrm.enable() : this.userFrm.disable();
      }
    }