import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'app/services/auth.service';
import { NotificationService } from 'app/services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AddClaimDto } from 'app/models/auth/add-claim-dto';
import { ClaimItemDto } from 'app/models/auth/claim-item-dto';
import { RefreshTokenUserDto } from 'app/models/auth/refresh-token-user-dto';

@Component({
  selector: 'app-claims',
  standalone: false,
  templateUrl: './claims.component.html',
  styleUrl: './claims.component.scss'
})
export class ClaimsComponent implements OnInit {
  @Input() exibirAposLogin = true;
  form!: FormGroup;
  errorMessages: string[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly notification: NotificationService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.exibirAposLogin = this.route.snapshot.data['exibirAposLogin'] ?? true;
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
        if (this.exibirAposLogin) {
          this.router.navigate(['/login']);
        } else {
          const refreshDto: RefreshTokenUserDto = { email };
          this.authService.refreshToken(refreshDto).subscribe({
            next: () => {
              this.router.navigate(['/']);
            },
            error: () => {
              this.notification.showError('Erro ao atualizar token após adicionar autorização.');
            }
          });
        }
      },
      error: (err) => {
        this.errorMessages = err?.error?.errors ?? ['Erro ao adicionar autorização'];
      }
    });
  }
  cancelar(): void {
    this.form.reset();
    if (this.exibirAposLogin) {
      this.router.navigate(['/login']);
    }
    else {
      this.router.navigate(['/']);
    }
  }
}