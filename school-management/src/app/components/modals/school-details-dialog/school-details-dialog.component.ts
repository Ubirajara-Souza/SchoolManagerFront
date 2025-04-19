import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SchoolResponse } from 'app/models/school/school-response';

@Component({
  selector: 'app-school-details-dialog',
  standalone: false,
  templateUrl: './school-details-dialog.component.html',
  styleUrl: './school-details-dialog.component.scss'
})
export class SchoolDetailsDialogComponent implements OnInit {
  situacao = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: SchoolResponse) { }

  ngOnInit(): void {
    this.situacao = this.data.dateDeactivation ? 'Desativada' : 'Ativa';
  }
}