import { Genre } from "./gender.enum";

export interface Patient {
    id?: string;
    ipp?: string;
    cin?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    address?: string;
    city?: string;
    dateOfBirth?: Date;
    gender?: Genre;
    hasInsurance?: boolean;
    insuranceName?: string;
    isMinor?: boolean;
    referringDoctor?: number;
    companionGuid?: number;
    qrCode?: string;
    createdAt?: Date;
}