import { Component } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from '../../../layout/service/layout.service';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '../../../services/local-storage.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'topbar-widget',
    imports: [RouterModule, StyleClassModule, ButtonModule, RippleModule, TranslateModule, FormsModule, CommonModule],
    templateUrl: './topbarwidget.component.html'
})
export class TopbarWidget {

    constructor(public router: Router, public layoutService: LayoutService, public translate: TranslateService, public storage: LocalStorageService) {}

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    changeLanguage(lang?: any) {
        this.storage.setLang(lang?.value);
    }
}
