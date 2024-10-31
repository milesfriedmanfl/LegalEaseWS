import { IsAlphanumeric, IsString, Length, Matches } from 'class-validator';

export class SearchTermDto {
    // TODO - return to these validators later to debug issues
    // @Matches(/^[a-zA-Z0-9\s]*$/, { message: 'term must contain only letters, numbers, and spaces' }) // Restrict input to avoid attempts at injection attacks
    // @IsString()
    // @Length(1, 50)  // Restrict term length to avoid excessively long queries
    term: string;
}
