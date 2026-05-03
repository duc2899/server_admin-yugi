import { google } from "googleapis";

const getGoogleSheetsClient = () => {
  const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS!);  

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
};

export { getGoogleSheetsClient };
