import { formatDateForForm, mapBloodGroupFromBackend, mapEducationFromBackend, mapMaritalStatusFromBackend } from "./dataMappers";
import { OnboardingData } from "../context/OnboardingContext";
import { Href, Router } from "expo-router";

export const startEditingApplication = (
  profile: any,
  updateData: (newData: Partial<OnboardingData>) => void,
  router: Router
) => {
  const names = profile.nomineeName ? profile.nomineeName.split(',').map((s: string)=>s.trim()) : [];
  const relations = profile.nomineeRelation ? profile.nomineeRelation.split(',').map((s: string)=>s.trim()) : [];
  const mobiles = profile.nomineeMobile ? profile.nomineeMobile.split(',').map((s: string)=>s.trim()) : [];
  
  const nominees = [];
  if (names.length > 0) {
      for (let i=0; i<names.length; i++) {
          nominees.push({
              name: names[i] || "",
              relation: relations[i] || "",
              mobile: mobiles[i] || "",
              percentage: names.length === 1 ? (profile.nomineePercentage ? profile.nomineePercentage.toString() : "100") : ""
          });
      }
  } else {
      nominees.push({ name: "", relation: "", mobile: "", percentage: "100" });
  }

  updateData({
    isEditMode: true,
    editEmployeeId: profile.id,
    employment: {
      joiningDate: formatDateForForm(profile.joiningDate),
      unit: profile.unit || "",
    },
    personal: {
      firstName: profile.firstName || "",
      surname: profile.surname || "",
      fatherName: profile.fatherName || "",
      husbandName: profile.husbandName || "",
      gender: profile.gender === "FEMALE" ? "Female" : profile.gender === "OTHER" ? "Other" : "Male",
      dob: formatDateForForm(profile.dateOfBirth || ""),
      mobile: profile.mobile || "",
      bloodGroup: mapBloodGroupFromBackend(profile.bloodGroup),
      maritalStatus: mapMaritalStatusFromBackend(profile.maritalStatus),
      highestEducation: mapEducationFromBackend(profile.education),
    },
    identity: {
      aadhaar: profile.aadhaar || "",
      pan: profile.pan || "",
      uan: profile.uan || "",
      esic: profile.esic || "",
      drivingLicence: profile.drivingLicence || "",
    },
    address: {
      permanent: profile.permanentAddress || "",
      current: profile.currentAddress || "",
      city: profile.city || "",
      state: profile.state || "",
      pinCode: profile.pinCode || "",
      permanentPoliceStation: profile.permanentPoliceStation || "", 
      currentCity: profile.currentCity || "",                       
      currentState: profile.currentState || "",                     
      currentPinCode: profile.currentPinCode || "",                 
    },
    bank: {
      accountHolderName: profile.accountHolderName || "", 
      bankName: profile.bankName || "",
      accountNumber: profile.accountNumber || "",
      ifsc: profile.ifsc || "",
      micr: profile.micr || "",
    },
    nomineesCount: nominees.length.toString(),
    nominees: nominees,
    emergencyContact: {
      name: profile.emergencyName || "",
      relation: profile.emergencyRelation || "",
      mobile: profile.emergencyPhone || "",
    },
    selfieUri: profile.selfieUrl || profile.selfieFilename ? "EXISTING" : null,
    existingDocuments: profile.documents?.map((d: any) => d.type) || [],
  });

  router.push("/(onboarding)/new-guard/employee-details" as Href);
};