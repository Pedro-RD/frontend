import { Component, OnInit, output, input} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../forms/input/input.component';
import { SelectBoxComponent, SelectBoxData } from '../../forms/select-box/select-box.component';
import { ButtonComponent } from '../../forms/button/button.component';
import { ResidentDTO } from '../../../interfaces/resident';
import { CivilStatus } from '../../../interfaces/civil-status.enum';
import { Diet } from '../../../interfaces/diet.enum';
import { AutoCompleteComponent } from '../../forms/auto-complete/auto-complete.component';
import {environment} from '../../../../environments/environment';
import {nationalities} from '../../../data/nationalities';
import { Mobility } from '../../../interfaces/mobility.enum';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';



@Component({
  selector: 'app-form-residents',
  standalone: true,
  imports: [
    InputComponent,
    AutoCompleteComponent,
    SelectBoxComponent,
    ButtonComponent,
    ReactiveFormsModule,

  ],
  templateUrl: './form-residents.component.html',
  styleUrls: ['./form-residents.component.css'],
})
export class FormResidentsComponent implements OnInit {
  initialData = input<ResidentDTO | undefined>();
  createRequested = output<ResidentDTO>();
  bedNumbers: { value: string, label: string }[] = [];
  relativeOptions: SelectBoxData<number[] | null>[] = [];




  // Definindo os controles do formulário com os tipos corretos
  name = new FormControl<string>('', [Validators.required]);
  fiscalId = new FormControl<string>('', [Validators.required, Validators.pattern(/^\d+$/)]);
  birthDate = new FormControl<string>( new Date().toISOString().substring(0, 10),[Validators.required]);
  specificCare = new FormControl<Mobility | ''>('', [Validators.required]);
  civilStatus = new FormControl<CivilStatus | ''>('', [Validators.required]);
  nationality = new FormControl('', [Validators.required]);
  diet = new FormControl<Diet | ''>('', [Validators.required]);
  dietRestrictions = new FormControl<string>('');
  allergies = new FormControl<string>('');
  bedNumber = new FormControl('', [Validators.required]);
  relatives = new FormControl<number[]>([], [Validators.required]); // Lista de IDs de parentes como `number[]`

  form: FormGroup = new FormGroup({
    name: this.name,
    fiscalId: this.fiscalId,
    birthDate: this.birthDate,
    specificCare: this.specificCare,
    civilStatus: this.civilStatus,
    nationality: this.nationality,
    diet: this.diet,
    dietRestrictions: this.dietRestrictions,
    allergies: this.allergies,
    bedNumber: this.bedNumber,
    relatives: this.relatives,
  });


  specificCareOptions = Object.values(Mobility).map(mobility => ({
    value: mobility,
    label: String(mobility).charAt(0).toUpperCase() + String(mobility).slice(1),
  }));

  civilStatuses = Object.values(CivilStatus).map(status => ({
    value: status,
    label: String(status).charAt(0).toUpperCase() + String(status).slice(1),
  }));

  diets = Object.values(Diet).map(diet => ({
    value: diet,
    label: String(diet).charAt(0).toUpperCase() + String(diet).slice(1),
  }));

  constructor(private http: HttpClient) {}


  ngOnInit() {
    if (this.initialData()) {
      const data = this.initialData()!;
      this.name.setValue(data.name);
      this.fiscalId.setValue(data.fiscalId);
      this.birthDate.setValue(new Date(data.birthDate).toISOString().substring(0, 10));
      this.specificCare.setValue(data.specificCare as Mobility);
      this.civilStatus.setValue(data.civilStatus);
      this.diet.setValue(data.diet);
      this.dietRestrictions.setValue(data.dietRestrictions);
      this.allergies.setValue(data.allergies);





      firstValueFrom(this.http.get<{ beds: number[] }>(`${this.environment.apiUrl}residents/beds`))
        .then(response => {
          if (response && Array.isArray(response.beds)) {
            this.bedNumbers = response.beds.map(bed => ({ value: bed.toString(), label: bed.toString() }));

            let bedOption = this.bedNumbers.find(b => b.value === data.bedNumber.toString());
            if (!bedOption) {
              bedOption = this.bedNumbers.find(b =>
                b.value === data.bedNumber.toString() ||
                b.label === data.bedNumber.toString()
              );
            }
            if (bedOption) {
              this.bedNumber.setValue(bedOption.value);
            } else {
              this.bedNumbers.push({
                value: data.bedNumber.toString(),
                label: data.bedNumber.toString()
              });
              this.bedNumber.setValue(data.bedNumber.toString());
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
          }
        });

      // Fetch relatives data
      firstValueFrom(this.http.get<{ relatives: { id: number, name: string, email: string }[] }>(`${this.environment.apiUrl}users?role=relative`))
        .then(response => {
          if (response && Array.isArray(response.relatives)) {
            this.relativeOptions = response.relatives.map(relative => ({
              value: [relative.id],
              label: `${relative.name} (${relative.email})`
            }));

            // Set initial relatives value
            const relativeIds = data.relatives || [];
            this.relatives.setValue(relativeIds);
          }
        });
    }
  }

  onSubmit() {
    console.log('Form submitted:', this.form.value, this.form.valid, this.form.errors);
    if (this.form.valid) {
      this.createRequested.emit({
        name: this.name.value!,
        fiscalId: this.fiscalId.value!,
        birthDate: new Date(this.birthDate.value!),
        specificCare: this.specificCare.value! as Mobility,
        civilStatus: this.civilStatus.value! as CivilStatus,
        diet: this.diet.value! as Diet,
        dietRestrictions: this.dietRestrictions.value!,
        allergies: this.allergies.value!,
        bedNumber: parseInt(`${this.bedNumber.value!}`),
        relatives: this.relatives.value!,
        nationality: this.nationality.value!,
      });
    }
  }
  protected readonly environment = environment;
  protected readonly nationalities = nationalities;
}
