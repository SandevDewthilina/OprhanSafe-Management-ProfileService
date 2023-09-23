import DatabaseHandler from "../lib/database/DatabaseHandler.js";

export const getChildProfilesAsync = async () => {
  const results = await DatabaseHandler.executeSingleQueryAsync('SELECT * FROM "ChildProfile"', []);
  // format dates
  return results;
};
