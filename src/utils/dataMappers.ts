import { OnboardingData } from '../context/OnboardingContext';

// Maps mobile blood group selections to backend Prisma Enum
export const mapBloodGroup = (bg: string): string => {
  const map: Record<string, string> = {
    "A+": "A_POSITIVE", "A-": "A_NEGATIVE", 
    "B+": "B_POSITIVE", "B-": "B_NEGATIVE",
    "AB+": "AB_POSITIVE", "AB-": "AB_NEGATIVE", 
    "O+": "O_POSITIVE", "O-": "O_NEGATIVE"
  };
  return map[bg] || "O_POSITIVE";
};

// Converts DD/MM/YYYY into an ISO DateTime string
export const parseDateString = (dateStr: string): string => {
  const [day, month, year] = dateStr.split('/');
  return new Date(`${year}-${month}-${day}T00:00:00.000Z`).toISOString();
};

// Maps Onboarding Context directly to the API Schema
export const mapEmployeeData = (data: OnboardingData) => {
  return {
    firstName: data.personal.firstName,
    surname: data.personal.surname,
    fatherName: data.personal.fatherName,
    husbandName: data.personal.husbandName || null,
    gender: data.personal.gender.toUpperCase(),
    bloodGroup: mapBloodGroup(data.personal.bloodGroup),
    dateOfBirth: parseDateString(data.personal.dob),
    joiningDate: parseDateString(data.employment.joiningDate),
    mobile: data.personal.mobile,
    aadhaar: data.identity.aadhaar,
    pan: data.identity.pan,
    uan: data.identity.uan || null,
    esic: data.identity.esic || null,
    permanentAddress: data.address.permanent,
    currentAddress: data.address.current,
    city: data.address.city,
    state: data.address.state,
    pinCode: data.address.pinCode,
    bankName: data.bank.bankName,
    accountNumber: data.bank.accountNumber,
    ifsc: data.bank.ifsc,
    branch: data.bank.branch,
    micr: data.bank.micr,
    emergencyName: data.emergencyContact.name,
    emergencyRelation: data.emergencyContact.relation,
    emergencyPhone: data.emergencyContact.mobile,
  };
};

// Maps local document IDs to the Backend DocumentType Enum
export const mapDocumentType = (id: string): string => {
  const map: Record<string, string> = {
    aadhaar: 'AADHAAR',
    pan: 'PAN',
    driving: 'DRIVING_LICENSE',
    bank: 'BANK_PASSBOOK',
    education: 'EDUCATION',
    voter: 'VOTER_ID',
    discharge: 'DISCHARGE_BOOK'
  };
  return map[id] || 'AADHAAR';
};