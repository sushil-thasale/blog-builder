import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service.client';
import { User } from '../user.model.client';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

  @ViewChild('f') loginForm: NgForm;
  user: User;
  userID: string;
  errorFlag: boolean;
  errorMsg = 'All values are required to update the form!';

  constructor(private userService: UserService, private router: Router, private  route: ActivatedRoute) { }

  ngOnInit() {
    this.user = new User('', '', '', '', '', '');

    this.route.params.subscribe(params => {
      this.userID = params['userID'];
    });

    this.userService.findUserById(this.userID)
      .subscribe(
        (user: User) => {
          this.user = user;
          this.errorFlag = false;
        }, (error) => {
          this.errorFlag = true;
          this.errorMsg = 'User not found!!';
        });
  }

  updateProfile() {
    if (this.user) {
      this.user.username = this.loginForm.value.username;
      this.user.firstName = this.loginForm.value.firstName;
      this.user.lastName = this.loginForm.value.lastName;
      this.user.email = this.loginForm.value.email;
      if (!this.errorFlag) {
        this.userService.updateUser(this.userID, this.user)
          .subscribe(
            (user: User) => {
              this.ngOnInit();
              // this.navigateToProfile();
            }, (error) => {
              this.errorFlag = true;
              this.errorMsg = 'Some problems with update!!';
            });
      }
    }
  }

  logout() {
    this.userService.logout()
      .subscribe(
        (data: any) => this.router.navigate(['/login'])
      );
  }

  navigateToProfile() {
    this.router.navigate(['/user', this.userID]);
  }

  navigateToWebsites() {
    this.router.navigate(['/user', this.userID, 'website']);
  }
}
