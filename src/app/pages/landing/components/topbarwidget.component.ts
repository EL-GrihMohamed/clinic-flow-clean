import { Component } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from '../../../layout/service/layout.service';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'topbar-widget',
    imports: [RouterModule, StyleClassModule, ButtonModule, RippleModule, TranslateModule, CommonModule],
    templateUrl : './topbarwidget.component.html'
})
export class TopbarWidget {

    constructor(public router: Router, public layoutService: LayoutService, public translate: TranslateService) { }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    changeLanguage(lang?: any) {
        this.translate.use(lang?.value ?? 'en');
    }
}
