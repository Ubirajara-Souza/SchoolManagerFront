import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

@Injectable()
export class AppDateAdapter extends NativeDateAdapter {
    override format(date: Date, displayFormat: Object): string {
        const day = this._to2digit(date.getDate());
        const month = this._to2digit(date.getMonth() + 1);
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    override parse(value: string): Date | null {
        if (!value) return null;

        const parts = value.split('/');
        if (parts.length === 3) {
            const day = +parts[0];
            const month = +parts[1] - 1;
            const year = +parts[2];
            return new Date(year, month, day);
        }
        return null;
    }

    private _to2digit(n: number): string {
        return ('00' + n).slice(-2);
    }
}