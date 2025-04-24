import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppConfigurator } from './app/layout/component/app.configurator';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, AppConfigurator, TranslateModule],
    template: `<router-outlet>
        <app-configurator/>
    </router-outlet>`
})
export class AppComponent {
    constructor(public translate: TranslateService) {
        translate.addLangs(['en', 'fr']);
        translate.setDefaultLang('en');

        // use the browser lang if it matches one of our locales
        const browser = translate.getBrowserLang() ?? 'en';
        this.translate.use(browser.match(/en|fr/) ? browser : 'en');
    }
}
