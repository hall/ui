export class User {
    id: string;
    email: string;
    password: string;
    access_codes: string[];
    admin: boolean;
    sessions: string[];
    scenario: string;
    step: string;
    token: string;
}
