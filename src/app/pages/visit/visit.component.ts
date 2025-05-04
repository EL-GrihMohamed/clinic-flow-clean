import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { ZXingScannerComponent, ZXingScannerModule } from '@zxing/ngx-scanner';
import { SelectItem } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { BarcodeFormat } from '@zxing/library';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { VisitService } from '../../core/services/visit.service';
import { Patient } from '../../core/models/patient.model';

@Component({
  standalone: true,
  selector: 'app-visit',
  imports: [StepperModule, DropdownModule, ButtonModule, FormsModule, ZXingScannerModule, MessageModule, CommonModule],
  templateUrl: './visit.component.html',
  styles: ``
})
export class VisitComponent implements AfterViewInit {
  activeStep:number = 1;
  @ViewChild('scanner') scanner!: ZXingScannerComponent;
  availableDevices: MediaDeviceInfo[] = [];
  allowedFormats = [BarcodeFormat.QR_CODE];
  deviceOptions: SelectItem[] = [];
  selectedDevice?: { label: string, value: MediaDeviceInfo };
  qrResultString = '';
  loadingPatient: boolean = false;

  currentPatient?: Patient;

  constructor(
    private visitService: VisitService
  ) { }

  ngAfterViewInit() {
    // subscribe to camerasFound once the view is initialized
    // the scanner emits available devices automatically
    this.scanner?.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      this.availableDevices = devices;
      this.deviceOptions = devices.map(dev => ({
        label: dev.label || `Camera ${this.deviceOptions.length + 1}`,
        value: dev
      }));
    });
  }

  onDeviceSelect(event: any) {
    this.selectedDevice = event;
    this.scanner.restart();
  }

  onScanSuccess(result: string) {
    const parts = result.split('ipp=');
    this.qrResultString = parts.length > 1
      ? parts[1]
      : result;
    this.loadingPatient = true;
    this.visitService.getPatientByIPP(this.qrResultString).subscribe({
      next: res => {
        if (res.patientFound) {
          this.currentPatient = res.patientData;
        }
        this.loadingPatient = false;
        this.activeStep = 2;
      }
    });
  }

  onScanError(err: any) {
    console.error('Scan error:', err);
  }
}
