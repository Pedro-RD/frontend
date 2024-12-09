import { Component, OnInit, output, input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../../forms/input/input.component';
import { SelectBoxComponent } from '../../forms/select-box/select-box.component';
import { ButtonComponent } from '../../forms/button/button.component';
import { ResidentDTO } from '../../../interfaces/resident';
import { CivilStatus } from '../../../interfaces/civil-status.enum';
import { Diet } from '../../../interfaces/diet.enum';
import { environment } from '../../../../environments/environment';
import { nationalities } from '../../../data/nationalities';
import { Mobility } from '../../../interfaces/mobility.enum';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { SelectBoxMultipleComponent } from '../../forms/select-box-multiple/select-box-multiple.component';
import { Location } from '@angular/common';
import { User } from '../../../interfaces/user';

@Component({
  selector: 'app-form-residents',
  standalone: true,
  imports: [
    InputComponent,
    SelectBoxComponent,
    ButtonComponent,
    ReactiveFormsModule,
    SelectBoxMultipleComponent,
  ],
  templateUrl: './form-residents.component.html',
  styleUrls: ['./form-residents.component.css'],
})
export class FormResidentsComponent implements OnInit {
  initialData = input<ResidentDTO | undefined>();
  createRequested = output<ResidentDTO>();
  bedNumbers: { value: string; label: string }[] = [];
  relativeOptions: { value: number; label: string }[] = [];
  budget: number | null = null;

  // Definindo os controles do formulário com os tipos corretos
  name = new FormControl<string>('', [Validators.required]);
  fiscalId = new FormControl<string>('', [
    Validators.required,
    Validators.pattern(/^\d+$/),
  ]);
  birthDate = new FormControl<string>(
    new Date().toISOString().substring(0, 10),
    [Validators.required],
  );
  specificCare = new FormControl<string | ''>('', [Validators.required]);
  civilStatus = new FormControl<CivilStatus | ''>('', [Validators.required]);
  nationality = new FormControl('', [Validators.required]);
  diet = new FormControl<Diet | ''>('', [Validators.required]);
  dietRestrictions = new FormControl<string>('');
  allergies = new FormControl<string>('');
  bedNumber = new FormControl('', [Validators.required]);
  relatives = new FormControl<number[] | null>([], [Validators.required]);
  mobility = new FormControl<Mobility | ''>('', [Validators.required]);

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
    mobility: this.mobility,
  });

  goBack() {
    this.location.back();
  }

  mobilityIssues = Object.values(Mobility).map((mobility) => ({
    value: mobility,
    label: String(mobility).charAt(0).toUpperCase() + String(mobility).slice(1),
  }));

  civilStatuses = Object.values(CivilStatus).map((status) => ({
    value: status,
    label: String(status).charAt(0).toUpperCase() + String(status).slice(1),
  }));

  diets = Object.values(Diet).map((diet) => ({
    value: diet,
    label: String(diet).charAt(0).toUpperCase() + String(diet).slice(1),
  }));

  constructor(private http: HttpClient, private location: Location) {}

  ngOnInit() {
    // Buscar mensalidade ao alterar mobilidade
    this.mobility.valueChanges.subscribe((selectedMobility) => {
      if (selectedMobility) {
        this.fetchBudget(selectedMobility);
      } else {
        this.budget = null;
      }
    });

    // Sempre buscar as camas disponíveis
    firstValueFrom(
      this.http.get<{ beds: number[] }>(
        `${this.environment.apiUrl}residents/beds`,
      ),
    ).then((response) => {
      if (response && Array.isArray(response.beds)) {
        this.bedNumbers = response.beds.map((bed) => ({
          value: bed.toString(),
          label: bed.toString(),
        }));

        if (this.initialData()) {
          const data = this.initialData()!;

          let bedOption = this.bedNumbers.find(
            (b) => b.value === data.bedNumber.toString(),
          );
          if (!bedOption) {
            this.bedNumbers.push({
              value: data.bedNumber.toString(),
              label: data.bedNumber.toString(),
            });
          }
          this.bedNumber.setValue(data.bedNumber.toString());
        }
      }
    });

    firstValueFrom(
      this.http.get<{ data: { id: number; name: string; email: string }[] }>(
        `${this.environment.apiUrl}users?role=relative`,
      ),
    )
      .then((response) => {
        console.log('Resposta da API de parentes:', response); // Log para verificar a estrutura da resposta

        if (response && Array.isArray(response.data)) {
          // Mapear os parentes para o formato necessário, garantindo que os IDs sejam válidos
          this.relativeOptions = response.data
            .map((relative) => {
              if (!Number.isInteger(relative.id)) {
                console.error(`ID inválido encontrado: ${relative.id}`);
                return null; // Ignorar valores inválidos
              }

              return {
                value: relative.id,
                label: `${relative.name} (${relative.email})`,
              };
            })
            .filter((option) => option !== null); // Remover opções inválidas

          // Configurar parentes iniciais se `initialData` estiver presente
          if (this.initialData()) {
            const relativeIds = this.initialData()!.relatives || [];
            const sanitizedIds = relativeIds.filter((id) =>
              Number.isInteger(id),
            ); // Garantir que são inteiros

            // Validar se os IDs existem nas opções disponíveis
            sanitizedIds.forEach((id) => {
              if (!this.relativeOptions.some((option) => option.value === id)) {
                console.warn(`ID de parente inválido ou não listado: ${id}`);
              }
            });

            // Atualizar o controle com os parentes válidos
            // this.relatives.setValue(sanitizedIds);

            // Marcar os parentes previamente selecionados como selecionados
            this.relativeOptions = this.relativeOptions.map((option) => ({
              ...option,
              selected: sanitizedIds.includes(option.value), // Adiciona a propriedade 'selected'
            }));
          }
        } else {
          console.error(
            'Falha ao carregar parentes. Estrutura de resposta inesperada:',
            response,
          );
        }
      })
      .catch((error) => {
        console.error('Erro ao buscar parentes:', error);
      });

    // Configurar os dados iniciais apenas se `initialData` estiver presente
    if (this.initialData()) {
      const data = this.initialData()!;
      this.name.setValue(data.name);
      this.fiscalId.setValue(data.fiscalId);
      this.birthDate.setValue(
        new Date(data.birthDate).toISOString().substring(0, 10),
      );
      this.specificCare.setValue(data.specificCare);
      this.civilStatus.setValue(data.civilStatus);
      this.diet.setValue(data.diet);
      this.dietRestrictions.setValue(data.dietRestrictions);
      this.allergies.setValue(data.allergies);
      this.mobility.setValue(data.mobility);

      // Configurar nacionalidade inicial
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
        this.relatives.setValue(
          data.relatives.map((r) =>
            isNaN(parseInt(`${r}`)) ? (r as User).id : parseInt(`${r}`),
          ),
        );
      }
    }
  }

  private async fetchBudget(mobility: Mobility) {
    try {
      const response = await firstValueFrom(
        this.http.get<{ budget: number }>(
          `${environment.apiUrl}residents/budget?mobility=${mobility}`,
        ),
      );

      if (response && typeof response.budget === 'number') {
        this.budget = response.budget; // Atualizar mensalidade com o valor retornado
      } else {
        console.error('Resposta inesperada:', response);
        this.budget = null;
      }
    } catch (error) {
      console.error('Erro ao buscar a mensalidade:', error);
      this.budget = null;
    }
  }

  onSubmit() {
    console.log(
      'Form submitted:',
      this.form.value,
      this.form.valid,
      this.form.errors,
    );

    if (this.form.valid) {
      const sanitizedRelatives =
        this.relatives.value?.filter((value) => Number.isInteger(value)) || [];

      // Verificar se todos os valores são inteiros válidos
      if (!sanitizedRelatives.every((value) => Number.isInteger(value))) {
        console.error(
          'Erro: Valores inválidos encontrados no campo relatives:',
          this.relatives.value,
        );
        return;
      }

      console.log(this.relatives);
      this.createRequested.emit({
        name: this.name.value!,
        fiscalId: this.fiscalId.value!,
        birthDate: new Date(this.birthDate.value!),
        specificCare: this.specificCare.value!,
        civilStatus: this.civilStatus.value! as CivilStatus,
        diet: this.diet.value! as Diet,
        dietRestrictions: this.dietRestrictions.value!,
        allergies: this.allergies.value!,
        bedNumber: parseInt(`${this.bedNumber.value!}`),
        relatives: sanitizedRelatives, // Apenas inteiros válidos
        nationality: this.nationality.value!,
        mobility: this.mobility.value! as Mobility,
      });
    }
  }

  protected readonly environment = environment;
  protected readonly nationalities = nationalities;
}
