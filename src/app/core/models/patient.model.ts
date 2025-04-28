import { Genre } from "./gender.enum";

export interface Patient {
    id?: string;
    ipp?: string;
    cin?: string;
    nom?: string;
    prenom?: string;
    telephone?: string;
    adresse?: string;
    ville?: string;
    birthDate?: Date;
    sexe?: Genre;
    isMinor?: boolean;
    hasInsurance?: boolean;
    qrCode?: string;
    mutuelleId?: string;
    medecinId?: number;
    companionId?: number;
    createdAt?: Date;
}