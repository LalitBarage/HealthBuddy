// HospitalContext.js
import React, { createContext, useContext, useState } from 'react';

const HospitalContext = createContext();

export const useHospital = () => useContext(HospitalContext);

export const HospitalProvider = ({ children }) => {
  const [hid, setHid] = useState(null); // Set this after login

  return (
    <HospitalContext.Provider value={{ hid, setHid }}>
      {children}
    </HospitalContext.Provider>
  );
};
