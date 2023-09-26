import DatabaseHandler from "../lib/database/DatabaseHandler.js";

/**
 * get profile lists
 * 
 */

export const getChildProfilesAsync = async () => {
  const results = await DatabaseHandler.executeSingleQueryAsync(
    `SELECT "FirstName", "LastName", "DateOfBirth",
  "Gender","GuardianInfo" FROM "ChildProfile"`, []);
  return results; 
};

export const getStaffProfileListAsync = async() =>{
  const results= await DatabaseHandler.executeSingleQueryAsync(`SELECT
    "User"."Id",
    "User"."Username",
    "User"."Name",
    "User"."Email"
FROM
  "User"
INNER JOIN
  "UserRole" ON "User"."Id" = "UserRole"."UserId"
INNER JOIN
  "Role" ON "UserRole"."RoleId" = "Role"."Id"
WHERE
  "Role"."Name" = 'admin'`,[]);
  return results;
}

export const getSocialWorkerProfileListAsync = async() =>{
  const results= await DatabaseHandler.executeSingleQueryAsync(`SELECT
  "User"."Id",
  "User"."Username",
  "User"."Name",
  "User"."Email"
FROM
"User"
INNER JOIN
"UserRole" ON "User"."Id" = "UserRole"."UserId"
INNER JOIN
"Role" ON "UserRole"."RoleId" = "Role"."Id"
WHERE
"Role"."Name" = 'socialWorker'`,[]);
  return results;
}

export const getParentProfileListAsync = async() =>{
  const results= await DatabaseHandler.executeSingleQueryAsync(`SELECT
  "User"."Id",
  "User"."Username",
  "User"."Name",
  "User"."Email"
FROM
"User"
INNER JOIN
"UserRole" ON "User"."Id" = "UserRole"."UserId"
INNER JOIN
"Role" ON "UserRole"."RoleId" = "Role"."Id"
WHERE
"Role"."Name" = 'parent'`,[]);
  return results;
}



/**
 * Create Profiles
 */

export const createChildProfileAsync = async(FirstName,MiddleNames, LastName,DateOfBirth,Gender,DateOfAdmission,DateOfEntry,Country,City,GuardianInfo) =>{
   
  return await DatabaseHandler.executeSingleQueryAsync(`INSERT INTO "ChildProfile" ("FirstName", "MiddleNames", "LastName","DateOfBirth","Gender","DateOfAdmission","DateOfEntry","Country","City","GuardianInfo","GuardianId") values(?,?,?,?,?,?,?,?,?,?,?)`,
  [FirstName,MiddleNames,LastName,DateOfBirth,Gender,DateOfAdmission,DateOfEntry,Country,City,GuardianInfo]);
}

export const createStaffProfileAsync = async() =>{
  await DatabaseHandler.executeSingleQueryAsync('',[]);
}

export const createSocialWorkerProfileAsync = async() =>{
  await DatabaseHandler.executeSingleQueryAsync('',[]);
}

export const createParentProfileAsync = async() =>{
  await DatabaseHandler.executeSingleQueryAsync(``,[]);
}

/**
 * Delete Profiles
 */

export const deleteChildProfileAsync = async() =>{
  await DatabaseHandler.executeSingleQueryAsync('',[]);
}

export const deleteStaffProfileAsync = async() =>{
  await DatabaseHandler.executeSingleQueryAsync('',[]);
}

export const deleteSocialWorkerProfileAsync = async() =>{
  await DatabaseHandler.executeSingleQueryAsync('',[]);
}

export const deleteParentProfileAsync = async() =>{
  await DatabaseHandler.executeSingleQueryAsync('',[]);
}

/**
 * Edit Profiles
 */

export const editChildProfileAsync = async() =>{
  await DatabaseHandler.executeSingleQueryAsync('',[]);
}

export const editStaffProfileAsync = async() =>{
  await DatabaseHandler.executeSingleQueryAsync('',[]);
}

export const editSocialWorkerProfileAsync = async() =>{
  await DatabaseHandler.executeSingleQueryAsync('',[]);
}

export const editParentProfileAsync = async() =>{
  await DatabaseHandler.executeSingleQueryAsync('',[]);
}


/**
 * View profiles by managers
 */

export const viewChildProfilesAsync = async () => {
  const results = await DatabaseHandler.executeSingleQueryAsync( `SELECT "FirstName", "MiddleNames", "LastName", "DateOfBirth",
  "Gender", "DateOfAdmission", "DateOfEntry", "Country", "City",
  "GuardianInfo" FROM "ChildProfile"`, []);
  return results;
};

export const viewStaffProfileListAsync = async() =>{
  const results= await DatabaseHandler.executeSingleQueryAsync('',[]);
  return results;
}

export const viewSocialWorkerProfileListAsync = async() =>{
  const results= await DatabaseHandler.executeSingleQueryAsync('',[]);
  return results;
}

export const viewParentProfileListAsync = async() =>{
  const results= await DatabaseHandler.executeSingleQueryAsync('',[]);
  return results;
}

/**
 * External party view child profiles
 */

export const viewChildInfoExternalAsync = async () => {
  const results = await DatabaseHandler.executeSingleQueryAsync('', []);
  return results;
};



/**
 * Profile count
 */

// manager dashboard child profile count
export const getChildProfileCountAsync = async() =>{
  // orphanage wise
  return await DatabaseHandler.executeSingleQueryAsync('',[]);

  
};

// manager dashboard staff profile count
export const getStaffCountAsync = async() =>{
  // orphanage wise
  return await DatabaseHandler.executeSingleQueryAsync('',[]);
};



// admin dashboard child profile count
export const getChildProfileCountAdminAsync = async() =>{
  return await DatabaseHandler.executeSingleQueryAsync('SELECT COUNT(*) FROM "ChildProfile"',[]);
  
};

// admin dashboard staff profile count
export const getStaffCountStaffAsync = async() =>{
  return await DatabaseHandler.executeSingleQueryAsync('',[]);
};

