import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GithubService, GithubError } from '../../services/github';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'gh-user-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  standalone: true,
})
export class Profile implements OnInit, OnDestroy {
  username = signal<string>('');
  user = signal<any>(null);
  repos = signal<any[]>([]);
  error = signal<GithubError | null>(null);
  loading = signal<boolean>(false);

  private readonly githubService = inject(GithubService);
  private searchSubject = new Subject<string>();
  private subscription?: Subscription;

  ngOnInit() {
    this.subscription = this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        filter(username => username.trim().length > 0)
      )
      .subscribe(username => {
        this.searchUser(username);
      });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  onUsernameChange(username: string) {
    this.username.set(username);
    this.searchSubject.next(username);
  }

  private searchUser(username: string) {
    this.loading.set(true);
    this.error.set(null);
    this.user.set(null);
    this.repos.set([]);

    this.githubService.updateUser(username);
    
    this.githubService.getUsers().subscribe({
      next: (user: any) => {
        this.user.set(user);
        this.loadRepos();
      },
      error: (err: GithubError) => {
        this.error.set(err);
        this.loading.set(false);
      }
    });
  }

  private loadRepos() {
    this.githubService.getRepos().subscribe({
      next: (repos: any) => {
        this.repos.set(repos);
        this.loading.set(false);
      },
      error: (err: GithubError) => {
        this.error.set(err);
        this.loading.set(false);
      }
    });
  }
}
