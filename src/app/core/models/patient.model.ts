import { Genre } from "./gender.enum";

export interface Patient {
  id?: string;
  patientGuid?: string; // Added for API compatibility
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
  entryType?: 'adult' | 'minor' | 'proxy' | 'unknown';
  verificationStatus?: 'verified' | 'pending' | 'unverified';
  referringDoctor?: number;
  companionGuid?: number;
  qrCode?: string;
  qrcodeUrl?: string; // Added for API response
  createdAt?: Date;
  notes?: string;
  
  // Companion information
  companion?: {
    fullName: string;
    phone: string;
    relationship: 'mother' | 'father' | 'sister' | 'brother' | 'wife' | 'husband' | 'guardian' | 'friend';
  };
}

export interface Companion {
  fullName: string;
  phone: string;
  relationship: 'mother' | 'father' | 'sister' | 'brother' | 'wife' | 'husband' | 'guardian' | 'friend';
}

export const ENTRY_TYPES = [
  { label: 'Adult', value: 'adult' },
  { label: 'Minor', value: 'minor' },
  { label: 'Proxy', value: 'proxy' },
  { label: 'Unknown', value: 'unknown' }
];

export const VERIFICATION_STATUSES = [
  { label: 'Verified', value: 'verified' },
  { label: 'Pending', value: 'pending' },
  { label: 'Unverified', value: 'unverified' }
];

export const COMPANION_RELATIONSHIPS = [
  { label: 'Mother', value: 'mother' },
  { label: 'Father', value: 'father' },
  { label: 'Sister', value: 'sister' },
  { label: 'Brother', value: 'brother' },
  { label: 'Wife', value: 'wife' },
  { label: 'Husband', value: 'husband' },
  { label: 'Guardian', value: 'guardian' },
  { label: 'Friend', value: 'friend' }
];