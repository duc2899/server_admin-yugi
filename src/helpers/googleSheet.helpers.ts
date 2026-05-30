import { google } from "googleapis";
import env from "../configs/env";

const getGoogleSheetsClient = () => {
  const credentials = env.GOOGLE_CREDENTIALS;

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
};

export { getGoogleSheetsClient };
