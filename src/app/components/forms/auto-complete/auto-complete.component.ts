import {Component, computed, effect, Input, input, OnInit, signal} from '@angular/core';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-auto-complete',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './auto-complete.component.html',
  styleUrl: './auto-complete.component.css'
})
export class AutoCompleteComponent implements OnInit {
  // Required inputs
  items = input.required<string[]>();

  // Optional inputs with defaults
  label = input<string>('');
  placeholder = input<string>('');
  type = input<string>('text');
  required = input<boolean>(false);
  minChars = input<number>(1);

  // Internal state
  // control = input.required<FormControl<string | null>>();
  @Input({required: true}) control!: FormControl<string | null>
  isOpen = signal(false);
  selectedIndex = signal(-1);

  // Computed values
  filteredItems = computed(() => {
    const search = this.control.value?.toLowerCase() || '';
    if (!search || search.length < this.minChars()) {
      return [];
    }
    return this.items().filter((item) =>
      item.toLowerCase().includes(search)
    );
  });

  errorMessage = computed(() => {
    if (this.control.invalid && this.control.touched) {
      if (this.control.errors?.['required']) {
        return 'This field is required';
      }
      // Add other error cases as needed
    }
    return '';
  });

  constructor() {
    // Handle keyboard navigation
    effect(() => {
      if (this.isOpen()) {
        document.addEventListener('keydown', this.handleKeydown.bind(this));
      } else {
        document.removeEventListener('keydown', this.handleKeydown.bind(this));
      }
    });
  }


  ngOnInit(): void {
    // Setup search with debounce
    this.control.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.selectedIndex.set(-1);
      if (this.control.value) {
        this.isOpen.set(true);
      }
    });
  }

  showDropdown(): void {
    if (this.control.value) {
      this.isOpen.set(true);
    }
  }

  onBlur(): void {
    // Delay closing to allow click events on dropdown
    setTimeout(() => this.isOpen.set(false), 200);
  }

  selectItem(item: string): void {
    this.control.setValue(item);
    this.isOpen.set(false);
  }

  private handleKeydown(event: KeyboardEvent): void {
    const items = this.filteredItems();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedIndex.update(i =>
          i < items.length - 1 ? i + 1 : 0
        );
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.selectedIndex.update(i =>
          i > 0 ? i - 1 : items.length - 1
        );
        break;

      case 'Enter':
        event.preventDefault();
        const selectedItem = items[this.selectedIndex()];
        if (selectedItem) {
          this.selectItem(selectedItem);
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.isOpen.set(false);
        break;
    }
  }
}
