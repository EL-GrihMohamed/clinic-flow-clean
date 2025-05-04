import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VisitService {

  constructor(private http: HttpClient) { }

  getPatientByIPP(ipp: string): Observable<{ patientFound: boolean, patientData: Patient }> {
    return this.http.get<{ patientFound: boolean, patientData: Patient }>(`/api/doctor-get-patient`, {
      params: { ipp }
    });
  }
}
