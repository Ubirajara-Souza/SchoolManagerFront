import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StudentFormDialogComponent } from '../modals/student-form-dialog/student-form-dialog.component';
import { StudentDetailsDialogComponent } from '../modals/student-details-dialog/student-details-dialog.component';
import { StudentResponse } from 'app/models/students/student-response';
import { StudentService } from 'app/services/student.service';
import { NotificationService } from 'app/services/notification.service';

@Component({
  selector: 'app-students',
  standalone: false,
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss'
})
export class StudentsComponent implements OnInit {
  students: StudentResponse[] = [];
  nameFilter = '';
  cpfFilter = '';
  errorMessages: string[] = [];

  constructor(
    private readonly studentService: StudentService,
    private readonly notification: NotificationService,
    private readonly dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.studentService.getAll(this.nameFilter, this.cpfFilter).subscribe({
      next: (response) => {
        this.students = response.data;
      },
      error: (err) => {
        const message = (err?.error?.errors ?? ['Erro ao carregar alunos.']).join('\n');
        this.notification.showError(message);
      }
    });
  }

  clearFilters(): void {
    this.nameFilter = '';
    this.cpfFilter = '';
    this.loadStudents();
  }

  openDialog(student?: StudentResponse): void {
    const dialogRef = this.dialog.open(StudentFormDialogComponent, {
      width: '700px',
      data: student ?? null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (student) {
          this.studentService.update(student.code, result).subscribe({
            next: () => {
              this.notification.showSuccess('Aluno atualizado com sucesso!');
              this.loadStudents();
            },
            error: (err) => {
              const message = (err?.error?.errors ?? ['Erro ao atualizar aluno.']).join('\n');
              this.notification.showError(message);
            }
          });
        } else {
          this.studentService.add(result).subscribe({
            next: () => {
              this.notification.showSuccess('Aluno adicionado com sucesso!');
              this.loadStudents();
            },
            error: (err) => {
              const message = (err?.error?.errors ?? ['Erro ao adicionar aluno.']).join('\n');
              this.notification.showError(message);
            }
          });
        }
      }
    });
  }

  openDetails(code: number): void {
    this.studentService.getById(code).subscribe({
      next: (student) => {
        this.dialog.open(StudentDetailsDialogComponent, {
          width: '700px',
          data: student
        });
      },
      error: (err) => {
        const message = (err?.error?.errors ?? ['Erro ao buscar detalhes do aluno.']).join('\n');
        this.notification.showError(message);
      }
    });
  }

  delete(code: number): void {
    if (confirm('Tem certeza que deseja excluir este aluno?')) {
      this.studentService.delete(code).subscribe({
        next: () => {
          this.notification.showSuccess('Aluno excluído com sucesso!');
          this.loadStudents();
        },
        error: (err) => {
          const message = (err?.error?.errors ?? ['Erro ao excluir aluno.']).join('\n');
          this.notification.showError(message);
        }
      });
    }
  }
}