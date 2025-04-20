import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  errorMessages: string[] = [];
  hidePassword = true;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.authService.login(this.form.value).subscribe({
      next: () => {
        this.router.navigate(['/students']);
      },
      error: (err) => {
        this.errorMessages = err?.error?.errors ?? ['Erro ao fazer login'];
      }
    });
  }
}