import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FluidModule, SelectModule, ButtonModule, InputTextModule, TextareaModule, TranslateModule, ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styles: ``
})
export class ProfileComponent implements OnInit {
  loading = false;
  profileForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
    this.getUser();
  }

  getUser(): void {
    this.loading = true;
    this.authService.getUser().subscribe({
      next: res => {
        this.profileForm.controls['fullName'].setValue(res.fullName);
        this.profileForm.controls['email'].setValue(res.email);
        this.loading = false;
      },
      error: err => {
        console.log(err);
        this.loading = false;
      }
    })
  }

  saveProfile(): void {

  }
}
