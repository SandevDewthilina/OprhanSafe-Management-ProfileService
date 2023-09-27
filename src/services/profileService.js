import DatabaseHandler from "../lib/database/DatabaseHandler.js";

/**
 * get profile lists
 * 
 */

export const getChildProfilesAsync = async () => {
  const results = await DatabaseHandler.executeSingleQueryAsync(
    `select "FullName","DOB","Gender","DateOfAdmission" from "ChildProfile";`, []);
  return results; 
};

export const getStaffProfileListAsync = async() =>{
  const results= await DatabaseHandler.executeSingleQueryAsync(`select  "User"."Name" AS "UserName",
  "User"."Email",
  "User"."PhoneNumber",
  "User"."Gender",
"Role"."Name" AS "RoleName"
FROM
"User"
INNER JOIN
"UserRole" ON "User"."Id" = "UserRole"."UserId"
INNER JOIN
"Role" ON "UserRole"."RoleId" = "Role"."Id"
WHERE
 "Role"."Name" IN ('admin', 'systemManager','orphanageStaff');`,[]);
  return results;
}

export const getSocialWorkerProfileListAsync = async() =>{
  const results= await DatabaseHandler.executeSingleQueryAsync(`select  "User"."Name",
  "User"."Email",
  "User"."PhoneNumber",
  "User"."Gender",
"SocialWorker"."Organization"
FROM
"User"
INNER JOIN
"SocialWorker" ON "User"."Id" = "SocialWorker"."UserId";`,[]);
  return results;
}

export const getParentProfileListAsync = async() =>{
  const results= await DatabaseHandler.executeSingleQueryAsync(`select  "NameOfFather",
  "NameOfMother",
 "Email",
 "MobileOfFather",
"MobileOfMother",
"Address"
FROM
"Parent";`,[]);
  return results;
}



/**
 * Create Profiles
 */

export const createChildProfileAsync = async( FullName,
  DOB,
  Gender,
  DateOfAdmission,
  Country,
  City,
  Nationality,
  Language,
  Remark,
  MedicalDesc,
  BirthFather,
  BirthMother,
  ReasonForPlacement,
  RegisteredBy) =>{
   
  return await DatabaseHandler.executeSingleQueryAsync(`INSERT INTO "ChildProfile" (
    "FullName",
    "DOB",
    "Gender",
    "DateOfAdmission",
    "Country",
    "City",
    "Nationality",
    "Language",
    "Remark",
    "MedicalDesc",
    "BirthFather",
    "BirthMother",
    "ReasonForPlacement",
    "RegisteredBy"
) VALUES ($1, $2,$3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14);`,
[
  FullName,
  DOB,
  Gender,
  DateOfAdmission,
  Country,
  City,
  Nationality,
  Language,
  Remark,
  MedicalDesc,
  BirthFather,
  BirthMother,
  ReasonForPlacement,
  RegisteredBy
]);
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

export const viewChildProfilesAsync = async (id) => {
  const results = await DatabaseHandler.executeSingleQueryAsync( `  SELECT
  "Id",
  "FirstName",
  "MiddleNames",
  "LastName",
  "DateOfBirth",
  "Gender",
  "DateOfAdmission",
  "DateOfEntry",
  "Country",
  "City",
  "GuardianInfo"
FROM
  "ChildProfile"
WHERE
  "Id" = $1"`, [id]);
  return results;
};

export const viewStaffProfileAsync = async() =>{
  const results= await DatabaseHandler.executeSingleQueryAsync('',[]);
  return results;
}

export const viewSocialWorkerProfileAsync = async() =>{
  const results= await DatabaseHandler.executeSingleQueryAsync('',[]);
  return results;
}

export const viewParentProfileAsync = async() =>{
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

export const getUserByUsernameAsync = async (username) => {
  return await DatabaseHandler.executeSingleQueryAsync(
    'SELECT * FROM "User" WHERE "Username" = $1 LIMIT 1',
    [username]
  );
};


