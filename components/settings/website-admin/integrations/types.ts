import * as Yup from "yup";

export interface IntegrationsFormValues {
  googleAnalyticsId: string;
  googleSearchConsoleId: string;
  robotsTxt: string;
}

export const integrationsValidationSchema = Yup.object().shape({
  googleAnalyticsId: Yup.string()
    .test(
      "is-valid-ga",
      "Must be a valid GA4 ID (e.g. G-ABC123XYZ) or Universal Analytics ID (UA-XXXXX-Y)",
      (value) => {
        if (!value || value.trim() === "") return true;
        return /^(G-[A-Za-z0-9]+|UA-[0-9]+-[0-9]+)$/.test(value.trim());
      }
    )
    .nullable(),
  googleSearchConsoleId: Yup.string()
    .max(250, "Verification code cannot exceed 250 characters")
    .nullable(),
  robotsTxt: Yup.string()
    .max(5000, "robots.txt cannot exceed 5000 characters")
    .nullable(),
});
