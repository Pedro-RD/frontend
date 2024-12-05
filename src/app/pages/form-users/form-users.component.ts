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
import { UserDTO, UserRxpDTO } from '../../interfaces/user';
import { Role } from '../../interfaces/roles.enum';
import { UserEmployee } from '../../interfaces/employee';
import { Location } from '@angular/common';


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
  initialData = input<UserRxpDTO | undefined>();
  createRequested = output<UserEmployee>();

  constructor(private location: Location) {
  }

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
  contractStart = new FormControl<string>(new Date().toISOString().substring(0, 10), [Validators.required]);
  contractEnds = new FormControl<string>( new Date().toISOString().substring(0, 10),[Validators.required]);
  salary = new FormControl<number | null>(0, [Validators.required]);


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

      if (data.role !== Role.Relative) {
        this.contractStart.setValue(new Date(data.employee?.contractStart || 0).toISOString().substring(0, 10));
        this.contractEnds.setValue(new Date(data.employee?.contractEnds || 0).toISOString().substring(0, 10));
        this.salary.setValue(data.employee?.salary || null);
      }

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
        salary: parseFloat(`${this.salary.value!}`),
        contractStart: new Date(this.contractStart.value!),
        contractEnds: new Date(this.contractEnds.value!),
      });
    }
  }

  protected readonly environment = environment;
  protected readonly nationalities = nationalities;

  onRoleChange() {
    /*const selectedRole = this.role.value;

    //add funcionaries inputs
    if (selectedRole == 'manager' || selectedRole == 'caretaker') {
      if (!this.form.contains('contractStart'))
        this.form.addControl('contractStart', new FormControl('', Validators.required));
      if (!this.form.contains('contractEnd'))
        this.form.addControl('contractEnd', new FormControl('', Validators.required));
      if (!this.form.contains('salary'))
        this.form.addControl('salary', new FormControl('', Validators.required));
    }
    //remove funcionaries inputs
    else {
      if (this.form.contains('contractStart'))
        this.form.removeControl('contractStart');
      if (this.form.contains('contractEnd'))
        this.form.removeControl('contractEnd');
      if (this.form.contains('salary'))
        this.form.removeControl('salary');
    }*/
  }

  protected readonly FormControl = FormControl;

  goBack() {
    this.location.back();
  }
}
