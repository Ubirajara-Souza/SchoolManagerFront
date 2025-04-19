import { ClaimItemDto } from './claim-item-dto';

export interface AddClaimDto {
    email: string;
    claims: ClaimItemDto[];
}