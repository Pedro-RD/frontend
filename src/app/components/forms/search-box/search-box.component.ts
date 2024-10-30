import {Component, OnDestroy, OnInit, output} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, Subscription} from 'rxjs';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.css',
})
export class SearchBoxComponent implements OnInit, OnDestroy {
  onSearch = output<string>();
  subscription: Subscription | null = null;

  searchInputControl = new FormControl({
    value: '',
    disabled: false,
  });

  ngOnInit(): void {
    this.subscription = this.searchInputControl.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(
      (value) => {
        this.onSearch.emit(value || '');
      },
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
