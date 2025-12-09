export interface CoverProps {
  imageUrl?: string
  setImageUrl: (url: string) => void
  setCover: (file: File) => void
  buttonText?: string
}

export interface CountryData {
  code: string
  name: string
}

export const timeZoneData = [
  { label: "India", value: "IND" },
  { label: "USA", value: "US" },
  { label: "UAE", value: "UAE" },
]

export const languageData = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
]
