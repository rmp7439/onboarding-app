import React from 'react';
import { OptionSelector } from './OptionSelector';
import { BLOOD_GROUPS } from '../../constants/BloodGroups';

interface BloodGroupSelectorProps {
  value: string;
  onChange: (val: string) => void;
}

export function BloodGroupSelector({ value, onChange }: BloodGroupSelectorProps) {
  return (
    <OptionSelector label="Blood Group" options={BLOOD_GROUPS} selectedValue={value} onSelect={onChange} />
  );
}