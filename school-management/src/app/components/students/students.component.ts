import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StudentFormDialogComponent } from '../modals/student-form-dialog/student-form-dialog.component';
import { StudentDetailsDialogComponent } from '../modals/student-details-dialog/student-details-dialog.component';
import { StudentResponse } from 'app/models/students/student-response';
import { StudentService } from 'app/services/student.service';

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
        this.errorMessages = err?.error?.errors ?? ['Erro ao carregar alunos'];
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
              alert('Aluno atualizado com sucesso!');
              this.loadStudents();
            },
            error: (err) => {
              this.errorMessages = err?.error?.errors ?? ['Erro ao atualizar aluno'];
            }
          });
        } else {
          this.studentService.add(result).subscribe({
            next: () => {
              alert('Aluno adicionado com sucesso!');
              this.loadStudents();
            },
            error: (err) => {
              this.errorMessages = err?.error?.errors ?? ['Erro ao adicionar aluno'];
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
      error: () => {
        alert('Erro ao buscar detalhes do aluno.');
      }
    });
  }

  delete(code: number): void {
    if (confirm('Tem certeza que deseja excluir este aluno?')) {
      this.studentService.delete(code).subscribe({
        next: () => {
          alert('Aluno excluído com sucesso!');
          this.loadStudents();
        },
        error: (err) => {
          this.errorMessages = err?.error?.errors ?? ['Erro ao excluir aluno'];
        }
      });
    }
  }
}