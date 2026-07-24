export interface NomineeForm {
  name: string;
  relation: string;
  mobile: string;
  percentage: string;
}

export interface EmployeeFormData {
  // Step 1: Employment
  dateOfJoining: string;
  unitSite: string;
  firstName: string;
  surname: string;
  mobileNumber: string;
  gender: string;
  dateOfBirth: string;

  // Step 2: Personal
  fatherName: string;
  husbandName: string;
  bloodGroup: string;
  maritalStatus: string;
  highestEducation: string;

  // Step 3: Identity
  aadhaarNumber: string;
  panNumber: string;
  uanNumber: string;
  esicNumber: string;
  drivingLicence: string;

  // Step 4: Address
  permanentAddress: string;
  currentAddress: string;
  city: string;
  state: string;
  pinCode: string;
  permanentPoliceStation: string; 
  currentCity: string;            
  currentState: string;           
  currentPinCode: string;         

  // Step 5: Bank & Nominees
  accountHolderName: string; 
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  micrCode: string;
  numberOfNominees: string;
  nominees: NomineeForm[];

  // Step 6: Emergency Contact
  em1Name: string;
  em1Relation: string;
  em1Mobile: string;
}