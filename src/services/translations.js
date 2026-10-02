import { DE, EN, ES, PT } from "../enums/languages";

const PROJECT_ID = "dd868d54-eb0f-4ea0-9626-efd9e762d023";
let translations = null;
let language = ES;

export async function getTranslations(lang, callback) {
  const targetLang = lang ?? language;
  if (targetLang === language && translations) {
    if (callback) callback();
    return;
  }
  localStorage.removeItem("translations");
  translations = null;
  language = targetLang;
  if (language === ES) {
    return callback ? callback() : false;
  }

  try {
    const response = await fetch(
      `https://traducila.vercel.app/api/translations/${PROJECT_ID}/${language}`
    );
    const data = await response.json();
    localStorage.setItem("translations", JSON.stringify(data));
    translations = data;
    if (callback) callback();
  } catch (error) {
    console.error("Error al obtener traducciones:", error);
    if (callback) callback();
  }
}

export function getPhrase(key) {
  if (!translations) {
    const locals = localStorage.getItem("translations");
    if (locals) {
      try {
        translations = JSON.parse(locals);
      } catch {
        translations = null;
      }
    }
  }

  let phrase = key;
  const keys = translations?.data?.words;
  if (keys && Array.isArray(keys)) {
    const translation =
      keys.find((item) => item.key === key) ??
      keys.find(
        (item) =>
          typeof item.key === "string" &&
          item.key.trim() === String(key).trim()
      );
    if (translation && translation.translate) {
      phrase = translation.translate;
    }
  }

  return phrase;
}

function isAllowedLanguage(language) {
  const allowedLanguages = [ES, EN, PT, DE];
  return allowedLanguages.includes(language);
}

export function getLanguageConfig() {
  let languageConfig;

  const rawPath =
    window.location.pathname !== "/" ? window.location.pathname : null;
  const path = rawPath ? rawPath.replace(/^\/+|\/+$/g, "").split("/")[0] : null;
  const params = new URL(window.location.href).searchParams;
  const queryLang = params.get("lang");

  languageConfig = path ?? queryLang;

  if (languageConfig) {
    if (isAllowedLanguage(languageConfig)) {
      return languageConfig;
    }
  }

  const browserLanguage = window.navigator.language;
  if (isAllowedLanguage(browserLanguage)) {
    return browserLanguage;
  }

  return ES;
}
