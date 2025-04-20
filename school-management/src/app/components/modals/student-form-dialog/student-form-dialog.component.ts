import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SchoolResponse } from 'app/models/school/school-response';
import { StudentDto } from 'app/models/students/student-dto';
import { StudentResponse } from 'app/models/students/student-response';
import { SchoolService } from 'app/services/school.service';
import { CepService } from 'app/services/cep.service';
import moment from 'moment';

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
    private readonly schoolService: SchoolService,
    private readonly cepService: CepService
  ) { }

  ngOnInit(): void {
    this.isEdit = !!this.data;
    this.loadSchools();
    this.initializeForm();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      name: [this.data?.name ?? '', [Validators.required, Validators.maxLength(200)]],
      dateOfBirth: [this.data?.dateOfBirth ? new Date(this.data.dateOfBirth) : null, Validators.required],
      cpf: [this.data?.cpf ? this.maskCpf(this.data.cpf) : '', [Validators.required]],
      cellPhone: [this.data?.cellPhone ? this.maskCell(this.data.cellPhone) : '', [Validators.required]],
      codeSchool: [this.data?.school?.code ?? '', Validators.required],
      address: this.fb.group({
        zipCode: [this.data?.address?.zipCode ? this.maskCep(this.data.address.zipCode) : '', [Validators.required, Validators.minLength(8), Validators.maxLength(9)]],
        street: [this.data?.address?.street ?? '', Validators.required],
        number: [this.data?.address?.number ?? '', Validators.required],
        complement: [this.data?.address?.complement ?? ''],
        neighborhood: [this.data?.address?.neighborhood ?? '', Validators.required],
        city: [this.data?.address?.city ?? '', Validators.required],
        state: [this.data?.address?.state ?? '', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]]
      })
    });

    this.form.get('address.zipCode')?.valueChanges.subscribe(value => {
      const unmasked = this.unmask(value);
      if (unmasked && unmasked.length === 8) {
        this.searchZip();
      }
    });

    this.form.get('dateOfBirth')?.valueChanges.subscribe(value => {
      const unmasked = this.unmask(value);
      if (unmasked.length === 8) {
        const formatted = `${unmasked.slice(0, 2)}/${unmasked.slice(2, 4)}/${unmasked.slice(4)}`;
        this.form.patchValue({ dateOfBirth: formatted }, { emitEvent: false });
      }

      const isValidDate = moment(value, 'DD/MM/YYYY', true).isValid();
      const parsed = moment(value, 'DD/MM/YYYY');
      const minDate = moment('1900-01-01');
      const now = moment();

      if (!isValidDate || parsed.isBefore(minDate) || parsed.isAfter(now)) {
        this.form.get('dateOfBirth')?.setErrors({ invalid: true });
      } else {
        this.form.get('dateOfBirth')?.setErrors(null);
      }
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

  private unmask(value: any): string {
    if (typeof value !== 'string') return '';
    return value.replace(/\D/g, '') ?? '';
  }

  private maskCpf(cpf: string): string {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  private maskCell(cell: string): string {
    return cell.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2.$3');
  }

  private maskCep(cep: string): string {
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  searchZip(): void {
    const cep = this.unmask(this.form.get('address.zipCode')?.value);
    if (cep.length === 8) {
      this.cepService.consultarCEP(cep).subscribe(result => {
        if (!result.erro) {
          this.form.patchValue({
            address: {
              street: result.logradouro,
              neighborhood: result.bairro,
              city: result.localidade,
              state: result.uf
            }
          });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.valid) {
      const dto: StudentDto = this.form.value;
      dto.cpf = this.unmask(dto.cpf);
      dto.cellPhone = this.unmask(dto.cellPhone);
      dto.address.zipCode = this.unmask(dto.address.zipCode);

      if (dto.dateOfBirth) {
        const parsedDate = moment(dto.dateOfBirth, 'DD/MM/YYYY');
        dto.dateOfBirth = parsedDate.isValid() ? parsedDate.toDate() : dto.dateOfBirth;
      }

      this.dialogRef.close(dto);
    }
  }
}