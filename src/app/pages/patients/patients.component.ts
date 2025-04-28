import { Component, signal, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { Patient } from '../../core/models/patient.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

@Component({
  selector: 'app-patients',
  imports: [
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
  templateUrl: './patients.component.html',
  styles: ``
})
export class PatientsComponent {
  cols!: Column[];
  patients = signal<Patient[]>([]);
  selectedPatients!: Patient[] | null;
  patient!: Patient;
  submitted: boolean = false;
  patientDialog: boolean = false;

  @ViewChild('dt') dt!: Table;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService) { }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.patient = { id: 0 };
    this.submitted = false;
    this.patientDialog = true;
  }

  editItem(patient: Patient) {
    this.patient = { ...patient };
    this.patientDialog = true;
  }

  deleteItem(patient: Patient) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + patient.nom + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.patients.set(this.patients().filter((val) => val.id !== patient.id));
        this.patient = {};
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Patient Deleted',
          life: 3000
        });
      }
    });
  }

  deleteSelectedItems() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected patients?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.patients.set(this.patients().filter((val) => !this.selectedPatients?.includes(val)));
        this.selectedPatients = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Patients Deleted',
          life: 3000
        });
      }
    });
  }

  saveItem() {
    this.submitted = true;
    let _patients = this.patients();
    // if (this.patient.name?.trim()) {
    //   if (this.patient.id) {
    //     _patients[this.findIndexById(this.patient.id)] = this.patient;
    //     this.patients.set([..._patients]);
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Successful',
    //       detail: 'Patient Updated',
    //       life: 3000
    //     });
    //   } else {
    //     this.patient.id = this.createId();
    //     this.patient.image = 'patient-placeholder.svg';
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Successful',
    //       detail: 'Patient Created',
    //       life: 3000
    //     });
    //     this.patients.set([..._patients, this.patient]);
    //   }

    //   this.patientDialog = false;
    //   this.patient = {};
    // }
  }

  hideDialog() {
    this.patientDialog = false;
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
