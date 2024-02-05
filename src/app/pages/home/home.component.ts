import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints,BreakpointState  } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls : [ './home.css'],
  
})
export class HomeComponent implements OnDestroy {
  private breakpointObserverSubscription: Subscription;
  constructor(private breakpointObserver: BreakpointObserver) {
    this.cols = this.calculateCols(window.innerWidth);

    this.breakpointObserverSubscription = this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet, Breakpoints.Web])
      .subscribe((state: BreakpointState) => {
        this.cols = this.calculateCols(window.innerWidth);
      });
  }
  category: string | undefined;
  cols = 3;

  ngOnDestroy() {
    this.breakpointObserverSubscription.unsubscribe();
  }

  ngOnInit(): void {
  }

  onShowCategory(newCategory: string): void{
    this.category = newCategory
  }

  private calculateCols(windowWidth: number): number {
    if (windowWidth >= 1200) {
      return 4;
    } else if (windowWidth >= 1000) {
      return 3;
    } else if (windowWidth >= 600) {
      return 2;
    } else {
      return 1;
    }
  }

}
