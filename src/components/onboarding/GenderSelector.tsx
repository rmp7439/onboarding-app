import React from 'react';
import { OptionSelector } from './OptionSelector';
import { GENDERS } from '../../constants/Gender';

interface GenderSelectorProps {
  value: string;
  onChange: (val: string) => void;
}

export function GenderSelector({ value, onChange }: GenderSelectorProps) {
  return (
    <OptionSelector label="Gender" options={GENDERS} selectedValue={value} onSelect={onChange} />
  );
}