import { Genre } from "./gender.enum";

export interface Patient {
    id?: string;
    ipp?: string;
    cin?: string;
    firstname?: string;
    lastname?: string;
    phoneNumber?: string;
    address?: string;
    city?: string;
    dateOfBirth?: Date;
    gender?: Genre;
    isMinor?: boolean;
    hasInsurance?: boolean;
    qrCode?: string;
    insuranceId?: string;
    doctorId?: number;
    companionId?: number;
    createdAt?: Date;
}