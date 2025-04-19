import { AddressResponse } from "../address/address-response";
import { SchoolResponse } from "../school/school-response";
import { ResponsePersonalizado } from "../response-personalizado";

export interface StudentResponse extends ResponsePersonalizado {
    name: string;
    dateOfBirth: Date;
    cpf: string;
    cellPhone: string;
    address: AddressResponse;
    school: SchoolResponse;
}