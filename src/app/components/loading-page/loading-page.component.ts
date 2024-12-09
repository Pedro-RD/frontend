import { Component, inject } from '@angular/core';
import { LoadingService } from '../../services/helpers/loading.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-loading-page',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './loading-page.component.html',
})
export class LoadingPageComponent {
  private loadingService = inject(LoadingService);

  get loading$() {
    return this.loadingService.loading$;
  }
}
