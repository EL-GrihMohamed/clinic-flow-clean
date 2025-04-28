import { Directive, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[hasRole]'
})
export class HasRoleDirective implements OnDestroy {
  private subscription: Subscription;
  private hasView = false;
  private requiredRoles: string[] = [];

  /** bind your roles: *hasRole="['Admin','Manager']" or *hasRole="'Admin'" */
  @Input()
  set hasRole(val: string | string[]) {
    this.requiredRoles = Array.isArray(val) ? val : [val];
    this.updateView();
  }

  /** optional “else” template: *hasRole="['A']; else noAccessTpl" */
  @Input()
  hasRoleElse: TemplateRef<any> | null = null;

  constructor(
    private tpl: TemplateRef<any>,
    private vc: ViewContainerRef,
    private auth: AuthService
  ) {
    // re-evaluate whenever roles change
    this.subscription = this.auth.userRoles$.subscribe(() => this.updateView());
  }

  private updateView() {
    const userRoles = this.auth.getRoles();
    const allowed = this.requiredRoles.some(r => userRoles.includes(r));
    
    this.vc.clear();
    if (allowed || this.requiredRoles.includes('all') || userRoles.includes('admin')) {
      this.vc.createEmbeddedView(this.tpl);
      this.hasView = true;
    } else if (this.hasRoleElse) {
      this.vc.createEmbeddedView(this.hasRoleElse);
      this.hasView = false;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
