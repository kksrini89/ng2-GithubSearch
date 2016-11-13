import { Component } from '@angular/core';
import { GithubService } from '../services/github.service';

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    styleUrls: ['profile.component.css']
})
export class ProfileComponent {
    user: any;
    repos: any[] = [];
    username: string;
    constructor(private githubService: GithubService) {
        this.user = false;        
    }

    searchUser() {
        this.githubService.updateUser(this.username);
        this.githubService.getUsers()
            .subscribe(res => this.user = res);
        this.githubService.getRepos()
            .subscribe(res => this.repos = res);
    }
}
