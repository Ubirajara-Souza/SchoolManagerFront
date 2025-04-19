import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SchoolDto } from 'app/models/school/school-dto';
import { SchoolResponse } from 'app/models/school/school-response';

@Component({
  selector: 'app-school-form-dialog',
  standalone: false,
  templateUrl: './school-form-dialog.component.html',
  styleUrl: './school-form-dialog.component.scss'
})
export class SchoolFormDialogComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;

  constructor(
    public dialogRef: MatDialogRef<SchoolFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SchoolResponse | null,
    private readonly fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEdit = !!this.data;
    this.initializeForm();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      description: [this.data?.description ?? '', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value as SchoolDto);
    }
  }
}
