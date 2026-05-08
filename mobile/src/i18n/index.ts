import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as Localization from 'expo-localization'

import pt from './locales/pt.json'
import en from './locales/en.json'

const deviceLocale = Localization.getLocales()[0]?.languageCode ?? 'pt'
const defaultLanguage = deviceLocale.startsWith('pt') ? 'pt' : 'pt'

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: defaultLanguage,
  fallbackLng: 'pt',
  resources: {
    pt: { translation: pt },
    en: { translation: en },
  },
  interpolation: { escapeValue: false },
})

export default i18n
