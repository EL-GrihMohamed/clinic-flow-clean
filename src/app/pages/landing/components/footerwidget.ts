import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'footer-widget',
    imports: [RouterModule, TranslateModule, CommonModule],
    templateUrl: './footerwidget.component.html'
})
export class FooterWidget {
    constructor(public router: Router, public translate: TranslateService) { }

    changeLanguage(lang?: any) {
        this.translate.use(lang?.value ?? 'en');
    }
}
