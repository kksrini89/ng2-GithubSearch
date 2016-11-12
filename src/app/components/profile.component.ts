import { Component } from '@angular/core';
import { GithubService } from '../services/github.service';

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    styleUrls: ['profile.component.css']
})
export class ProfileComponent {
    users: any[] = [];
    repos: any[] = [];
    constructor(private githubService: GithubService) {
        this.githubService.getUsers()
            .subscribe(res => this.users = res);
        this.githubService.getRepos()
            .subscribe(res => this.repos = res);
    }
}
