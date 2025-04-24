import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, TranslatePipe],
    template: `
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div class="rounded-3xl" style="padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-12 px-10 rounded-3xl">
                        <div class="text-center mb-8">
                            <img class="h-28 mb-10 mx-auto" src="/assets/images/Massahaty-Al-Nakhil.png" alt="">
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">{{ 'login.welcome' | translate }}!</div>
                            <span class="text-muted-color font-medium">{{ 'login.welcome-details' | translate }}</span>
                        </div>

                        <div>
                            <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">{{ 'login.email' | translate }}</label>
                            <input pInputText id="email1" type="text" placeholder="{{ 'login.email-address' | translate }}" class="w-full md:w-[30rem] mb-8" [(ngModel)]="email" />

                            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">{{ 'login.password' | translate }}</label>
                            <p-password id="password1" [(ngModel)]="password" placeholder="{{ 'login.password' | translate }}" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>

                            <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                                <div class="flex items-center">
                                    <p-checkbox [(ngModel)]="checked" id="rememberme1" binary class="mr-2"></p-checkbox>
                                    <label for="rememberme1">{{ 'login.remember-me' | translate }}</label>
                                </div>
                                <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">{{ 'login.forgot-password' | translate }}?</span>
                            </div>
                            <p-button label="{{ 'login.sign-in' | translate }}" styleClass="w-full" routerLink="/"></p-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Login {
    email: string = '';

    password: string = '';

    checked: boolean = false;
}
