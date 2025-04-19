import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SchoolResponse } from 'app/models/school/school-response';
import { StudentDto } from 'app/models/students/student-dto';
import { StudentResponse } from 'app/models/students/student-response';
import { SchoolService } from 'app/services/school.service';

@Component({
  selector: 'app-student-form-dialog',
  standalone: false,
  templateUrl: './student-form-dialog.component.html',
  styleUrl: './student-form-dialog.component.scss'
})
export class StudentFormDialogComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  schools: SchoolResponse[] = [];
  errorMessages: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<StudentFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StudentResponse | null,
    private readonly fb: FormBuilder,
    private readonly schoolService: SchoolService
  ) { }

  ngOnInit(): void {
    this.isEdit = !!this.data;
    this.loadSchools();
    this.initializeForm();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      name: [this.data?.name ?? '', Validators.required],
      dateOfBirth: [this.data?.dateOfBirth ?? '', Validators.required],
      cpf: [this.data?.cpf ?? '', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      cellPhone: [this.data?.cellPhone ?? '', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      codeSchool: [this.data?.school?.code ?? '', Validators.required],
      address: this.fb.group({
        street: [this.data?.address?.street ?? '', Validators.required],
        number: [this.data?.address?.number ?? '', Validators.required],
        complement: [this.data?.address?.complement ?? ''],
        neighborhood: [this.data?.address?.neighborhood ?? '', Validators.required],
        city: [this.data?.address?.city ?? '', Validators.required],
        state: [this.data?.address?.state ?? '', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
        zipCode: [this.data?.address?.zipCode ?? '', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]]
      })
    });
  }

  private loadSchools(): void {
    this.schoolService.getAll().subscribe({
      next: (response) => {
        this.schools = response.data;
      },
      error: (err) => {
        this.errorMessages = err?.error?.errors ?? ['Erro ao carregar escolas'];
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value as StudentDto);
    }
  }
}