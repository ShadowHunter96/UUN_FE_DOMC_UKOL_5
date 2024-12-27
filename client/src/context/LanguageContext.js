import React, { createContext, useState, useContext } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en"); // Default language is English

  const translations = {
    en: {
      title: "Shopping List App",
      addNewList: "Add New List",
      showArchived: "Show Archived",
      userPanel: "User Panel",
      adminPanel: "Admin Panel",
    },
    cz: {
      title: "Nákupní Seznamy",
      addNewList: "Přidat nový seznam",
      showArchived: "Zobrazit archivované",
      userPanel: "Uživatelský panel",
      adminPanel: "Admin panel",
    },
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
