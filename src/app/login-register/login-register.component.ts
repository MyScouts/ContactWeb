import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent implements OnInit {
  sign_in_btn = document.querySelector("#sign-in-btn")
  sign_up_btn = document.querySelector("#sign-up-btn")
  container: any;

  formSignIn = new FormGroup({
    userName: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  constructor() { }

  ngOnInit(): void {
    this.container = document.querySelector(".container")
  }

  signInClick() {
    this.container.classList.remove("sign-up-mode");

  }
  signUpClick() {
    this.container.classList.add("sign-up-mode")
  }

  onLogin() {
    alert(JSON.stringify(this.formSignIn.value))
    console.log(this.formSignIn.value.userName);

  }
}
