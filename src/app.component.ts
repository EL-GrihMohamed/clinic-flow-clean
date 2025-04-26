import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppConfigurator } from './app/layout/component/app.configurator';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from './app/services/local-storage.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, AppConfigurator, TranslateModule],
    template: `<router-outlet>
        <app-configurator/>
    </router-outlet>`
})
export class AppComponent {
    constructor(public translate: TranslateService, private storage: LocalStorageService) {
        translate.addLangs(['en', 'fr']);
        
        // use the browser lang if it matches one of our locales
        const browser = translate.getBrowserLang() ?? 'en';
        const defaultBrowser = browser.match(/en|fr/) ? browser : 'en';
        const defaultLang = this.storage.getLang() ?? defaultBrowser;
        translate.setDefaultLang(defaultLang);

        this.storage.setLang(defaultLang);
    }
}
