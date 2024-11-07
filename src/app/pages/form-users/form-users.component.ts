import { Component } from '@angular/core';
import { InputComponent } from '../../components/forms/input/input.component';
import { AutoCompleteComponent } from '../../components/forms/auto-complete/auto-complete.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectBoxComponent } from '../../components/forms/select-box/select-box.component';
import { environment } from '../../../environments/environment';
import { nationalities } from '../../data/nationalities';
import { ButtonComponent } from '../../components/forms/button/button.component';

@Component({
  selector: 'app-form-users',
  standalone: true,
  imports: [
    InputComponent,
    AutoCompleteComponent,
    SelectBoxComponent,
    ButtonComponent,
  ],
  templateUrl: './form-users.component.html',
  styleUrl: './form-users.component.css',
})
export class FormUsersComponent {
  email = new FormControl('', [Validators.required, Validators.email]);
  phoneNumber = new FormControl('', [Validators.required, Validators.minLength(7)]);
  password = new FormControl('', [Validators.required, Validators.minLength(8)]);
  repeatPassword = new FormControl('', [Validators.required, Validators.minLength(8)]);
  address = new FormControl('', [Validators.required]);
  city = new FormControl('', [Validators.required]);
  postcode = new FormControl('', [Validators.required]);
  nationality = new FormControl('', [Validators.required]);
  fiscalCode = new FormControl('', [Validators.required]);
  role = new FormControl('', [Validators.required]);

  form: FormGroup = new FormGroup({
    email: this.email,
    password: this.password,
    repeatPassword: this.repeatPassword,
    address: this.address,
    city: this.city,
    postcode: this.postcode,
    nationality: this.nationality,
    role: this.role,
  });
  protected readonly environment = environment;
  protected readonly nationalities = nationalities;
}
