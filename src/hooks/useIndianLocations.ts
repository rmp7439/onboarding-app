import { useMemo } from 'react';
import { State, City } from 'country-state-city';

export interface LocationOption {
  label: string;
  value: string;
}

export function useIndianLocations(selectedStateName: string) {
  // Load and cache all Indian states
  const stateOptions = useMemo<LocationOption[]>(() => {
    return State.getStatesOfCountry('IN').map((state) => ({
      label: state.name,
      value: state.name,
    }));
  }, []);

  // Isolate the isoCode of the currently selected state required to fetch cities
  const selectedStateIsoCode = useMemo<string | null>(() => {
    if (!selectedStateName) return null;
    const stateObj = State.getStatesOfCountry('IN').find(
      (s) => s.name === selectedStateName
    );
    return stateObj ? stateObj.isoCode : null;
  }, [selectedStateName]);

  // Dynamically load cities only when a valid state isoCode is available
  const cityOptions = useMemo<LocationOption[]>(() => {
    if (!selectedStateIsoCode) return [];
    return City.getCitiesOfState('IN', selectedStateIsoCode).map((city) => ({
      label: city.name,
      value: city.name,
    }));
  }, [selectedStateIsoCode]);

  return {
    stateOptions,
    cityOptions,
  };
}