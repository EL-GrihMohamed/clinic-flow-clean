import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { User } from '../../core/models/user.model';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { startWith } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FluidModule, ToastModule, MessageModule, SelectModule, ButtonModule, InputTextModule, TextareaModule, TranslateModule, ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styles: ``,
  providers: [MessageService]
})
export class ProfileComponent implements OnInit {
  loading = false;
  loadingPassword = false;
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  currentUser?: User;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private service: MessageService
  ) { }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.pattern(/^\+?[1-9]\d{1,14}$/)]]
    });

    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)]],
      confirmPassword: ['', [Validators.required, this.matchOtherValidator('password')]]
    });

    // this.passwordForm.get('password')!
    //   .valueChanges
    //   .pipe(startWith(this.passwordForm.get('password')!.value))
    //   .subscribe(pw => {
    //     const cpw = this.passwordForm.get('confirmPassword')!;
    //     if (pw) {
    //       cpw.setValidators([Validators.required]);
    //     } else {
    //       cpw.clearValidators();
    //     }
    //     // re-run validation on confirmPassword
    //     cpw.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    //   });

    this.getUser();
  }

  getUser(): void {
    this.loading = true;
    this.authService.getProfile().subscribe({
      next: res => {
        if (res.success) {
          this.currentUser = res.user;
          this.profileForm.controls['firstname'].setValue(res.user.firstname);
          this.profileForm.controls['lastname'].setValue(res.user.lastname);
          this.profileForm.controls['email'].setValue(res.user.email);
          this.profileForm.controls['phoneNumber'].setValue(res.user.phoneNumber);
        }
        this.loading = false;
      },
      error: err => {
        this.loading = false;
      }
    })
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.profileForm.controls['firstname'].markAsDirty();
      this.profileForm.controls['lastname'].markAsDirty();
      this.profileForm.controls['email'].markAsDirty();
      this.profileForm.controls['phoneNumber'].markAsDirty();
      return;
    }
    this.loading = true;

    const { firstname, lastname, email, phoneNumber } = this.profileForm.value;

    this.authService.UpdateProfile({
      firstname,
      lastname,
      email,
      phoneNumber
    }).subscribe({
      next: res => {
        if (res.success) {
          this.service.add({ severity: 'success', summary: 'Success Message', detail: res.message });
        }
        else {
          this.service.add({ severity: 'error', summary: 'Error Message', detail: 'Something went wrong' });
        }
        this.loading = false;
      },
      error: () => {
        this.service.add({ severity: 'error', summary: 'Error Message', detail: 'Something went wrong' });
        this.loading = false;
      }
    });
  }

  updatePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      this.passwordForm.controls['password'].markAsDirty();
      this.passwordForm.controls['confirmPassword'].markAsDirty();
      return;
    }
    this.loadingPassword = true;

    const { password } = this.passwordForm.value;

    this.authService.UpdateProfile({ password }).subscribe({
      next: res => {
        if (res.success) {
          this.service.add({ severity: 'success', summary: 'Success Message', detail: res.message });
          this.passwordForm.controls['password'].reset();
          this.passwordForm.controls['confirmPassword'].reset();
        }
        else {
          this.service.add({ severity: 'error', summary: 'Error Message', detail: 'Something went wrong' });
        }
        this.loadingPassword = false;
      },
      error: () => {
        this.service.add({ severity: 'error', summary: 'Error Message', detail: 'Something went wrong' });
        this.loadingPassword = false;
      }
    });
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
