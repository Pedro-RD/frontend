import {HttpClient} from '@angular/common/http';
import {Injectable, signal} from '@angular/core';
import {Router} from '@angular/router';

import {environment} from '../../../environments/environment';
import {User} from '../../interfaces/user';
import {ToastService} from '../toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly url: string = environment.apiUrl + 'users';
  private usersSignal = signal<User[] | null>(null);
  public user = this.usersSignal();

  private totalPagesSignal = signal(0);
  public totalPages = this.totalPagesSignal();

  private searchSignal = signal("");
  public search = this.searchSignal();

  private orderBySignal = signal("");
  private orderAscSignal = signal(true);

  private orderSignal = signal("id");
  private orderAscSignal = signal(true);

  private pageSignal = signal(1);
  private limitSignal = signal(10);

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private toastService: ToastService,
  ) {
  }

  
}
