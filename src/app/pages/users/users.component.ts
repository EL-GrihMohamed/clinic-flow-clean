import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './users.component.html',
  styles: ``
})
export class UsersComponent implements OnInit {
  cols!: Column[];
  users = signal<User[]>([]);
  selectedUsers!: User[] | null;
  user!: User;
  submitted: boolean = false;
  userDialog: boolean = false;

  @ViewChild('dt') dt!: Table;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private userService: UserService) { }

  ngOnInit(): void {
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
    this.submitted = false;
    this.userDialog = true;
  }

  editItem(user: User) {
    this.user = { ...user };
    this.userDialog = true;
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

  deleteSelectedItems() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected users?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.users.set(this.users().filter((val) => !this.selectedUsers?.includes(val)));
        this.selectedUsers = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Users Deleted',
          life: 3000
        });
      }
    });
  }

  saveItem() {
    this.submitted = true;
    let _users = this.users();
    // if (this.user.name?.trim()) {
    //   if (this.user.id) {
    //     _users[this.findIndexById(this.user.id)] = this.user;
    //     this.users.set([..._users]);
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Successful',
    //       detail: 'User Updated',
    //       life: 3000
    //     });
    //   } else {
    //     this.user.id = this.createId();
    //     this.user.image = 'user-placeholder.svg';
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Successful',
    //       detail: 'User Created',
    //       life: 3000
    //     });
    //     this.users.set([..._users, this.user]);
    //   }

    //   this.userDialog = false;
    //   this.user = {};
    // }
  }

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
  }

  exportCSV() {
    this.dt.exportCSV();
  }

  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warn';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return 'info';
    }
  }
}
