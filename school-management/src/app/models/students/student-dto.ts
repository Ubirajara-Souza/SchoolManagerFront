import { AddressDto } from "../address/address-dto";

export interface StudentDto {
    name: string;
    dateOfBirth: Date;
    cpf: string;
    cellPhone: string;
    codeSchool: number;
    address: AddressDto;
}