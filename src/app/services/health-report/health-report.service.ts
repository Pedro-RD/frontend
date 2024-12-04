import { Injectable } from '@angular/core';
import { ListService } from '../list/list.service';
import { HealthReport, HealthReportDTO } from '../../interfaces/health-report';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../toast/toast.service';
import { catchError, map, Observable, of, tap } from 'rxjs';
import PagedResponse from '../../interfaces/paged-response.interface';

@Injectable({
  providedIn: 'root',
})
export class HealthReportService extends ListService<HealthReport> {
  readonly url: string = environment.apiUrl + 'residents/';

  constructor(
    private httpClient: HttpClient,
    private toastService: ToastService
  ) {
    super();
  }

  fetchList(residentId: number): Observable<HealthReport[]> {
    return this.httpClient.get<PagedResponse<HealthReport>>(this.url + residentId + '/health-reports' + this.queryString
    ).pipe(
      tap((rxp) => {
        console.log(rxp);
        this.setTotalPages(rxp.totalPages);
      }),
      map((rxp) => rxp.data),
      tap(console.log),
      catchError((err) => {
        console.log(err);
        return of([] as HealthReport[]);
      })
    );
  }

  fetchItem(id: number, residentId: number): Observable<HealthReport> {
    return this.httpClient.get<HealthReport>(`${this.url}${residentId}/health-reports/${id}`).pipe(
      tap((report) => {
        if (report) {
          console.log('Relatório de saúde encontrado:', report);
        }
      }),
      catchError((err) => {
        console.error('Erro ao buscar relatório de saúde:', err);
        this.toastService.error('Erro ao buscar relatório de saúde');
        return of({} as HealthReport);
      })
    );
  }

  create(item: HealthReportDTO, residentId: number): Observable<HealthReport> {
    if (!environment.production) console.log('A criar relatório de saúde:', item);
    return this.httpClient.post<HealthReport>(this.url + residentId + '/health-reports', item).pipe(
      map((report) => {
        if (!environment.production) console.log('Relatório de saúde criado:', report);
        this.toastService.success('Relatório de saúde criado com sucesso');
        return report;
      }),
      catchError((error) => {
        //if (!environment.production) console.error('Erro ao criar relatório de saúde:', error);
        throw error;
      })
    );
  }

  update(id: number, item: HealthReportDTO, residentId: number): Observable<HealthReport> {
    // Certifique-se de que a URL está configurada corretamente
    const url = `${this.url}${residentId}/health-reports/${id}`;
    
    return this.httpClient.patch<HealthReport>(url, item).pipe(
      tap((updatedReport) => {
        if (!environment.production) {
          console.log('Relatório de saúde atualizado:', updatedReport);
        }
        // Mensagem de sucesso após atualização
        this.toastService.success('Relatório de saúde atualizado com sucesso');
      }),
      catchError((error) => {
        // Caso ocorra erro, exibe o erro no console (caso não esteja em produção)
        if (!environment.production) {
          console.error('Erro ao atualizar relatório de saúde:', error);
        }
        // Exibe a mensagem de erro ao usuário
        this.toastService.error('Erro ao atualizar relatório de saúde');
        // Retorna um objeto vazio do tipo HealthReport em caso de erro
        return of({} as HealthReport);
      })
    );
  }
  

  isDeleting = false;

  delete(id: number, residentId: number): Observable<void> {
    if (this.isDeleting) return of(); // Evita múltiplas requisições simultâneas
    this.isDeleting = true;

    return this.httpClient.delete<void>(`${this.url}${residentId}/health-reports/${id}`).pipe(
      map(() => {
        this.isDeleting = false;
        this.toastService.success('Relatório de saúde eliminado com sucesso');
      }),
      catchError((error) => {
        if (!environment.production) {
          console.error('Erro ao eliminar relatório de saúde:', error);
        }
        this.isDeleting = false;
        throw error; // Propaga o erro para ser tratado no componente
      })
    );
  }
}
