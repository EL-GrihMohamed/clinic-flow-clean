import { Component, computed, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '../service/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-floating-configurator',
    imports: [ButtonModule, StyleClassModule, CommonModule],
    template: `
        <div class="fixed flex gap-4 top-8 right-8">
            <p-button type="button" (onClick)="toggleDarkMode()" [icon]="isDarkTheme() ? 'pi pi-moon' : 'pi pi-sun'" severity="secondary" />
            <div class="p-ripple p-button p-button-secondary" >
                <i class="pi pi-globe"></i>
                <select class="bg-transparent" (change)="changeLanguage($event.target)">
                    <option *ngFor="let lang of translate.getLangs()" [value]="lang">
                        {{ lang.toUpperCase() }}
                    </option>
                </select>
            </div>
        </div>
    `
})
export class AppFloatingConfigurator {
    LayoutService = inject(LayoutService);

    isDarkTheme = computed(() => this.LayoutService.layoutConfig().darkTheme);

    constructor(public translate: TranslateService) { }

    toggleDarkMode() {
        this.LayoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    changeLanguage(lang?: any) {
        this.translate.use(lang?.value ?? 'en');
    }
}
