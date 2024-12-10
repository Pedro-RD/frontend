import { Component, input, OnInit, output } from '@angular/core';
import { InputComponent } from '../forms/input/input.component';
import { SelectBoxComponent } from '../forms/select-box/select-box.component';
import { ButtonComponent } from '../forms/button/button.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Location, NgClass, NgIf } from '@angular/common';
import { PaymentDTO } from '../../interfaces/payment';
import { PaymentType } from '../../interfaces/payment-type.enum';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http'; // Import HttpClient

@Component({
  selector: 'app-form-residents-payment',
  standalone: true,
  imports: [
    InputComponent,
    SelectBoxComponent,
    ButtonComponent,
    ReactiveFormsModule,
    NgIf,
    NgClass,
  ],
  templateUrl: './form-residents-payment.component.html',
  styleUrl: './form-residents-payment.component.css',
})
export class FormResidentsPaymentComponent implements OnInit {
  isEditMode: boolean = false; // Indica se está no modo de edição
  constructor(private location: Location, private http: HttpClient) {} // Inject HttpClient

  goBack() {
    this.location.back();
  }

  initialData = input<PaymentDTO | undefined>();
  createRequested = output<PaymentDTO>();

  amount = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(0.01),
  ]);
  date = new FormControl<string>(new Date().toISOString().substring(0, 10), [
    Validators.required,
  ]);
  observation = new FormControl<string | undefined>(undefined, []);
  month = new FormControl<number | string | null>(null);
  year = new FormControl<number | string | null>(null);
  type = new FormControl<PaymentType | ''>('', [Validators.required]);

  form: FormGroup = new FormGroup({
    amount: this.amount,
    date: this.date,
    observation: this.observation,
    month: this.month,
    year: this.year,
    type: this.type,
  });

  types = Object.values(PaymentType).map((types) => ({
    value: types,
    label: String(types).charAt(0).toUpperCase() + String(types).slice(1),
  }));

  ngOnInit() {
    // Define se é modo de edição ou criação
    this.isEditMode = !!this.initialData();

    // Configuração inicial do formulário
    if (this.initialData()) {
      const data = this.initialData()!;
      this.amount.setValue(data.amount); // Preenche o valor do Montante no modo de edição
      this.date.setValue(new Date(data.date).toISOString().substring(0, 10));
      this.observation.setValue(data.observation);
      this.type.setValue(data.type as PaymentType);
      this.month.setValue(data.month || null);
      this.year.setValue(data.year || null);

      // Controla o estado do campo Montante no modo de edição
      if (data.type === PaymentType.Other) {
        this.amount.enable(); // Permite editar se o tipo for "Outros"
      } else {
        this.amount.disable(); // Desativa para outros tipos
      }
    }

    // Ajusta comportamento com base no tipo de pagamento apenas no modo de criação
    if (!this.isEditMode) {
      this.type.valueChanges.subscribe((selectedType) => {
        if (selectedType === PaymentType.MonthlyFee) {
          this.addMonthAndYearValidators();
          this.fetchMonthlyFee(1); // Substitua `1` pelo ID do residente conforme necessário
          this.amount.disable(); // Desativa o campo Montante
        } else if (selectedType === PaymentType.Other) {
          this.removeMonthAndYearValidators();
          this.amount.enable(); // Permite edição para "Outros"
        } else {
          this.removeMonthAndYearValidators();
          this.amount.setValue(null); // Limpa o valor
          this.amount.enable(); // Reativa o campo Montante
        }
      });
    }
  }

  private async fetchMonthlyFee(residentId: number) {
    try {
      const response = await firstValueFrom(
        this.http.get<{ monthlyFee: number }>(
          `${environment.apiUrl}residents/${residentId}`,
        ),
      );

      if (response && typeof response.monthlyFee === 'number') {
        this.amount.setValue(response.monthlyFee); // Atualiza o valor de Montante
      } else {
        console.error('Resposta inesperada da API:', response);
        this.amount.setValue(null); // Limpa o valor em caso de erro
      }
    } catch (error) {
      console.error('Erro ao buscar o valor da mensalidade:', error);
      this.amount.setValue(null); // Limpa o valor em caso de erro
    }
  }

  addMonthAndYearValidators() {
    this.month.setValidators([Validators.required]);
    this.year.setValidators([Validators.required]);
    this.month.updateValueAndValidity();
    this.year.updateValueAndValidity();
  }

  removeMonthAndYearValidators() {
    this.month.clearValidators();
    this.year.clearValidators();
    this.month.updateValueAndValidity();
    this.year.updateValueAndValidity();
  }

  onSubmit() {
    console.log(
      'Form submitted:',
      this.form.value,
      this.form.valid,
      this.form.errors,
    );
    if (this.form.valid) {
      this.createRequested.emit({
        amount: parseFloat(this.amount.value!.toString()), // Converte para número
        date: new Date(this.date.value!).toISOString(), // Formata para ISO
        observation: this.observation.value || undefined, // Converte vazio para null
        type: this.type.value! as PaymentType,
        month:
          this.type.value === 'Mensalidade' ? Number(this.month.value) : null, // Converte para número ou null
        year:
          this.type.value === 'Mensalidade' ? Number(this.year.value) : null, // Converte para número ou null
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  protected readonly environment = environment;
}
