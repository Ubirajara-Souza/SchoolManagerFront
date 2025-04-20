import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    constructor(private readonly snackBar: MatSnackBar) { }

    showSuccess(message: string): void {
        this.snackBar.open(message, 'Fechar', {
            duration: 4000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
        });
    }

    showError(message: string): void {
        this.snackBar.open(`ERRO: ${message}`, 'Fechar', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
        });
    }
}