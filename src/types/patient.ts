export interface Patient {
    id?: string; 
    firstName: string;
    lastName: string;
    middleName?: string;
    namePrefix?: string;
    nameSuffix?: string;
    preferredName?: string;
    genderIdentity?: string;
    gender?: string;
    preferredPronouns?: string;
    birthDate: string;
    age?: number;
    childrenCount?: string;
    bloodGroup?: string;
    maritalStatus?: string;
    aadhar?: string;
    pan?: string;
    landmark?: string;
    email?: string;
    phone?: string;
    mobilePhone: string;
    emergencyName?: string;
    emergencyRelation?: string;
    emergencyPhone?: string;
    chiefComplaint?: string;
    consultantName?: string;
    department?: string;
    dateOfVisit?: string;
    timeOfVisit?: string;
    appointmentType?: string;
    referredBy?: string;
    comments?: string;
    preferredContactMethod?: string;
    appointmentReminders?: boolean;
    interpreterRequired?: string;
    preferedLanguage?: string;
    ethnicity?: string;
    race?: string;
    organDonor?: boolean;
    livingWill?: boolean;
    powerOfAttorney?: boolean;
    addresses?: Address[];
    phones?: Phone[];
    identifiers?: Identifier[];
    relationships?: Relationship[];
    emergencyContacts?: emergencyContacts[];
    abhaAddress?: string;
  }

  interface Address{
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postCode: string;
    country: string;
  }

  interface Phone {
    countryCode: string;
    type: string;
    number: string;
  }

  interface Identifier {
    type: string;
    value: string;
  }
  
  interface Relationship {
    relationType: string;
    relationName: string;
    relationMobile: string;
  }

  interface emergencyContacts {
    emergencyName: string;
    emergencyRelation: string;
    emergencyPhone: string;
  }

  