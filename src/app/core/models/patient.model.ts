import { Genre } from "./gender.enum";

export interface Patient {
    id?: number;
    ipp?: string;
    cin?: string;
    nom?: string;
    prenom?: string;
    telephone?: string;
    adresse?: string;
    ville?: string;
    date_naissance?: Date;
    sexe?: Genre;
    is_minor?: boolean;
    has_insurance?: boolean;
    mutuelle?: string;
    qr_code?: string;
    medecin_referent?: string;
    companion_id?: number;
    created_at?: Date;
}

