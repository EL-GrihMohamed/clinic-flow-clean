import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '../../../services/local-storage.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'footer-widget',
    imports: [RouterModule, TranslateModule, FormsModule, CommonModule],
    templateUrl: './footerwidget.component.html'
})
export class FooterWidget {

    constructor(public router: Router, public translate: TranslateService, public storage: LocalStorageService) { }

    changeLanguage(lang?: any) {
        this.storage.setLang(lang?.value ?? 'en');
    }
}
