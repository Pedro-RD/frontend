import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ResidentsService } from '../../services/residents/residents.service';
import { Resident } from '../../interfaces/resident';
import { Observable, Subscription } from 'rxjs';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ModalConfirmComponent } from '../../components/forms/modal-confirm/modal-confirm.component';
import { LoadingComponent } from '../../components/forms/loading/loading.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../services/toast/toast.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-residents-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ModalConfirmComponent, LoadingComponent, NgOptimizedImage],
  templateUrl: './residents-detail.component.html',
  styleUrls: ['./residents-detail.component.css']
})
export class ResidentsDetailComponent implements OnInit, OnDestroy {
  resident?: Resident
  error: string | null = null;
  private subs: Subscription[] = [];
  @ViewChild(ModalConfirmComponent) deleteModal!: ModalConfirmComponent;
  profilePicture?: string | null;
  private photoResidentUrl = environment.photoResident;
  private apiUrl = environment.apiUrl;


  constructor(
    private residentsService: ResidentsService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private toastService: ToastService,
    private auth: AuthService,
  ) {}

  ngOnInit() {

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.subs.push(
        this.residentsService.fetchItem(id).subscribe({
          next: (resident) => {
            this.resident = resident;

            const photo = this.resident?.profilePicture;

            if (photo) {
              this.profilePicture = `${this.photoResidentUrl}${this.resident.profilePicture}`;
            }
          },
          error: (err) => {
            console.error(err);
            this.error = 'Residente não encontrado';
          },
        })
      );
    }
  }

  get isRelative(): Observable<boolean> {
    return this.auth.isRelative();
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  onDelete() {
    if (!this.resident?.id) return;

    this.subs.push(
      this.residentsService.delete(this.resident.id).subscribe({
        next: () => this.router.navigate(['/residents']),
        error: (err) => {
          console.error(err);
          this.error = 'Falha ao eliminar residente';
        },
      })
    );
  }

  onProfilePictureSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file: File = input.files[0];
      const formData = new FormData();
      formData.append("file", file);

      this.http.post(`${this.apiUrl}residents/${this.resident?.id!}/upload`, formData).subscribe({
        next: () => {
          // Atualiza a imagem diretamente sem reload
          this.profilePicture = URL.createObjectURL(file);
        },
        error: (err) => {
          console.error(err);
          this.toastService.error('Falha ao enviar imagem');
          },
      });
    }
  }


  showDeleteModal() {
    this.deleteModal.show();
  }

  removeProfilePicture() {
    this.http.delete(`${this.apiUrl}residents/${this.resident!.id}/upload`).subscribe({
      next: () => {
        // Reseta a imagem para o estado padrão
        this.profilePicture = null;
      },
      error: (err) => {
        console.error(err);
        this.toastService.error('Falha ao remover imagem');
      },
    });
  }
}
