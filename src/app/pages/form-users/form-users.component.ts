import { Component, input, OnInit, output } from '@angular/core';
import { InputComponent } from '../../components/forms/input/input.component';
import { AutoCompleteComponent } from '../../components/forms/auto-complete/auto-complete.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { SelectBoxComponent } from '../../components/forms/select-box/select-box.component';
import { environment } from '../../../environments/environment';
import { nationalities } from '../../data/nationalities';
import { ButtonComponent } from '../../components/forms/button/button.component';
import { UserDTO } from '../../interfaces/user';
import { Role } from '../../interfaces/roles.enum';

@Component({
  selector: 'app-form-users',
  standalone: true,
  imports: [
    InputComponent,
    AutoCompleteComponent,
    SelectBoxComponent,
    ButtonComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './form-users.component.html',
  styleUrl: './form-users.component.css',
})
export class FormUsersComponent implements OnInit {
  initialData = input<UserDTO | undefined>();
  createRequested = output<UserDTO>();

  name = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);
  phoneNumber = new FormControl('', [
    Validators.required,
    Validators.minLength(7),
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
  ]);
  repeatPassword = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
  ]);
  address = new FormControl('', [Validators.required]);
  city = new FormControl('', [Validators.required]);
  postcode = new FormControl('', [Validators.required]);
  nationality = new FormControl('', [Validators.required]);
  fiscalCode = new FormControl('', [Validators.required]);
  role = new FormControl<Role | ''>('', [Validators.required]);

  private passwordMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('password');
      const repeatPassword = formGroup.get('repeatPassword');

      if (password?.value === repeatPassword?.value) {
        return null;
      }
      return { passwordMismatch: true };
    };
  }

  form: FormGroup = new FormGroup({
    name: this.name,
    email: this.email,
    password: this.password,
    repeatPassword: this.repeatPassword,
    address: this.address,
    city: this.city,
    postcode: this.postcode,
    nationality: this.nationality,
    role: this.role,
  }, { validators: this.passwordMatchValidator() });

  roles = Object.values(Role).map((role) => ({
    value: role,
    label: String(role).charAt(0).toUpperCase() + String(role).slice(1),
  }));

  ngOnInit() {
    if (this.initialData()) {
      const data = this.initialData()!;
      this.name.setValue(data.name);
      this.email.setValue(data.email);
      this.phoneNumber.setValue(data.phoneNumber);
      this.address.setValue(data.address);
      this.city.setValue(data.city);
      this.postcode.setValue(data.postcode);
      this.fiscalCode.setValue(data.fiscalId);
      this.role.setValue(data.role);

      let nationalityOption = this.nationalities.find(n => n.value === data.nationality);
      
      if (!nationalityOption) {
        nationalityOption = this.nationalities.find(n => 
          n.value.toLowerCase() === data.nationality.toLowerCase() ||
          n.label.toLowerCase() === data.nationality.toLowerCase()
        );
      }
      
      
      if (nationalityOption) {
        this.nationality.setValue(nationalityOption.value);
      } else {
        this.nationalities.push({
          value: data.nationality,
          label: data.nationality
        });
        this.nationality.setValue(data.nationality);
      }

      // Clear all password-related validators
      this.password.clearValidators();
      this.repeatPassword.clearValidators();
      this.form.clearValidators();
      this.password.updateValueAndValidity();
      this.repeatPassword.updateValueAndValidity();
      this.form.updateValueAndValidity();
    }
  }

  onSubmit() {
    console.log('Form submitted:', this.form.value, this.form.valid);
    if (this.form.valid) {
      this.createRequested.emit({
        name: this.name.value!,
        email: this.email.value!,
        phoneNumber: this.phoneNumber.value!,
        password: this.password.value!,
        address: this.address.value!,
        city: this.city.value!,
        postcode: this.postcode.value!,
        fiscalId: this.fiscalCode.value!,
        nationality: this.nationality.value!,
        role: this.role.value! as Role,
      });
    }
  }

  protected readonly environment = environment;
  protected readonly nationalities = nationalities;
}
