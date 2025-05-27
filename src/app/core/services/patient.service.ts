import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface CreatePatientRequest {
  entryType: 'adult' | 'minor' | 'proxy' | 'unknown';
  isminor: boolean;
  verificationstatus: 'verified' | 'pending' | 'unverified';
  firstname: string;
  lastname: string;
  cin?: string;
  phonenumber?: string;
  address?: string;
  dateofbirth?: string; // YYYY-MM-DD format
  gender?: 'male' | 'female';
  hasinsurance?: boolean;
  insurancename?: string;
  notes?: string;
  companion?: {
    fullName: string;
    phone: string;
    relationship: 'mother' | 'father' | 'sister' | 'brother' | 'wife' | 'husband' | 'guardian' | 'friend';
  };
}

export interface CreatePatientResponse {
  success: boolean;
  visitGuid: string;
  patientGuid: string;
  qrcodeUrl: string;
  message: string;
}

export interface UpdatePatientRequest {
  patientGuid: string;
  firstname?: string;
  lastname?: string;
  cin?: string;
  insurancename?: string;
  notes?: string;
  hasinsurance?: boolean;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  origin: string;
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private client: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); // Adjust based on how you store JWT
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAll(): Observable<Patient[]> {
    return this.client.get<Patient[]>(`/api/get-patients`, {
      headers: this.getHeaders()
    });
  }

  getByCIN(cin: string): Observable<Patient> {
    return this.client.get<Patient>(`/api/get-patient`, {
      params: { cin },
      headers: this.getHeaders()
    });
  }

  create(patientData: CreatePatientRequest): Observable<CreatePatientResponse> {
    return this.client.post<CreatePatientResponse>('/api/create-patient', patientData, {
      headers: this.getHeaders()
    });
  }

  update(patientData: UpdatePatientRequest): Observable<ApiResponse> {
    return this.client.post<ApiResponse>('/api/update-patient', patientData, {
      headers: this.getHeaders()
    });
  }

  delete(patientGuid: string): Observable<ApiResponse> {
    return this.client.post<ApiResponse>('/api/delete-patient', { patientGuid }, {
      headers: this.getHeaders()
    });
  }
}