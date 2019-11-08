export interface LoginResponse {
    "auth": boolean;
    "data": {
        "adminId": number,
        "firstName": string,
        "lastName": string,
        "mobileNumber": string,
        "emailId": string,
        "organizationIdFK": number,
        "organizationName": string
        "token": string
    };
    "message": string;
}