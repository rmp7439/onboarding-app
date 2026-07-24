import { useState, useCallback } from "react";
import { useOnboarding } from "../context/OnboardingContext";
import { EmployeeFormData } from "../types/EmployeeForm";

export function useEmployeeForm() {
  const { data } = useOnboarding();
  
  const reqFields = data.unitConfig.requiredFields;
  const isReq = (field: string) => reqFields.includes(field);

  const [formData, setFormData] = useState<EmployeeFormData>(() => ({
    dateOfJoining: data.employment.joiningDate,
    unitSite: data.employment.unit,
    firstName: data.personal.firstName,
    surname: data.personal.surname,
    fatherName: data.personal.fatherName,
    husbandName: data.personal.husbandName,
    gender: data.personal.gender,
    dateOfBirth: data.personal.dob,
    mobileNumber: data.personal.mobile,
    bloodGroup: data.personal.bloodGroup,
    maritalStatus: data.personal.maritalStatus,
    highestEducation: data.personal.highestEducation,
    aadhaarNumber: data.identity.aadhaar,
    panNumber: data.identity.pan,
    uanNumber: data.identity.uan,
    esicNumber: data.identity.esic,
    drivingLicence: data.identity.drivingLicence,
    permanentAddress: data.address.permanent,
    currentAddress: data.address.current,
    city: data.address.city,
    state: data.address.state,
    pinCode: data.address.pinCode,
    permanentPoliceStation: data.address.permanentPoliceStation,
    currentCity: data.address.currentCity,
    currentState: data.address.currentState,
    currentPinCode: data.address.currentPinCode,
    accountHolderName: data.bank.accountHolderName,
    bankName: data.bank.bankName,
    accountNumber: data.bank.accountNumber,
    ifscCode: data.bank.ifsc,
    micrCode: data.bank.micr,
    em1Name: data.emergencyContact.name,
    em1Relation: data.emergencyContact.relation,
    em1Mobile: data.emergencyContact.mobile,
    nomineeName: data.nominee.name,
    nomineeRelation: data.nominee.relation,
    nomineeMobile: data.nominee.mobile,
    nomineePercentage: data.nominee.percentage,
  }));

  const [errors, setErrors] = useState<Partial<Record<keyof EmployeeFormData, string>>>({});

  const updateField = (field: keyof EmployeeFormData, value: string) => {
    setFormData((prev) => {
      if (prev[field] === value) return prev;

      const newData = { ...prev, [field]: value };

      if (field === "gender" && value !== "Female") {
        newData.husbandName = "";
      }

      return newData;
    });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = useCallback(
    (step: number): boolean => {
      const newErrors: Partial<Record<keyof EmployeeFormData, string>> = {};
      let isValid = true;

      const check = (field: keyof EmployeeFormData, condition: boolean, msg: string) => {
        if (!condition) {
          newErrors[field] = msg;
          isValid = false;
        }
      };

      if (step === 1) {
        check("dateOfJoining", formData.dateOfJoining.length === 10, "Required");
        check("unitSite", formData.unitSite.length > 0, "Required");
        check("firstName", formData.firstName.length > 0, "Required");
        check("surname", formData.surname.length > 0, "Required");
        check("fatherName", formData.fatherName.length > 0, "Required");
        check("dateOfBirth", formData.dateOfBirth.length === 10, "Required");
        check("mobileNumber", formData.mobileNumber.length === 10, "Must be 10 digits");
        check("bloodGroup", formData.bloodGroup.length > 0, "Required");

        if (isReq('gender') || formData.gender.length > 0) check("gender", formData.gender.length > 0, "Required");
        if (isReq('education') || formData.highestEducation.length > 0) check("highestEducation", formData.highestEducation.length > 0, "Required");
        if (isReq('maritalStatus') || formData.maritalStatus.length > 0) check("maritalStatus", formData.maritalStatus.length > 0, "Required");

      } else if (step === 2) {
        if (isReq('aadhaar') || formData.aadhaarNumber.trim().length > 0) check("aadhaarNumber", formData.aadhaarNumber.trim().length > 0, "Required");
        if (isReq('pan') || formData.panNumber.trim().length > 0) check("panNumber", formData.panNumber.trim().length > 0, "Required");
        if (isReq('uan') || formData.uanNumber.trim().length > 0) check("uanNumber", formData.uanNumber.trim().length > 0, "Required");
        if (isReq('esic') || formData.esicNumber.trim().length > 0) check("esicNumber", formData.esicNumber.trim().length > 0, "Required");
        if (isReq('drivingLicence') || formData.drivingLicence.trim().length > 0) check("drivingLicence", formData.drivingLicence.trim().length > 0, "Required");

      } else if (step === 3) {
        check("permanentAddress", formData.permanentAddress.length > 0, "Required");
        check("city", formData.city.length > 0, "Required");
        check("state", formData.state.length > 0, "Required");
        check("pinCode", formData.pinCode.length === 6, "Must be 6 digits");
        check("permanentPoliceStation", formData.permanentPoliceStation.length > 0, "Required");

        check("currentAddress", formData.currentAddress.length > 0, "Required");
        check("currentCity", formData.currentCity.length > 0, "Required");
        check("currentState", formData.currentState.length > 0, "Required");
        check("currentPinCode", formData.currentPinCode.length === 6, "Must be 6 digits");

        if (isReq('accountHolderName') || formData.accountHolderName.trim().length > 0) check("accountHolderName", formData.accountHolderName.trim().length > 0, "Required");
        if (isReq('bankName') || formData.bankName.trim().length > 0) check("bankName", formData.bankName.trim().length > 0, "Required");
        if (isReq('accountNumber') || formData.accountNumber.trim().length > 0) check("accountNumber", formData.accountNumber.trim().length > 0, "Required");
        if (isReq('ifsc') || formData.ifscCode.trim().length > 0) check("ifscCode", formData.ifscCode.trim().length > 0, "Required");
        if (isReq('micr') || formData.micrCode.trim().length > 0) check("micrCode", formData.micrCode.trim().length > 0, "Required");

      } else if (step === 4) {
        check("em1Name", formData.em1Name.length > 0, "Required");
        check("em1Relation", formData.em1Relation.length > 0, "Required");
        check("em1Mobile", formData.em1Mobile.length === 10, "Must be 10 digits");

        if (isReq('nomineeName') || formData.nomineeName.length > 0) check("nomineeName", formData.nomineeName.length > 0, "Required");
        if (isReq('nomineeRelation') || formData.nomineeRelation.length > 0) check("nomineeRelation", formData.nomineeRelation.length > 0, "Required");
        
        if (isReq('nomineeMobile') || formData.nomineeMobile.length > 0) {
          check("nomineeMobile", formData.nomineeMobile.length === 10, "Must be 10 digits");
        }
        
        if (isReq('nomineePercentage') || formData.nomineePercentage.length > 0) {
          const perc = parseInt(formData.nomineePercentage, 10);
          check("nomineePercentage", !isNaN(perc) && perc >= 1 && perc <= 100, "Must be 1-100");
        }
      }

      setErrors(newErrors);
      return isValid;
    },
    [formData, reqFields],
  );

  return {
    formData,
    updateField,
    errors,
    validateStep,
  };
}