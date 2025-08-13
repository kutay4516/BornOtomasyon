import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormService } from '../../services/form.service';
import { FormDataResponse } from '../../models/form.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatIconModule,
    MatTableModule
  ],
  template: `
    <mat-toolbar color="primary">
      <span>Born Otomasyon - Ana Sayfa</span>
      <span class="spacer"></span>
      <span>{{currentUser?.email}}</span>
      <button mat-icon-button (click)="logout()">
        <mat-icon>logout</mat-icon>
      </button>
    </mat-toolbar>

    <div class="dashboard-container">
      <div class="form-section">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Veri Girişi Formu</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="dataForm" (ngSubmit)="onSubmit()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Text1 (Metin)</mat-label>
                <input matInput formControlName="text1" maxlength="100" required>
                <mat-hint>Maksimum 100 karakter</mat-hint>
                <mat-error *ngIf="dataForm.get('text1')?.hasError('required')">
                  Metin alanı gereklidir
                </mat-error>
                <mat-error *ngIf="dataForm.get('text1')?.hasError('maxlength')">
                  Metin maksimum 100 karakter olabilir
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Num1 (Sayı)</mat-label>
                <input matInput type="number" formControlName="num1" required>
                <mat-hint>50 ile 100 arasında bir değer giriniz</mat-hint>
                <mat-error *ngIf="dataForm.get('num1')?.hasError('required')">
                  Sayı alanı gereklidir
                </mat-error>
                <mat-error *ngIf="dataForm.get('num1')?.hasError('min')">
                  Sayı minimum 50 olmalıdır
                </mat-error>
                <mat-error *ngIf="dataForm.get('num1')?.hasError('max')">
                  Sayı maksimum 100 olmalıdır
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Date1 (Tarih)</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="date1" required>
                <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
                <mat-hint>Sadece gelecek tarihler seçilebilir</mat-hint>
                <mat-error *ngIf="dataForm.get('date1')?.hasError('required')">
                  Tarih alanı gereklidir
                </mat-error>
                <mat-error *ngIf="dataForm.get('date1')?.hasError('futureDate')">
                  Sadece gelecek tarihler seçilebilir
                </mat-error>
              </mat-form-field>

              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="!dataForm.valid || isLoading" class="full-width">
                {{isLoading ? 'Gönderiliyor...' : 'Formu Onayla'}}
              </button>
            </form>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="history-section">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Önceki Kayıtlarınız</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="formHistory" class="full-width">
              <ng-container matColumnDef="text1">
                <th mat-header-cell *matHeaderCellDef>Metin</th>
                <td mat-cell *matCellDef="let element">{{element.text1}}</td>
              </ng-container>

              <ng-container matColumnDef="num1">
                <th mat-header-cell *matHeaderCellDef>Sayı</th>
                <td mat-cell *matCellDef="let element">{{element.num1}}</td>
              </ng-container>

              <ng-container matColumnDef="date1">
                <th mat-header-cell *matHeaderCellDef>Tarih</th>
                <td mat-cell *matCellDef="let element">{{element.date1 | date:'dd/MM/yyyy'}}</td>
              </ng-container>

              <ng-container matColumnDef="createdAt">
                <th mat-header-cell *matHeaderCellDef>Oluşturulma</th>
                <td mat-cell *matCellDef="let element">{{element.createdAt | date:'dd/MM/yyyy HH:mm'}}</td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
    .dashboard-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .form-section {
      margin-bottom: 30px;
    }
    .history-section {
      margin-top: 30px;
    }
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    mat-card {
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }
    mat-card-title {
      color: #333;
      font-size: 20px;
    }
    table {
      width: 100%;
    }
    .mat-column-text1 {
      flex: 2;
    }
  `]
})
export class DashboardComponent implements OnInit {
  dataForm: FormGroup;
  isLoading = false;
  currentUser: any;
  formHistory: FormDataResponse[] = [];
  displayedColumns: string[] = ['text1', 'num1', 'date1', 'createdAt'];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private formService: FormService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.dataForm = this.fb.group({
      text1: ['', [Validators.required, Validators.maxLength(100)]],
      num1: ['', [Validators.required, Validators.min(50), Validators.max(100)]],
      date1: ['', [Validators.required, this.futureDateValidator]]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.loadFormHistory();
  }

  futureDateValidator(control: any) {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today

    if (selectedDate <= today) {
      return { futureDate: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.dataForm.valid) {
      this.isLoading = true;
      this.formService.submitForm(this.dataForm.value).subscribe({
        next: (response) => {
          this.snackBar.open('Form başarıyla gönderildi!', 'Kapat', { duration: 3000 });
          this.dataForm.reset();
          this.loadFormHistory(); // Refresh the history
          this.isLoading = false;
        },
        error: (error) => {
          const errorMessage = error.error || 'Form gönderiminde hata oluştu.';
          this.snackBar.open(errorMessage, 'Kapat', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.isLoading = false;
        }
      });
    }
  }

  loadFormHistory(): void {
    this.formService.getUserForms().subscribe({
      next: (data) => {
        this.formHistory = data;
      },
      error: (error) => {
        console.error('Error loading form history:', error);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
