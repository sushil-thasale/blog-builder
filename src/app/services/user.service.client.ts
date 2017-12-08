import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { User } from '../components/user/user.model.client';
import { environment } from '../../environments/environment';
import { Http, Response, RequestOptions } from '@angular/http';
import { SharedService } from './shared.service';
import { Router } from '@angular/router';

// injecting service into module
@Injectable()

export class UserService {

  constructor(private http: Http,
              private sharedService: SharedService,
              private router: Router) { }

  api = {
    'createUser'   : this.createUser,
    'findUserByCredentials' : this.findUserByCredentials,
    // 'findUserByUsername' : this.findUserByUsername,
    'findUserById' : this.findUserById,
    'updateUser' : this.updateUser,
    'deleteUser' : this.deleteUser
  };

  baseUrl: string = environment.baseUrl;
  options = new RequestOptions();

  login(username: string, password: string) {
    this.options.withCredentials = true;

    const body = {
      username : username,
      password : password
    };
    const url: string = this.baseUrl + '/api/login';
    return this.http.post(url, body, this.options)
      .map(
        (res: Response) => {
          const data = res.json();
          return data;
        }
      );
  }

  logout() {
    this.options.withCredentials = true;
    const url: string = this.baseUrl + '/api/logout';
    return this.http.post(url, '', this.options)
      .map(
        (res: Response) => {
          const data = res;
        }
      );
  }

  register(username: String, password: String) {

    this.options.withCredentials = true;
    const user = {
      username : username,
      password : password
    };
    const url: string = this.baseUrl + '/api/register';
    return this.http.post(url, user, this.options)
      .map(
        (res: Response) => {
          const data = res.json();
          return data;
        }
      );
  }

  loggedIn() {
    this.options.withCredentials = true;
    const url: string = this.baseUrl + '/api/loggedIn';
    return this.http.post(url, '', this.options)
      .map(
        (res: Response) => {
          const user = res.json();
          if (user !== 0) {
            this.sharedService.user = user;
            return true;
          } else if (user === 0) {
            this.router.navigate(['/login']);
            return false;
          }
        }
      );
  }

  createUser(username: string, password: string) {
    const url: string = this.baseUrl + '/api/user';
    // const user: User = new User('', username, password, '', '', '');
    const user = {'username': username, 'password': password};
    return this.http.post(url, user)
      .map((res: Response) => {
        console.log('createUser service client ' + res.json());
        return res.json();
      });
  }

  findUserByUsername(username: string) {
    const url: string = this.baseUrl + '/api/user?username=' + username;
    return this.http.get(url)
      .map((res: Response) => {
        console.log('findUserByUsername service client ' + res.json());
        return res.json();
      });
  }

  findUserByCredentials(username: string, password: string) {
    const url: string = this.baseUrl + '/api/user?username=' + username + '&password=' + password;
    return this.http.get(url)
      .map((res: Response) => {
        return res.json();
      });
  }

  findUserById(userId: string) {
    const url: string = this.baseUrl + '/api/user/' + userId;
    return this.http.get(url)
      .map((res: Response) => {
        return res.json();
      });
  }

  updateUser(userId: string, user: User) {
    const url: string = this.baseUrl + '/api/user/' + userId;
    return this.http.put(url, user)
      .map((res: Response) => {
          return res.json();
        });
  }

  deleteUser(userId: string) {
    const url: string = this.baseUrl + '/api/user/' + userId;
    return this.http.delete(url)
      .map((res: Response) => {
        return res.json();
      });
  }
}
