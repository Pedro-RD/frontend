import { Component, input, OnInit, output } from '@angular/core';
import { InputComponent } from '../../components/forms/input/input.component';
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
import { UserRxpDTO } from '../../interfaces/user';
import { Role, RolePt } from '../../interfaces/roles.enum';
import { UserEmployee } from '../../interfaces/employee';
import { Location, NgIf } from '@angular/common';

@Component({
  selector: 'app-form-users',
  standalone: true,
  imports: [
    InputComponent,
    SelectBoxComponent,
    ButtonComponent,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './form-users.component.html',
  styleUrl: './form-users.component.css',
})
export class FormUsersComponent implements OnInit {
  initialData = input<UserRxpDTO | undefined>();
  createRequested = output<UserEmployee>();

  constructor(private location: Location) {}

  name = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);
  phoneNumber = new FormControl('', [
    Validators.required,
    Validators.minLength(7),
    Validators.maxLength(15),
    Validators.pattern(/^[0-9\s+]*$/),
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
  contractStart = new FormControl<string>(
    new Date().toISOString().substring(0, 10),
    [Validators.required],
  );
  contractEnds = new FormControl<string>(
    // next day
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
      .toISOString()
      .substring(0, 10),

    [Validators.required],
  );

  salary = new FormControl<number | null>(820, [
    Validators.required,
    Validators.min(820),
  ]);

  private passwordMatchValidator: ValidatorFn = (
    group: AbstractControl,
  ): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const repeatPassword = group.get('repeatPassword')?.value;
    return password === repeatPassword ? null : { passwordMismatch: true };
  };

  // if role is not relative salary must be more than 820
  private salaryValidator: ValidatorFn = (
    control: AbstractControl,
  ): ValidationErrors | null => {
    const role = control.get('role')?.value;
    const salary = control.get('salary')?.value;

    if (role !== Role.Relative && salary < 820) {
      return { salaryTooLow: true };
    }
    return null;
  };

  // end contract must be after start contract
  private contractEndsValidator: ValidatorFn = (
    control: AbstractControl,
  ): ValidationErrors | null => {
    const start = control.get('contractStart')?.value;
    const end = control.get('contractEnds')?.value;

    if (new Date(start) > new Date(end)) {
      return { contractEndsBeforeStart: true };
    }

    return null;
  };

  form = new FormGroup(
    {
      name: this.name,
      email: this.email,
      phoneNumber: this.phoneNumber,
      fiscalCode: this.fiscalCode,
      password: this.password,
      repeatPassword: this.repeatPassword,
      address: this.address,
      city: this.city,
      postcode: this.postcode,
      nationality: this.nationality,
      role: this.role,
      contractStart: this.contractStart,
      contractEnds: this.contractEnds,
      salary: this.salary,
    },
    {
      validators: [
        this.passwordMatchValidator,
        this.salaryValidator,
        this.contractEndsValidator,
      ],
    },
  );

  roles = Object.values(Role).map((role) => ({
    value: role,
    label: this.translateRole(role),
  }));

  translateRole(role: Role | RolePt): RolePt {
    switch (role) {
      case Role.Manager:
        return RolePt.Manager;
      case Role.Caretaker:
        return RolePt.Cuidador;
      case Role.Relative:
        return RolePt.Familiar;
      default:
        return RolePt.Desconhecido;
    }
  }
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
      this.role.setValue(data.role as Role);

      if (data.role !== Role.Relative) {
        this.contractStart.setValue(
          new Date(data.employee?.contractStart || 0)
            .toISOString()
            .substring(0, 10),
        );
        this.contractEnds.setValue(
          new Date(data.employee?.contractEnds || 0)
            .toISOString()
            .substring(0, 10),
        );
        this.salary.setValue(data.employee?.salary || null);
      }

      let nationalityOption = this.nationalities.find(
        (n) => n.value === data.nationality,
      );

      if (!nationalityOption) {
        nationalityOption = this.nationalities.find(
          (n) =>
            n.value.toLowerCase() === data.nationality.toLowerCase() ||
            n.label.toLowerCase() === data.nationality.toLowerCase(),
        );
      }

      if (nationalityOption) {
        this.nationality.setValue(nationalityOption.value);
      } else {
        this.nationalities.push({
          value: data.nationality,
          label: data.nationality,
        });
        this.nationality.setValue(data.nationality);
      }

      this.password.setValue('ExamplePassword');
      this.repeatPassword.setValue('ExamplePassword');
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.markAllAsTouched();
      if (!environment.production)
        console.log('Form invalid:', this.form.value, this.form.errors);
      if (this.form.errors && this.form.errors['passwordMismatch']) {
        this.repeatPassword.setErrors({ passwordMismatch: true });
      }
      if (this.form.errors && this.form.errors['salaryTooLow']) {
        this.salary.setErrors({ salaryTooLow: true });
      }
      if (this.form.errors && this.form.errors['contractEndsBeforeStart']) {
        this.contractEnds.setErrors({ contractEndsBeforeStart: true });
      }
      return;
    }
    console.log('Form submitted:', this.form.value, this.form.valid);
    console.log(
      'this.salary.value',
      this.salary.value,
      typeof this.salary.value,
    );

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

  private markAllAsTouched() {
    Object.values(this.form.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  protected readonly environment = environment;
  protected readonly nationalities = nationalities;

  onRoleChange() {}

  protected readonly FormControl = FormControl;

  goBack() {
    this.location.back();
  }
}
