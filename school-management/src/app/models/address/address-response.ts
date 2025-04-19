import { ResponsePersonalizado } from "../response-personalizado";

export interface AddressResponse extends ResponsePersonalizado {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
}