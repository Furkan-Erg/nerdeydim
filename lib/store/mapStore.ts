import { create } from "zustand";

interface MapState {
  selectedCountryCode: string | null;
  selectedCityId: string | null;
  setSelectedCountryCode: (code: string | null) => void;
  setSelectedCityId: (id: string | null) => void;
  clearSelection: () => void;
}

export const useMapStore = create<MapState>((set) => ({
  selectedCountryCode: null,
  selectedCityId: null,
  setSelectedCountryCode: (code) =>
    set({ selectedCountryCode: code, selectedCityId: null }),
  setSelectedCityId: (id) => set({ selectedCityId: id, selectedCountryCode: null }),
  clearSelection: () => set({ selectedCountryCode: null, selectedCityId: null }),
}));
