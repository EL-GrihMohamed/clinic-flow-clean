import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private client: HttpClient) { }

  getAll(): Observable<Patient[]> {
    return this.client.get<Patient[]>(`/api/get-patients`);
  }

  getByCIN(cin: string): Observable<Patient> {
    return this.client.get<Patient>(`/api/get-patient`, {
      params: {
        cin
      }
    });
  }

  create(){

  }

  update(){

  }  

  delete(cin: string){

  }  
}
