import { Injectable } from '@angular/core';
import { Event, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  /** Emits `true` while any lazy module is being loaded */
  public loading$ = new BehaviorSubject<boolean>(false);
  private pendingLoads = 0;

  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof RouteConfigLoadStart) {
        this.pendingLoads++;
        this.loading$.next(true);
      } else if (event instanceof RouteConfigLoadEnd) {
        this.pendingLoads = Math.max(0, this.pendingLoads - 1);
        if (this.pendingLoads === 0) {
          this.loading$.next(false);
        }
      }
    });
  }
}