import { Component, signal, ViewChild, OnInit } from '@angular/core';
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
import { Patient, ENTRY_TYPES, VERIFICATION_STATUSES, COMPANION_RELATIONSHIPS } from '../../core/models/patient.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { PatientService, CreatePatientRequest } from '../../core/services/patient.service';
import { Genre } from '../../core/models/gender.enum';

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
    ConfirmDialogModule,
    CalendarModule,
    CheckboxModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './patients.component.html',
  styles: ``
})
export class PatientsComponent implements OnInit {
  cols!: Column[];
  patients = signal<Patient[]>([]);
  selectedPatients!: Patient[] | null;
  patient!: Patient;
  submitted: boolean = false;
  patientDialog: boolean = false;
  loading: boolean = false;
  qrCodeDialog: boolean = false;
  currentQrCodeUrl: string = '';

  // Dropdown options
  entryTypes = ENTRY_TYPES;
  verificationStatuses = VERIFICATION_STATUSES;
  companionRelationships = COMPANION_RELATIONSHIPS;
  genders = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' }
  ];

  @ViewChild('dt') dt!: Table;

  constructor(
    private patientService: PatientService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.initializeCols();
  }

  ngOnInit() {
    this.loadPatients();
  }

  initializeCols() {
    this.cols = [
      { field: 'ipp', header: 'IPP' },
      { field: 'firstName', header: 'First Name' },
      { field: 'lastName', header: 'Last Name' },
      { field: 'cin', header: 'CIN' },
      { field: 'phoneNumber', header: 'Phone' },
      { field: 'entryType', header: 'Entry Type' },
      { field: 'verificationStatus', header: 'Status' }
    ];
  }

  loadPatients() {
    this.loading = true;
    this.patientService.getAll().subscribe({
      next: (data) => {
        this.patients.set(data);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading patients:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load patients',
          life: 3000
        });
        this.loading = false;
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.patient = {
      entryType: 'adult',
      verificationStatus: 'pending',
      isMinor: false,
      hasInsurance: false,
      gender: Genre.Male,
      companion: undefined
    };
    this.submitted = false;
    this.patientDialog = true;
  }

  editItem(patient: Patient) {
    this.patient = { ...patient };
    this.patientDialog = true;
  }

  deleteItem(patient: Patient) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + patient.firstName + ' ' + patient.lastName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (patient.patientGuid || patient.id) {
          const guid = patient.patientGuid || patient.id!;
          this.patientService.delete(guid).subscribe({
            next: () => {
              this.patients.set(this.patients().filter((val) => val.patientGuid !== patient.patientGuid && val.id !== patient.id));
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Patient Deleted',
                life: 3000
              });
            },
            error: (error) => {
              console.error('Error deleting patient:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete patient',
                life: 3000
              });
            }
          });
        }
      }
    });
  }

  deleteSelectedItems() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected patients?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.selectedPatients) {
          const deletePromises = this.selectedPatients.map(patient => {
            const guid = patient.patientGuid || patient.id!;
            return this.patientService.delete(guid);
          });

          Promise.all(deletePromises).then(() => {
            this.patients.set(this.patients().filter((val) => !this.selectedPatients?.includes(val)));
            this.selectedPatients = null;
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Patients Deleted',
              life: 3000
            });
          }).catch(error => {
            console.error('Error deleting patients:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete some patients',
              life: 3000
            });
          });
        }
      }
    });
  }

  saveItem() {
    this.submitted = true;

    if (!this.patient.firstName?.trim() || !this.patient.lastName?.trim()) {
      return;
    }

    // Check if companion is required
    const needsCompanion = this.patient.entryType === 'minor' || this.patient.entryType === 'proxy';
    if (needsCompanion && (!this.patient.companion?.fullName || !this.patient.companion?.phone || !this.patient.companion?.relationship)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Companion information is required for minors and proxy entries',
        life: 3000
      });
      return;
    }

    if (this.patient.patientGuid || this.patient.id) {
      // Update existing patient
      const updateData = {
        patientGuid: this.patient.patientGuid || this.patient.id!,
        firstname: this.patient.firstName,
        lastname: this.patient.lastName,
        cin: this.patient.cin,
        insurancename: this.patient.insuranceName,
        notes: this.patient.notes,
        hasinsurance: this.patient.hasInsurance
      };

      this.patientService.update(updateData).subscribe({
        next: () => {
          const _patients = this.patients();
          const index = _patients.findIndex(p => p.patientGuid === this.patient.patientGuid || p.id === this.patient.id);
          if (index !== -1) {
            _patients[index] = { ..._patients[index], ...this.patient };
            this.patients.set([..._patients]);
          }
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Patient Updated',
            life: 3000
          });
          this.patientDialog = false;
          this.patient = {};
        },
        error: (error) => {
          console.error('Error updating patient:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to update patient',
            life: 3000
          });
        }
      });
    } else {
      // Create new patient
      const createData: CreatePatientRequest = {
        entryType: this.patient.entryType!,
        isminor: this.patient.isMinor!,
        verificationstatus: this.patient.verificationStatus!,
        firstname: this.patient.firstName!,
        lastname: this.patient.lastName!,
        cin: this.patient.cin,
        phonenumber: this.patient.phoneNumber,
        address: this.patient.address,
        dateofbirth: this.patient.dateOfBirth ? this.formatDateForApi(this.patient.dateOfBirth) : undefined,
        gender: this.patient.gender === Genre.MALE ? 'male' : 'female',
        hasinsurance: this.patient.hasInsurance,
        insurancename: this.patient.insuranceName,
        notes: this.patient.notes
      };

      if (this.patient.companion) {
        createData.companion = this.patient.companion;
      }

      this.patientService.create(createData).subscribe({
        next: (response) => {
          const newPatient: Patient = {
            ...this.patient,
            patientGuid: response.patientGuid,
            qrcodeUrl: response.qrcodeUrl
          };
          this.patients.set([...this.patients(), newPatient]);
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Patient Created',
            life: 3000
          });
          this.patientDialog = false;
          this.patient = {};
          
          // Show QR code dialog
          this.currentQrCodeUrl = response.qrcodeUrl;
          this.qrCodeDialog = true;
        },
        error: (error) => {
          console.error('Error creating patient:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to create patient',
            life: 3000
          });
        }
      });
    }
  }

  hideDialog() {
    this.patientDialog = false;
    this.submitted = false;
  }

  exportCSV() {
    this.dt.exportCSV();
  }

  getSeverity(status: string) {
    switch (status?.toLowerCase()) {
      case 'verified':
        return 'success';
      case 'pending':
        return 'warn';
      case 'unverified':
        return 'danger';
      default:
        return 'info';
    }
  }

  onEntryTypeChange() {
    // Auto-set isMinor based on entryType
    if (this.patient.entryType === 'minor') {
      this.patient.isMinor = true;
    } else if (this.patient.entryType === 'adult') {
      this.patient.isMinor = false;
    }

    // Initialize companion if needed
    const needsCompanion = this.patient.entryType === 'minor' || this.patient.entryType === 'proxy';
    if (needsCompanion && !this.patient.companion) {
      this.patient.companion = {
        fullName: '',
        phone: '',
        relationship: 'guardian'
      };
    } else if (!needsCompanion) {
      this.patient.companion = undefined;
    }
  }

  private formatDateForApi(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  showQrCode(patient: Patient) {
    if (patient.qrcodeUrl) {
      this.currentQrCodeUrl = patient.qrcodeUrl;
      this.qrCodeDialog = true;
    }
  }

  closeQrDialog() {
    this.qrCodeDialog = false;
    this.currentQrCodeUrl = '';
  }
}