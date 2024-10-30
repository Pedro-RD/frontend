import {Component, OnDestroy, OnInit, output} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, distinctUntilChanged, Subscription, tap} from 'rxjs';

@Component({
  selector: 'app-select-limit',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './select-limit.component.html',
  styleUrl: './select-limit.component.css'
})
export class SelectLimitComponent implements OnInit, OnDestroy {
  selectFormControl = new FormControl(10);
  subscription?: Subscription;

  valueSelected = output<number>();

  ngOnInit(): void {
    this.subscription = this.selectFormControl.valueChanges
      .pipe(
        debounceTime(10),
        distinctUntilChanged(),
      )
      .subscribe((val) => {
        if (val) this.valueSelected.emit(val);
      })
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
