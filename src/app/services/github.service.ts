import { Injectable, OnInit } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class GithubService implements OnInit {
    private username: string = '';
    private client_id: string = 'c9fada6a6bdcab6d7d07';
    private client_secret: string = '9555d67e5e30cf790eb594e88230b8729adb5c61';
    private _url: string = 'https://api.github.com/users/';
    constructor(private http: Http) {
        this.username = 'kksrini89';
        console.log("Github service is ready");
    }
    ngOnInit() {

    }
    getUsers() {
        return this.http.get(this._url + this.username + '?client_id=' + this.client_id + '&client_secret=' + this.client_secret)
            .map((response: Response) => response.json());
    }
    getRepos() {
        return this.http.get(this._url + this.username + '/repos?client_id=' + this.client_id + '&client_secret=' + this.client_secret)
            .map((response: Response) => response.json());
    }
}