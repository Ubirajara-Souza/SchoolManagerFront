import { ClaimDto } from './claim-dto';

export interface UserTokenDto {
  id?: string;
  email?: string;
  claims: ClaimDto[];
}