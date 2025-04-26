import { Component, computed, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '../service/layout.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../../services/local-storage.service';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
    selector: 'app-floating-configurator',
    imports: [ButtonModule, StyleClassModule, FormsModule, TranslateModule, CommonModule],
    template: `
        <div class="fixed flex justify-between top-0 left-0 w-full p-8">
            <p-button type="button" (onClick)="goBack()" severity="secondary">
                <i class="pi pi-chevron-left"></i>
                {{ 'navigation.go-back' | translate }}
            </p-button>
            <div class="flex gap-4">
                <p-button type="button" (onClick)="toggleDarkMode()" [icon]="isDarkTheme() ? 'pi pi-moon' : 'pi pi-sun'" severity="secondary" />
                <div class="p-ripple p-button p-button-secondary" >
                    <i class="pi pi-globe"></i>
                    <select class="bg-transparent" (change)="changeLanguage($event.target)" name="lang" [(ngModel)]="storage.lang">
                        <option *ngFor="let lang of translate.getLangs()" [value]="lang">
                            {{ lang.toUpperCase() }}
                        </option>
                    </select>
                </div>
            </div>
        </div>
    `
})
export class AppFloatingConfigurator {
    LayoutService = inject(LayoutService);

    isDarkTheme = computed(() => this.LayoutService.layoutConfig().darkTheme);

    constructor(public translate: TranslateService, public storage: LocalStorageService, private location: Location) { }

    toggleDarkMode() {
        this.LayoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    changeLanguage(lang?: any): void{
        this.storage.setLang(lang?.value ?? 'en');
    }

    goBack(): void{
        this.location.back();
    }
}
