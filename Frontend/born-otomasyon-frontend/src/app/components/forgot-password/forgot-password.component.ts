import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  template: `
    <div class="forgot-container">
      <mat-card>
        <mat-card-title>Şifremi Unuttum</mat-card-title>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>E-posta</mat-label>
              <input matInput type="email" formControlName="email" required>
              <mat-error *ngIf="form.get('email')?.hasError('required')">E-posta gereklidir</mat-error>
              <mat-error *ngIf="form.get('email')?.hasError('email')">Geçerli bir e-posta giriniz</mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || isLoading">
              {{ isLoading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder' }}
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .forgot-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .full-width {
      width: 100%;
    }
  `]
})
export class ForgotPasswordComponent {
  form: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private snackBar: MatSnackBar) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      this.authService.forgotPassword(this.form.value.email).subscribe({
        next: () => {
          this.snackBar.open('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.', 'Kapat', { duration: 5000 });
          this.isLoading = false;
        },
        error: () => {
          this.snackBar.open('İşlem başarısız. Lütfen tekrar deneyin.', 'Kapat', { duration: 5000 });
          this.isLoading = false;
        }
      });
    }
  }
}
