import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToolbarModule } from 'primeng/toolbar';
import { User } from '../../core/models/user.model';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../core/services/user.service';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

@Component({
  selector: 'app-users',
  imports: [
    TranslateModule,
    ToastModule,
    ToolbarModule,
    TagModule,
    FormsModule,
    CommonModule,
    ButtonModule,
    TableModule,
    IconField,
    InputIcon,
    RatingModule,
    DialogModule,
    SelectModule,
    RadioButtonModule,
    InputNumberModule,
    InputTextModule,
    TextareaModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    MessageModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './users.component.html',
  styles: ``
})
export class UsersComponent implements OnInit {
  cols!: Column[];
  users = signal<User[]>([]);
  user!: User;
  userDialog: boolean = false;
  roleValues = [
    { name: 'Doctor', code: 'doctor' },
    { name: 'Admin', code: 'admin' },
    { name: 'Billing', code: 'billing' },
    { name: 'Nurse', code: 'nurse' },
    { name: 'Reception', code: 'reception' }
  ];
  userForm!: FormGroup;
  loadingUser: boolean = false;

  @ViewChild('dt') dt!: Table;

  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      role: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)]],
      confirmPassword: ['', [Validators.required, this.matchOtherValidator('password')]]
    });
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getAll().subscribe({
      next: res => {
        this.users.set(res.users);
      },
      error: err => {

      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.user = {};
    this.userForm.reset();
    this.userDialog = true;

    const pw = this.userForm.get('password')!;
    const cpw = this.userForm.get('confirmPassword')!;
    pw.reset();
    cpw.reset();

    pw.setValidators([Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)]);
    pw.updateValueAndValidity();

    cpw.setValidators([Validators.required, this.matchOtherValidator('password')]);
    cpw.updateValueAndValidity();
  }

  editItem(user: User) {
    this.userDialog = true;
    this.loadingUser = true;

    const pw = this.userForm.get('password')!;
    const cpw = this.userForm.get('confirmPassword')!;
    pw.reset();
    cpw.reset();

    pw.clearValidators();
    pw.setErrors(null);
    pw.updateValueAndValidity();

    cpw.clearValidators();
    cpw.setErrors(null);
    cpw.updateValueAndValidity();

    this.userService.getById(user.id ?? '').subscribe({
      next: res => {
        this.user = { ...user };
        this.userForm.controls['username'].setValue(res.username);
        this.userForm.controls['role'].setValue(res.role?.toLowerCase());
        this.userForm.controls['firstname'].setValue(res.firstname);
        this.userForm.controls['lastname'].setValue(res.lastname);
        this.userForm.controls['email'].setValue(res.email);
        this.userForm.controls['phoneNumber'].setValue(res.phoneNumber);
        this.loadingUser = false;
      },
      error: () => {
        this.loadingUser = false;
      }
    });
  }

  deleteItem(user: User) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + user.firstname + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.delete(user.id ?? '').subscribe({
          next: res => {
            this.user = {};
            this.getUsers();
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: res.message,
              life: 3000
            });
          },
          error: err => {

          }
        });

      }
    });
  }

  saveItem() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.userForm.controls['username'].markAsDirty();
      this.userForm.controls['role'].markAsDirty();
      this.userForm.controls['firstname'].markAsDirty();
      this.userForm.controls['lastname'].markAsDirty();
      this.userForm.controls['email'].markAsDirty();
      this.userForm.controls['phoneNumber'].markAsDirty();
      this.userForm.controls['password'].markAsDirty();
      this.userForm.controls['confirmPassword'].markAsDirty();
      return;
    }
    this.loadingUser = true;

    const { username, role, firstname, lastname, email, phoneNumber, password } = this.userForm.value;

    if (this.user.id) {
      this.userService.update({
        id: this.user.id,
        username,
        role,
        firstname,
        lastname,
        email,
        phoneNumber,
        password
      }).subscribe({
        next: res => {
          if (res.success) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: res.message,
              life: 3000
            });
          }
          this.getUsers();
          this.userDialog = false;
          this.user = {};
          this.loadingUser = false;
        },
        error: err => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err?.message,
            life: 3000
          });
          this.loadingUser = false;
        }
      });
    }
    else {
      this.userService.create({
        username,
        role,
        firstname,
        lastname,
        email,
        phoneNumber,
        password
      }).subscribe({
        next: res => {
          if (res.success) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: "Something went wrong",
              life: 3000
            });
          }
          this.getUsers();
          this.userDialog = false;
          this.user = {};
          this.loadingUser = false;
        },
        error: err => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: "Something went wrong",
            life: 3000
          });
          this.loadingUser = false;
        }
      })
    }
  }

  hideDialog() {
    this.userDialog = false;
    this.userForm.reset();
  }

  exportCSV() {
    this.dt?.exportCSV();
  }

  private matchOtherValidator(otherControlName: string): ValidatorFn {
    return (control: AbstractControl) => {
      if (!control.parent) return null;         // no parent → skip
      const pw = control.parent.get(otherControlName);
      if (!pw) return null;                    // no sibling → skip

      // if confirm is empty → required will catch it
      if (control.value === pw.value) {
        return null;
      }
      return { notMatched: true };
    };
  }
}
