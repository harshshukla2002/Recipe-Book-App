import { Component, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { AlertComponent } from '../Shared/alert/alert.component';
import { PlaceholderDirective } from '../Shared/PlaceHolder/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  loginMode: boolean = false;
  authForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, Validators.required),
  });
  isLoading: boolean = false;
  isError: string = null;
  @ViewChild(PlaceholderDirective, { static: false })
  alertHost: PlaceholderDirective;

  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  onSwitch() {
    this.loginMode = !this.loginMode;
  }

  onSubmit() {
    this.isLoading = true;
    if (this.loginMode) {
      this.authService
        .login(this.authForm.value.email, this.authForm.value.password)
        .subscribe(
          (response) => {
            this.authForm.reset();
            this.isLoading = false;
            this.isError = null;
            this.router.navigate(['./recipe']);
          },
          (errorMessage) => {
            this.isLoading = false;
            this.isError = errorMessage;
            this.showAlert(errorMessage);
          }
        );
    } else {
      this.authService
        .onSignup(this.authForm.value.email, this.authForm.value.password)
        .subscribe(
          (response) => {
            this.authForm.reset();
            this.isLoading = false;
            this.isError = null;
          },
          (errorMessage) => {
            this.isLoading = false;
            this.isError = errorMessage;
            this.showAlert(errorMessage);
          }
        );
    }
  }

  onClickClose() {
    this.isError = null;
  }

  private showAlert(message: string) {
    const alertComponentFactory =
      this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(
      alertComponentFactory
    );

    componentRef.instance.message = message;
    componentRef.instance.closeModal.subscribe(() => {
      hostViewContainerRef.clear();
    });
  }
}
