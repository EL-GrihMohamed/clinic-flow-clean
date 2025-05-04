import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, MessageModule, InputTextModule, PasswordModule, FormsModule, ReactiveFormsModule, RouterModule, RippleModule, AppFloatingConfigurator, TranslatePipe, CommonModule],
    templateUrl: './login.component.html'
})
export class Login implements OnInit {
    loginForm!: FormGroup;
    errMessage: string = '';
    loading = false;

    constructor(
        private authService: AuthService,
        private storageService: LocalStorageService,
        private fb: FormBuilder,
        private router: Router,
        private translate: TranslateService
    ) { }

    ngOnInit() {
        this.authService.getProfile().subscribe({
            next: res => {
                if (res?.success)
                    this.router.navigate(["/dashboard"]);
            },
            error: () => { }
        });
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    onLogin() {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            this.loginForm.controls['username'].markAsDirty();
            this.loginForm.controls['password'].markAsDirty();
            return;
        }
        this.loading = true;

        const { username, password } = this.loginForm.value;

        this.authService.login(username, password).subscribe({
            next: res => {
                if (!res?.accessToken)
                    this.errMessage = this.translate.instant("login.invalid");
                else {
                    this.storageService.setToken(res.accessToken);
                    this.router.navigate(["/dashboard"]);
                }
                this.loading = false;
            },
            error: () => {
                this.errMessage = this.translate.instant("login.invalid-user");
                this.loading = false;
            }
        });
    }
}
