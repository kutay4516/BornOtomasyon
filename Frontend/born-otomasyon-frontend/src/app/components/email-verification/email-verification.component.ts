import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="verification-container">
      <mat-card class="verification-card">
        <mat-card-header>
          <mat-card-title>E-posta Doğrulama</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p class="info-text">
            E-posta adresinize gönderilen 6 haneli doğrulama kodunu giriniz.
          </p>
          
          <form [formGroup]="verificationForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Doğrulama Kodu</mat-label>
              <input matInput formControlName="verificationCode" maxlength="6" required>
              <mat-hint>E-posta adresinize gönderilen 6 haneli kod</mat-hint>
              <mat-error *ngIf="verificationForm.get('verificationCode')?.hasError('required')">
                Doğrulama kodu gereklidir
              </mat-error>
              <mat-error *ngIf="verificationForm.get('verificationCode')?.hasError('minlength')">
                Doğrulama kodu 6 haneli olmalıdır
              </mat-error>
              <mat-error *ngIf="verificationForm.get('verificationCode')?.hasError('pattern')">
                Doğrulama kodu sadece rakamlardan oluşmalıdır
              </mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" 
                    [disabled]="!verificationForm.valid || isLoading" class="full-width">
              <span *ngIf="!isLoading">Doğrula</span>
              <mat-spinner *ngIf="isLoading" diameter="24" class="spinner"></mat-spinner>
            </button>
          </form>
          
          <div class="resend-section">
            <p>Kod almadınız mı?</p>
            <button mat-button color="accent" (click)="resendCode()" [disabled]="isResending">
              <span *ngIf="!isResending">Yeni Kod Gönder</span>
              <mat-spinner *ngIf="isResending" diameter="20" class="spinner"></mat-spinner>
            </button>
          </div>
        </mat-card-content>
        <mat-card-actions align="start">
          <a routerLink="/login" mat-button>Giriş Sayfasına Dön</a>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .verification-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    .verification-card {
      width: 100%;
      max-width: 400px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    }
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    mat-card-header {
      text-align: center;
      margin-bottom: 20px;
    }
    mat-card-title {
      font-size: 24px;
      color: #333;
    }
    .info-text {
      margin-bottom: 20px;
      text-align: center;
      color: #555;
    }
    .resend-section {
      margin-top: 20px;
      text-align: center;
      color: #555;
    }
    .spinner {
      display: inline-block;
      margin: 0 auto;
    }
  `]
})
export class EmailVerificationComponent implements OnInit {
  verificationForm: FormGroup;
  isLoading = false;
  isResending = false;
  email: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.verificationForm = this.fb.group({
      verificationCode: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
        Validators.pattern('^[0-9]*$')
      ]]
    });
  }

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email');

    if (!this.email) {
      this.snackBar.open('E-posta adresi bulunamadı. Lütfen kayıt işlemini tekrarlayın.', 'Kapat', {
        duration: 5000
      });
      this.router.navigate(['/register']);
    }
  }

  onSubmit(): void {
    if (this.verificationForm.valid && this.email) {
      this.isLoading = true;
      const code = this.verificationForm.get('verificationCode')?.value;

      this.authService.verifyEmail(this.email, code).subscribe({
        next: () => {
          this.snackBar.open('E-posta adresiniz başarıyla doğrulandı!', 'Kapat', {
            duration: 5000
          });
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.snackBar.open('Doğrulama başarısız. Lütfen kodu kontrol edin ve tekrar deneyin.', 'Kapat', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.isLoading = false;
        }
      });
    }
  }

  resendCode(): void {
    if (this.email) {
      this.isResending = true;

      this.authService.resendVerificationCode(this.email).subscribe({
        next: () => {
          this.snackBar.open('Yeni doğrulama kodu e-posta adresinize gönderildi.', 'Kapat', {
            duration: 5000
          });
          this.isResending = false;
        },
        error: (error) => {
          this.snackBar.open('Kod gönderimi başarısız. Lütfen tekrar deneyin.', 'Kapat', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.isResending = false;
        }
      });
    }
  }
}
