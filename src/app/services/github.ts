import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface GithubError {
  message: string;
  status: number;
  isRateLimitError: boolean;
  documentation_url?: string;
}

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private readonly http = inject(HttpClient);

  private username: string = '';
  private readonly client_id: string = environment.github.clientId;
  private readonly client_secret: string = environment.github.clientSecret;
  private _url: string = 'https://api.github.com/users/';

  constructor() {
    this.username = 'kksrini89';
    console.log('Github service is ready');
  }

  updateUser(username: string) {
    this.username = username;
  }

  getUsers() {
    const url = this.client_id 
      ? `${this._url}${this.username}?client_id=${this.client_id}&client_secret=${this.client_secret}`
      : `${this._url}${this.username}`;
    
    return this.http.get(url).pipe(
      catchError(this.handleError)
    );
  }

  getRepos() {
    const url = this.client_id
      ? `${this._url}${this.username}/repos?client_id=${this.client_id}&client_secret=${this.client_secret}`
      : `${this._url}${this.username}/repos`;
    
    return this.http.get(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    const githubError: GithubError = {
      message: 'An error occurred',
      status: error.status,
      isRateLimitError: false,
    };

    if (error.error instanceof ErrorEvent) {
      githubError.message = `Network error: ${error.error.message}`;
    } else {
      const errorBody = error.error;
      
      if (error.status === 403 && errorBody?.message?.toLowerCase().includes('rate limit')) {
        githubError.isRateLimitError = true;
        githubError.message = 'GitHub API rate limit exceeded. Please try again later or add authentication credentials.';
        githubError.documentation_url = errorBody.documentation_url;
      } else if (error.status === 404) {
        githubError.message = 'User not found. Please check the username and try again.';
      } else if (error.status === 401) {
        githubError.message = 'Invalid credentials. Please check your GitHub API credentials.';
      } else {
        githubError.message = errorBody?.message || `Error: ${error.status} - ${error.statusText}`;
      }
    }

    return throwError(() => githubError);
  }
}
