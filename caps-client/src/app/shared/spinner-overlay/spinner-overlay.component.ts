import { Component } from '@angular/core';
import { LoadingService } from '../loading.service';

@Component({
  selector: 'app-spinner-overlay',
  templateUrl: './spinner-overlay.component.html',
  styleUrls: ['./spinner-overlay.component.scss'],
})
export class SpinnerOverlayComponent {
  constructor(public loadingService: LoadingService) {}
}
