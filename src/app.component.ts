import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppConfigurator } from './app/layout/component/app.configurator';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from './app/core/services/local-storage.service';
import { LoadingSpinnerComponent } from './app/layout/component/loading-spinner/loading-spinner.component';
import { LoaderService } from './app/layout/service/loader.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [LoadingSpinnerComponent, RouterModule, AppConfigurator, TranslateModule, CommonModule],
    template: `
    <app-loading-spinner [show]="(loader.loading$ | async) ?? false"></app-loading-spinner>
    <router-outlet>
        <app-configurator/>
    </router-outlet>
    `
})
export class AppComponent {
    constructor(
        public translate: TranslateService, 
        private storage: LocalStorageService,
        public loader: LoaderService) {
        translate.addLangs(['en', 'fr']);

        // use the browser lang if it matches one of our locales
        const browser = translate.getBrowserLang() ?? 'en';
        const defaultBrowser = browser.match(/en|fr/) ? browser : 'en';
        const defaultLang = this.storage.getLang() ?? defaultBrowser;
        translate.setDefaultLang(defaultLang);

        this.storage.setLang(defaultLang);
    }
}
