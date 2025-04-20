import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'app/services/auth.service';
import { NotificationService } from 'app/services/notification.service';
import { Router } from '@angular/router';
import { AddClaimDto } from 'app/models/auth/add-claim-dto';
import { ClaimItemDto } from 'app/models/auth/claim-item-dto';

@Component({
  selector: 'app-claims',
  standalone: false,
  templateUrl: './claims.component.html',
  styleUrl: './claims.component.scss'
})
export class ClaimsComponent implements OnInit {
  form!: FormGroup;
  errorMessages: string[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly notification: NotificationService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.carregarEmailSalvo();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      claimTypes: [[], Validators.required],
      claimValues: [[], Validators.required]
    });
  }

  private carregarEmailSalvo(): void {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      this.form.patchValue({ email: savedEmail });
    }
  }

  submit(): void {
    if (this.form.invalid) return;

    const { email, claimTypes, claimValues } = this.form.value;

    const claims: ClaimItemDto[] = [];

    for (const type of claimTypes) {
      for (const value of claimValues) {
        claims.push({ claimType: type, claimValue: value });
      }
    }

    const payload: AddClaimDto = { email, claims };

    this.authService.addClaim(payload).subscribe({
      next: () => {
        this.notification.showSuccess('Autorização adicionada com sucesso!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessages = err?.error?.errors ?? ['Erro ao adicionar autorização'];
      }
    });
  }
  cancelar(): void {
    this.form.reset();
    this.router.navigate(['/login']);
  }
}