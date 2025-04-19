import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StudentResponse } from 'app/models/students/student-response';

@Component({
  selector: 'app-student-details-dialog',
  standalone: false,
  templateUrl: './student-details-dialog.component.html',
  styleUrl: './student-details-dialog.component.scss'
})
export class StudentDetailsDialogComponent implements OnInit {
  situacao = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: StudentResponse) { }

  ngOnInit(): void {
    this.situacao = this.data.dateDeactivation ? 'Desativado' : 'Ativo';
  }
}