import { useState, useCallback } from "react";
import { useOnboarding } from "../context/OnboardingContext";
import { EmployeeFormData, NomineeForm } from "../types/EmployeeForm";

export function useEmployeeForm() {
  const { data } = useOnboarding();
  const reqFields = data.unitConfig.requiredFields;
  const isReq = useCallback((field: string) => reqFields.includes(field), [reqFields]);

  const [formData, setFormData] = useState<EmployeeFormData>(() => ({
    dateOfJoining: data.employment.joiningDate,
    unitSite: data.employment.unit,
    firstName: data.personal.firstName,
    surname: data.personal.surname,
    mobileNumber: data.personal.mobile,
    gender: data.personal.gender,
    dateOfBirth: data.personal.dob,
    fatherName: data.personal.fatherName,
    husbandName: data.personal.husbandName,
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
    numberOfNominees: data.nomineesCount,
    nominees: data.nominees,
    em1Name: data.emergencyContact.name,
    em1Relation: data.emergencyContact.relation,
    em1Mobile: data.emergencyContact.mobile,
  }));

  const [errors, setErrors] = useState<Partial<Record<keyof EmployeeFormData | string, string>>>({});

  const updateField = useCallback((field: keyof EmployeeFormData, value: any) => {
    setFormData((prev) => {
      if (prev[field] === value) return prev;
      const newData = { ...prev, [field]: value };

      if (field === "gender" && value !== "Female") {
        newData.husbandName = "";
      }

      if (field === "numberOfNominees") {
        const count = parseInt(value, 10);
        if (isNaN(count) || count < 1) {
          return { ...newData, nominees: prev.nominees };
        }
        const newNominees = [...prev.nominees];
        while (newNominees.length < count) {
          newNominees.push({ name: "", relation: "", mobile: "", percentage: "" });
        }
        if (newNominees.length > count) {
          newNominees.splice(count);
        }
        if (count === 1) {
          newNominees[0].percentage = "100";
        }
        newData.nominees = newNominees;
      }

      return newData;
    });

    setErrors((prev) => {
      if (prev[field as string]) {
        const updatedErrors = { ...prev };
        delete updatedErrors[field as string];
        return updatedErrors;
      }
      return prev;
    });
  }, []);

  const updateNominee = useCallback((index: number, field: keyof NomineeForm, value: string) => {
    setFormData((prev) => {
      const newNominees = [...prev.nominees];
      newNominees[index] = { ...newNominees[index], [field]: value };
      return { ...prev, nominees: newNominees };
    });
    
    const errorKey = `nominee_${index}_${field}`;
    setErrors((prev) => {
      if ((prev as any)[errorKey]) {
        const updatedErrors = { ...prev };
        delete (updatedErrors as any)[errorKey];
        return updatedErrors;
      }
      return prev;
    });
  }, []);

  const validateStep = useCallback(
    (step: number): boolean => {
      const newErrors: Record<string, string> = {};
      let isValid = true;

      const check = (field: string, condition: boolean, msg: string) => {
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
        check("mobileNumber", formData.mobileNumber.length === 10, "Must be 10 digits");
        if (isReq("gender") || formData.gender.length > 0) check("gender", formData.gender.length > 0, "Required");
        check("dateOfBirth", formData.dateOfBirth.length === 10, "Required");
      } 
      else if (step === 2) {
        check("fatherName", formData.fatherName.length > 0, "Required");
        check("bloodGroup", formData.bloodGroup.length > 0, "Required");
        if (isReq("education") || formData.highestEducation.length > 0) check("highestEducation", formData.highestEducation.length > 0, "Required");
        if (isReq("maritalStatus") || formData.maritalStatus.length > 0) check("maritalStatus", formData.maritalStatus.length > 0, "Required");
      } 
      else if (step === 3) {
        if (isReq("aadhaar") || formData.aadhaarNumber.trim().length > 0) check("aadhaarNumber", formData.aadhaarNumber.trim().length > 0, "Required");
        if (isReq("pan") || formData.panNumber.trim().length > 0) check("panNumber", formData.panNumber.trim().length > 0, "Required");
        if (isReq("uan") || formData.uanNumber.trim().length > 0) check("uanNumber", formData.uanNumber.trim().length > 0, "Required");
        if (isReq("esic") || formData.esicNumber.trim().length > 0) check("esicNumber", formData.esicNumber.trim().length > 0, "Required");
        if (isReq("drivingLicence") || formData.drivingLicence.trim().length > 0) check("drivingLicence", formData.drivingLicence.trim().length > 0, "Required");
      } 
      else if (step === 4) {
        check("permanentAddress", formData.permanentAddress.length > 0, "Required");
        check("city", formData.city.length > 0, "Required");
        check("state", formData.state.length > 0, "Required");
        check("pinCode", formData.pinCode.length === 6, "Must be 6 digits");
        check("permanentPoliceStation", formData.permanentPoliceStation.length > 0, "Required");
        check("currentAddress", formData.currentAddress.length > 0, "Required");
        check("currentCity", formData.currentCity.length > 0, "Required");
        check("currentState", formData.currentState.length > 0, "Required");
        check("currentPinCode", formData.currentPinCode.length === 6, "Must be 6 digits");
      } 
      else if (step === 5) {
        if (isReq("accountHolderName") || formData.accountHolderName.trim().length > 0) check("accountHolderName", formData.accountHolderName.trim().length > 0, "Required");
        if (isReq("bankName") || formData.bankName.trim().length > 0) check("bankName", formData.bankName.trim().length > 0, "Required");
        if (isReq("accountNumber") || formData.accountNumber.trim().length > 0) check("accountNumber", formData.accountNumber.trim().length > 0, "Required");
        if (isReq("ifsc") || formData.ifscCode.trim().length > 0) check("ifscCode", formData.ifscCode.trim().length > 0, "Required");
        if (isReq("micr") || formData.micrCode.trim().length > 0) check("micrCode", formData.micrCode.trim().length > 0, "Required");

        const num = parseInt(formData.numberOfNominees, 10);
        check("numberOfNominees", !isNaN(num) && num > 0, "Must be a valid number greater than 0");

        if (!isNaN(num) && num > 0) {
          let totalPercent = 0;
          formData.nominees.forEach((n, i) => {
            check(`nominee_${i}_name`, n.name.trim().length > 0, "Required");
            check(`nominee_${i}_relation`, n.relation.trim().length > 0, "Required");
            check(`nominee_${i}_mobile`, n.mobile.length === 10, "Must be 10 digits");

            const p = parseInt(n.percentage, 10);
            check(`nominee_${i}_percentage`, !isNaN(p) && p > 0, "Must be > 0");
            if (!isNaN(p)) totalPercent += p;
          });

          if (num >= 2 && totalPercent !== 100) {
            check("numberOfNominees", false, "Total percentage allocation across all nominees must equal exactly 100%");
          }
        }
      } 
      else if (step === 6) {
        check("em1Name", formData.em1Name.length > 0, "Required");
        check("em1Relation", formData.em1Relation.length > 0, "Required");
        check("em1Mobile", formData.em1Mobile.length === 10, "Must be 10 digits");
      }

      setErrors(newErrors);
      return isValid;
    },
    [formData, isReq],
  );

  return {
    formData,
    updateField,
    updateNominee,
    errors,
    validateStep,
  };
}