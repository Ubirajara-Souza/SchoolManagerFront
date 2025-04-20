import { Component, OnInit } from '@angular/core';
import { SchoolService } from 'app/services/school.service';
import { NotificationService } from 'app/services/notification.service';
import { SchoolResponse } from 'app/models/school/school-response';
import { MatDialog } from '@angular/material/dialog';
import { SchoolFormDialogComponent } from '../modals/school-form-dialog/school-form-dialog.component';
import { SchoolDetailsDialogComponent } from '../modals/school-details-dialog/school-details-dialog.component';

@Component({
  selector: 'app-schools',
  standalone: false,
  templateUrl: './schools.component.html',
  styleUrl: './schools.component.scss'
})
export class SchoolsComponent implements OnInit {
  schools: SchoolResponse[] = [];
  filter = '';

  constructor(
    private readonly schoolService: SchoolService,
    private readonly notification: NotificationService,
    private readonly dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadSchools();
  }

  loadSchools(): void {
    this.schoolService.getAll(this.filter).subscribe({
      next: (response) => {
        this.schools = response.data;
      },
      error: (err) => {
        const message = (err?.error?.errors ?? ['Erro ao carregar escolas.']).join('\n');
        this.notification.showError(message);
      }
    });
  }

  openDialog(school?: SchoolResponse): void {
    const dialogRef = this.dialog.open(SchoolFormDialogComponent, {
      width: '600px',
      data: school ?? null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (school) {
          this.schoolService.update(school.code, result).subscribe({
            next: () => {
              this.notification.showSuccess('Escola atualizada com sucesso!');
              this.loadSchools();
            },
            error: (err) => {
              const message = (err?.error?.errors ?? ['Erro ao atualizar escola.']).join('\n');
              this.notification.showError(message);
            }
          });
        } else {
          this.schoolService.add(result).subscribe({
            next: () => {
              this.notification.showSuccess('Escola adicionada com sucesso!');
              this.loadSchools();
            },
            error: (err) => {
              const message = (err?.error?.errors ?? ['Erro ao adicionar escola.']).join('\n');
              this.notification.showError(message);
            }
          });
        }
      }
    });
  }

  delete(code: number): void {
    if (confirm('Tem certeza que deseja excluir esta escola?')) {
      this.schoolService.delete(code).subscribe({
        next: () => {
          this.notification.showSuccess('Escola excluída com sucesso!');
          this.loadSchools();
        },
        error: (err) => {
          const message = (err?.error?.errors ?? ['Erro ao excluir escola.']).join('\n');
          this.notification.showError(message);
        }
      });
    }
  }

  openDetails(code: number): void {
    this.schoolService.getById(code).subscribe({
      next: (school) => {
        this.dialog.open(SchoolDetailsDialogComponent, {
          width: '600px',
          data: school
        });
      },
      error: (err) => {
        const message = (err?.error?.errors ?? ['Erro ao buscar detalhes da escola.']).join('\n');
        this.notification.showError(message);
      }
    });
  }

  clearFilter(): void {
    this.filter = '';
    this.loadSchools();
  }
}