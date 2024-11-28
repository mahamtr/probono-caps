import { Component } from '@angular/core';
import { HeroService } from './hero.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'caps-client';

  constructor(private sharedService: HeroService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.refreshList();
    }, 2000);
  }
  refreshList() {
    this.sharedService.getData().subscribe((data) => {
      console.log(data);
    });
  }
}
