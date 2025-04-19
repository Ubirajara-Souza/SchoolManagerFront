import { Component, OnInit } from '@angular/core';
import { SchoolService } from 'app/services/school.service';
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
  errorMessages: string[] = [];

  constructor(
    private readonly schoolService: SchoolService,
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
        this.errorMessages = err?.error?.errors ?? ['Erro ao carregar escolas'];
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
              alert('Escola atualizada com sucesso!');
              this.loadSchools();
            },
            error: (err) => {
              this.errorMessages = err?.error?.errors ?? ['Erro ao atualizar escola'];
            }
          });
        } else {
          this.schoolService.add(result).subscribe({
            next: () => {
              alert('Escola adicionada com sucesso!');
              this.loadSchools();
            },
            error: (err) => {
              this.errorMessages = err?.error?.errors ?? ['Erro ao adicionar escola'];
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
          alert('Escola excluída com sucesso!');
          this.loadSchools();
        },
        error: (err) => {
          this.errorMessages = err?.error?.errors ?? ['Erro ao excluir escola'];
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
        this.errorMessages = err?.error?.errors ?? ['Erro ao buscar detalhes da escola.'];
      }
    });
  }

  clearFilter(): void {
    this.filter = '';
    this.loadSchools();
  }
}