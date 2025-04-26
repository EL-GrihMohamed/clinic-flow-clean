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
import { AuthService } from '../../services/auth.service';
import { LocalStorageService } from '../../services/local-storage.service';
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
        this.authService.getUser().subscribe({
            next: res => {
                this.router.navigate(["/dashboard"]);
            },
            error: ()=> {}
        });
        this.loginForm = this.fb.group({
            userName: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    onLogin() {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }
        this.loading = true;

        const { userName, password } = this.loginForm.value;

        this.authService.login(userName, password).subscribe({
            next: res => {
                if (!res.access_token)
                    this.errMessage = this.translate.instant("login.invalid");
                else {
                    this.storageService.setToken(res.access_token);
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
