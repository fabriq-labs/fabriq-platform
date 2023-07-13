// i18n
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../locales/en.json";
// import nl from '../locales/nl.json';

i18n.use(initReactI18next).init({
  resources: {
    en
  },
  lng: "en",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
