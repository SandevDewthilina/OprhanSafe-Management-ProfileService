import DatabaseHandler from "../lib/database/DatabaseHandler.js";
import { uploadSingleFileAsync } from "../lib/aws/index.js";
import { createChannel, publishMessage } from "../lib/rabbitmq/index.js";
import { ADMIN_SERVICE_BINDING_KEY } from "../config/index.js";

/**
 * get profile lists
 *
 */

export const getChildProfilesAsync = async (orphanageId) => {
  const results = await DatabaseHandler.executeSingleQueryAsync(
    `select "ChildProfile"."FullName", "ChildProfile"."DOB", "ChildProfile"."Gender", "ChildProfile"."DateOfAdmission", "Orphanage"."Name" AS "OrphanageName","ChildProfile"."Id" AS "ChildId" from "ChildProfile"
    INNER JOIN
      "Orphanage" ON "ChildProfile"."OrphanageId" = "Orphanage"."Id" WHERE "ChildProfile"."OrphanageId"=$1;`,
    [orphanageId]
  );
  return results;
};

export const viewChildProfilesForParentsAsync = async (userId) => {
  const results = await DatabaseHandler.executeSingleQueryAsync(
    `SELECT
      "ChildProfile"."FullName",
      "ChildProfile"."DOB",
      "ChildProfile"."Gender",
      "ChildProfile"."DateOfAdmission",
      "Orphanage"."Name" AS "OrphanageName",
      "ChildProfile"."Id",
	  a."State"
    FROM "ChildProfile"
	INNER JOIN "Orphanage" ON "ChildProfile"."OrphanageId" = "Orphanage"."Id"
  INNER JOIN "ParentChildMatchMapping" AS pc ON "ChildProfile"."Id"= pc."ChildProfileId"
	LEFT JOIN "ChildProfileRequest" AS cp ON cp."ChildProfileId" = "ChildProfile"."Id"
	LEFT JOIN "ApprovalLog" AS a ON cp."ApprovalId" = a."Id"
    WHERE pc."ParentId" = (SELECT "Id" FROM "Parent" AS p WHERE p."UserId" = $1 ) AND a."CreatedBy" = $1`,
    [userId]
  );
  return results;
};

export const getStaffProfileListAsync = async (orphanageId) => {
  const results = await DatabaseHandler.executeSingleQueryAsync(
    `select  "User"."Name" AS "UserName",
    "User"."Id" AS "UserId",
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
 "Role"."Name" IN ('systemAdministrator', 'orphanageManager','orphanageStaff') and "User"."OrphanageId"=$1;`,
    [orphanageId]
  );
  return results;
};

export const getSocialWorkerProfileListAsync = async (orphanageId) => {
  const results = await DatabaseHandler.executeSingleQueryAsync(
    `select  "User"."Name",
    "User"."Id" AS "workerId",
  "User"."Email",
  "User"."PhoneNumber",
  "User"."Gender",
"SocialWorker"."Organization"
FROM
"User"
INNER JOIN
"SocialWorker" ON "User"."Id" = "SocialWorker"."UserId" WHERE "User"."OrphanageId"=$1;`,
    [orphanageId]
  );
  return results;
};

export const getParentProfileListAsync = async (orphanageId) => {
  const results = await DatabaseHandler.executeSingleQueryAsync(
    `select  "NameOfFather",
    "UserId",
  "NameOfMother",
 "Parent"."Email",
 "User"."Name" as Name,
 "MobileOfFather",
"MobileOfMother",
"Parent"."Address"
FROM
"Parent"
INNER JOIN
"User" ON "User"."Id" = "Parent"."UserId" WHERE "User"."OrphanageId"=$1;`,
    [orphanageId]
  );
  return results;
};

/**
 * Create Profiles
 */

export const createChildProfileAsync = async (
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
  RegisteredBy,
  OrphanageId,
  files
) => {
  const result = await DatabaseHandler.executeSingleQueryAsync(
    `INSERT INTO "ChildProfile" (
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
    "RegisteredBy",
    "OrphanageId"
) VALUES ($1, $2,$3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *;`,
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
      RegisteredBy,
      OrphanageId,
    ]
  );
  for (const fieldName in files) {
    const file = files[fieldName][0];
    await uploadSingleFileAsync(
      `childFiles/${result[0].Id}/${fieldName}/`,
      file
    );
  }
  return result;
};

export const createStaffProfileAsync = async (Id, files) => {
  for (const fieldName in files) {
    const file = files[fieldName][0];
    await uploadSingleFileAsync(`staffFiles/${Id}/${fieldName}/`, file);
  }
};

export const createUserRolesAsync = async (UserId, RoleId) => {
  await DatabaseHandler.executeSingleQueryAsync(
    `INSERT INTO "UserRole" ("UserId", "RoleId") VALUES ($1, $2)`,
    [UserId, RoleId]
  );
};

export const createSocialWorkerProfileAsync = async (
  Category,
  Organization,
  Role,
  Experience,
  UserId,
  files
) => {
  const result = await DatabaseHandler.executeSingleQueryAsync(
    `INSERT INTO "SocialWorker" ("Category", "Organization", "Role", "Experience", "UserId")
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;`,
    [Category, Organization, Role, Experience, UserId]
  );
  for (const fieldName in files) {
    const file = files[fieldName][0];
    await uploadSingleFileAsync(
      `socialWorkerFiles/${result[0].Id}/${fieldName}/`,
      file
    );
  }
};

export const createParentProfileAsync = async (
  NameOfFather,
  NICOfFather,
  MobileOfFather,
  DOBOfFather,
  OccupationOfFather,
  NameOfMother,
  NICOfMother,
  MobileOfMother,
  DOBOfMother,
  OccupationOfMother,
  Address,
  Email,
  AdoptionPreference,
  AgePreference,
  GenderPreference,
  NationalityPreference,
  LanguagePreference,
  UserId,
  files
) => {
  const result = await DatabaseHandler.executeSingleQueryAsync(
    `INSERT INTO "Parent" (
    "NameOfFather",
    "NICOfFather",
    "MobileOfFather",
    "DOBOfFather",
    "OccupationOfFather",
    "NameOfMother",
    "NICOfMother",
    "MobileOfMother",
    "DOBOfMother",
    "OccupationOfMother",
    "Address",
    "Email",
    "AdoptionPreference",
    "AgePreference",
    "GenderPreference",
    "NationalityPreference",
    "LanguagePreference",
    "UserId"
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
  ) RETURNING * ;`,
    [
      NameOfFather,
      NICOfFather,
      MobileOfFather,
      DOBOfFather,
      OccupationOfFather,
      NameOfMother,
      NICOfMother,
      MobileOfMother,
      DOBOfMother,
      OccupationOfMother,
      Address,
      Email,
      AdoptionPreference,
      AgePreference,
      GenderPreference,
      NationalityPreference,
      LanguagePreference,
      UserId,
    ]
  );
  for (const fieldName in files) {
    const file = files[fieldName][0];
    await uploadSingleFileAsync(
      `parentFiles/${result[0].UserId}/${fieldName}/`,
      file
    );
  }

  publishMessage(await createChannel(), ADMIN_SERVICE_BINDING_KEY, {
    event: "MATCHPARENTCHILD",
    data: {
      parentId: result[0].Id,
    },
  });
};

/**
 * Delete Profiles
 */

export const CreateProfileVersionAsync = async (
  childProfileId,
  profileData,
  commitMessage,
  committedByUserId
) => {
  await DatabaseHandler.executeSingleQueryAsync(
    `
  INSERT INTO "ProfileVersion" ("ChildProfileId", "ProfileData", "CommitMessage", "CommittedBy")
  VALUES ($1, $2, $3, $4)
`,
    [childProfileId, profileData, commitMessage, committedByUserId]
  );
};

export const deleteChildProfileAsync = async (Id) => {
  await DatabaseHandler.executeSingleQueryAsync(
    'DELETE FROM "ChildProfile" WHERE "Id"= $1 RETURNING *',
    [Id]
  );
};

export const deleteStaffProfileAsync = async (userIdToDelete) => {
  await DatabaseHandler.executeSingleQueryAsync(
    `DELETE FROM "UserRole" WHERE "UserId" = $1`,
    [userIdToDelete]
  );
  await DatabaseHandler.executeSingleQueryAsync(
    'DELETE FROM "User" WHERE "Id" = $1',
    [userIdToDelete]
  );
};

export const deleteSocialWorkerProfileAsync = async (userIdToDelete) => {
  await DatabaseHandler.executeSingleQueryAsync(
    `DELETE FROM "UserRole" WHERE "UserId" = $1`,
    [userIdToDelete]
  );
  await DatabaseHandler.executeSingleQueryAsync(
    `DELETE FROM "SocialWorker" WHERE "UserId" = $1`,
    [userIdToDelete]
  );
  await DatabaseHandler.executeSingleQueryAsync(
    `DELETE FROM "User" WHERE "Id" = $1`,
    [userIdToDelete]
  );
};

export const deleteParentProfileAsync = async (userIdToDelete) => {
  await DatabaseHandler.executeSingleQueryAsync(
    `DELETE FROM "UserRole" WHERE "UserId" = $1`,
    [userIdToDelete]
  );
  await DatabaseHandler.executeSingleQueryAsync(
    `DELETE FROM "Parent" WHERE "UserId" = $1`,
    [userIdToDelete]
  );
  await DatabaseHandler.executeSingleQueryAsync(
    `DELETE FROM "User" WHERE "Id" = $1`,
    [userIdToDelete]
  );
};

/**
 * Edit Profiles
 */

export const editChildProfileAsync = async (
  Id,
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
  OrphanageId,
  files
) => {
  await DatabaseHandler.executeSingleQueryAsync(
    `UPDATE "ChildProfile"
  SET
    "FullName"=$1,
    "DOB" = $2,
    "Gender" = $3,
    "DateOfAdmission" = $4,
    "Country" = $5,
    "City" = $6,
    "Nationality" = $7,
    "Language" = $8,
    "Remark" = $9,
    "MedicalDesc" = $10,
    "BirthFather" = $11,
    "BirthMother" = $12,
    "ReasonForPlacement" = $13,
    "OrphanageId" = $14
  WHERE
    "Id" = $15`,
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
      OrphanageId,
      Id,
    ]
  );
  for (const fieldName in files) {
    const file = files[fieldName][0];
    await uploadSingleFileAsync(`childFiles/${Id}/${fieldName}/`, file);
  }
};

export const editStaffProfileAsync = async (files, Id) => {
  for (const fieldName in files) {
    const file = files[fieldName][0];
    await uploadSingleFileAsync(`staffFiles/${Id}/${fieldName}/`, file);
  }
};

export const editSocialWorkerProfileAsync = async (
  Category,
  Organization,
  Role,
  Experience,
  UserId,
  files
) => {
  await DatabaseHandler.executeSingleQueryAsync(
    `UPDATE "SocialWorker"
  SET
    "Category" = $1,
    "Organization" = $2,
    "Role" = $3,
    "Experience" = $4
  WHERE
    "UserId" = $5`,
    [Category, Organization, Role, Experience, UserId]
  );

  for (const fieldName in files) {
    const file = files[fieldName][0];
    await uploadSingleFileAsync(
      `socialWorkerFiles/${UserId}/${fieldName}/`,
      file
    );
  }
};

export const editParentProfileAsync = async (
  NameOfFather,
  NICOfFather,
  MobileOfFather,
  DOBOfFather,
  OccupationOfFather,
  NameOfMother,
  NICOfMother,
  MobileOfMother,
  DOBOfMother,
  OccupationOfMother,
  Address,
  Email,
  AdoptionPreference,
  AgePreference,
  GenderPreference,
  NationalityPreference,
  LanguagePreference,
  UserId,
  files
) => {
  await DatabaseHandler.executeSingleQueryAsync(
    `
  UPDATE "Parent"
      SET
        "NameOfFather" = $1,
        "NICOfFather" = $2,
        "MobileOfFather" = $3,
        "DOBOfFather" = $4,
        "OccupationOfFather" = $5,
        "NameOfMother" = $6,
        "NICOfMother" = $7,
        "MobileOfMother" = $8,
        "DOBOfMother" = $9,
        "OccupationOfMother" = $10,
        "Address" = $11,
        "Email" = $12,
        "AdoptionPreference" = $13,
        "AgePreference" = $14,
        "GenderPreference" = $15,
        "NationalityPreference" = $16,
        "LanguagePreference" = $17
      WHERE
        "UserId" = $18`,
    [
      NameOfFather,
      NICOfFather,
      MobileOfFather,
      DOBOfFather,
      OccupationOfFather,
      NameOfMother,
      NICOfMother,
      MobileOfMother,
      DOBOfMother,
      OccupationOfMother,
      Address,
      Email,
      AdoptionPreference,
      AgePreference,
      GenderPreference,
      NationalityPreference,
      LanguagePreference,
      UserId,
    ]
  );
  for (const fieldName in files) {
    const file = files[fieldName][0];
    await uploadSingleFileAsync(
      `socialWorkerFiles/${UserId}/${fieldName}/`,
      file
    );
  }
};

/**
 * View profiles by managers
 */

export const viewChildProfilesAsync = async (childId) => {
  const results = await DatabaseHandler.executeSingleQueryAsync(
    `  SELECT
  "FullName",
  "DOB",
  "Gender",
  "DateOfAdmission",
  "Country",
  "ChildProfile"."City",
  "Nationality",
  "Language",
  "Remark",
  "MedicalDesc",
  "BirthFather",
  "BirthMother",
  "ReasonForPlacement",
  "Orphanage"."Name" AS "OrphanageName"
FROM
  "ChildProfile"
INNER JOIN
  "Orphanage" ON "ChildProfile"."OrphanageId" = "Orphanage"."Id"
WHERE
  "ChildProfile"."Id" = $1;`,
    [childId]
  );
  return results;
};

export const viewStaffProfileAsync = async (Id) => {
  const results = await DatabaseHandler.executeSingleQueryAsync(
    `select  "User"."Name" AS "UserName",
    "User"."Id" AS "UserId",
  "User"."Email",
  "User"."PhoneNumber",
  "User"."Gender",
  "User"."Address",
  "Orphanage"."Name" AS "OrphanageName",
  "User"."NIC",
  "User"."DOB",
"Role"."Name" AS "RoleName"
FROM
"User"
INNER JOIN
"UserRole" ON "User"."Id" = "UserRole"."UserId"
INNER JOIN
"Role" ON "UserRole"."RoleId" = "Role"."Id"
INNER JOIN
  "Orphanage" ON "User"."OrphanageId" = "Orphanage"."Id"
WHERE
"User"."Id" = $1`,
    [Id]
  );
  return results;
};

export const viewSocialWorkerProfileAsync = async (Id) => {
  const results = await DatabaseHandler.executeSingleQueryAsync(
    `select  "User"."Name",
    "User"."Id" as "WorkerId",
   "User"."Email",
   "User"."PhoneNumber",
   "User"."Gender",
   "User"."Address",
   "User"."NIC",
   "User"."DOB",
 "SocialWorker"."Organization",
 "SocialWorker"."Category",
 "SocialWorker"."Role",
 "SocialWorker"."Experience",
 "Orphanage"."Name" AS "OrphanageName"
 FROM
 "User"
 INNER JOIN
 "SocialWorker" ON "User"."Id" = "SocialWorker"."UserId"
 INNER JOIN
  "Orphanage" ON "User"."OrphanageId" = "Orphanage"."Id"
 WHERE "User"."Id" =$1;`,
    [Id]
  );
  return results;
};

export const viewParentProfileAsync = async (Id) => {
  const results = await DatabaseHandler.executeSingleQueryAsync(
    `select
    "NameOfFather",
     "NICOfFather",
     "MobileOfFather",
     "DOBOfFather",
     "OccupationOfFather",
      "NameOfMother",
    "DOBOfMother",
     "OccupationOfMother",
    "MobileOfMother",
     "Parent"."Email",
    "Parent"."Address",
    "AdoptionPreference",
    "AgePreference",
    "GenderPreference",
    "NationalityPreference",
    "LanguagePreference",
     "Orphanage"."Name" AS "OrphanageName"
    FROM
    "Parent"
    INNER JOIN
    "User" ON "User"."Id" = "Parent"."UserId"
    INNER JOIN
     "Orphanage" ON "User"."OrphanageId" = "Orphanage"."Id"
    WHERE "UserId" = $1;`,
    [Id]
  );
  return results;
};

/**
 * External party view child profiles
 */

export const viewChildInfoExternalAsync = async (childId) => {
  const results = await DatabaseHandler.executeSingleQueryAsync(
    `SELECT
  "FullName",
  "DOB",
  "Gender",
  "Country",
  "Nationality",
  "Language",
  "Remark",
  "BirthFather",
  "BirthMother",
  "ReasonForPlacement",
  "Orphanage"."Name" AS "OrphanageName"
FROM
  "ChildProfile"
INNER JOIN
  "Orphanage" ON "ChildProfile"."OrphanageId" = "Orphanage"."Id"
WHERE
  "ChildProfile"."Id" = $1;`,
    [childId]
  );
  return results;
};

/**
 * Profile count
 */

// manager dashboard child profile count
export const getChildProfileCountAsync = async (OrphanageId) => {
  // orphanage wise
  return await DatabaseHandler.executeSingleQueryAsync(
    `SELECT COUNT(*)
  FROM "ChildProfile" WHERE
 "OrphanageId" = $1;
  `,
    [OrphanageId]
  );
};

// manager dashboard staff profile count
export const getStaffCountAsync = async (OrphanageId) => {
  // orphanage wise
  return await DatabaseHandler.executeSingleQueryAsync(
    `SELECT COUNT(*)
  FROM "User" 
  INNER JOIN
  "UserRole" ON "User"."Id" = "UserRole"."UserId"
  INNER JOIN
  "Role" ON "UserRole"."RoleId" = "Role"."Id"
  WHERE
   "Role"."Name" IN ('admin', 'systemManager','orphanageStaff') and "User"."OrphanageId"= $1;`,
    [OrphanageId]
  );
};

// admin dashboard child profile count
export const getChildProfileCountAdminAsync = async () => {
  return await DatabaseHandler.executeSingleQueryAsync(
    'SELECT COUNT(*) FROM "ChildProfile"',
    []
  );
};

// admin dashboard staff profile count
export const getStaffCountStaffAsync = async () => {
  return await DatabaseHandler.executeSingleQueryAsync(
    `SELECT COUNT(*)
  FROM "User" 
  INNER JOIN
  "UserRole" ON "User"."Id" = "UserRole"."UserId"
  INNER JOIN
  "Role" ON "UserRole"."RoleId" = "Role"."Id"
  WHERE
   "Role"."Name" IN ('admin', 'systemManager','orphanageStaff');`,
    []
  );
};

//total number of Orphanages
export const getOrphanageCountAsync = async () => {
  return await DatabaseHandler.executeSingleQueryAsync(
    ` SELECT COUNT(*)
  FROM "Orphanage";`,
    []
  );
};

// get the user by email
export const getUserByEmailAsync = async (email) => {
  return await DatabaseHandler.executeSingleQueryAsync(
    'SELECT "Id" FROM "User" WHERE "Email" = $1 LIMIT 1',
    [email]
  );
};

//get all details of a child profile

export const getChildProfileAllDetailsAsync = async (childId) => {
  const results = await DatabaseHandler.executeSingleQueryAsync(
    `SELECT * FROM "ChildProfile" WHERE "Id" = $1;`,
    [childId]
  );
  return results;
};

// get child profile list by orphanage
export const getChildProfileNameListByOrphanageIdAsync = async (
  orphanageId
) => {
  const result = await DatabaseHandler.executeSingleQueryAsync(
    `SELECT "Id", "FullName" FROM "ChildProfile" WHERE "OrphanageId"=$1`,
    [orphanageId]
  );
  return result;
};

export const getSocialWorkerNameListByOrphanageIdAsync = async (
  orphanageId
) => {
  const result = await DatabaseHandler.executeSingleQueryAsync(
    `SELECT 
      sw."Role",
      u."Name",
      sw."Id"
    FROM
      "SocialWorker" AS sw
    INNER JOIN
      "User" AS u
    ON u."OrphanageId"= $1
    WHERE
      sw."UserId" = u."Id" `,
    [orphanageId]
  );
  return result;
};

export const getProfileVersionAsync = async () => {
  const results = await DatabaseHandler.executeSingleQueryAsync(
    `select * from "ProfileVersion";`,
    []
  );
  return results;
};

// get role Id
export const getStaffRoleIdAsync = async () => {
  return await DatabaseHandler.executeSingleQueryAsync(
    `select "Id" from "Role" where "Name"= 'orphanageStaff';`,
    []
  );
};

export const getSocialWorkerRoleIdAsync = async () => {
  return await DatabaseHandler.executeSingleQueryAsync(
    `select "Id" from "Role" where "Name"='socialWorker';`,
    []
  );
};

export const getParentRoleIdAsync = async () => {
  return await DatabaseHandler.executeSingleQueryAsync(
    `select "Id" from "Role" where "Name"='parent';`,
    []
  );
};

export const getManagerRoleIdAsync = async () => {
  return await DatabaseHandler.executeSingleQueryAsync(
    `select "Id" from "Role" where "Name"='orphanageManager';`,
    []
  );
};

// get orphanage Id
export const getOrphanageIdAsync = async (orphanageName) => {
  return await DatabaseHandler.executeSingleQueryAsync(
    `select "Id" from "Orphanage" where "Name"=$1;`,
    [orphanageName]
  );
};

// get user Id
export const getUserIdAsync = async (RegisteredBy) => {
  return await DatabaseHandler.executeSingleQueryAsync(
    `SELECT "Id" FROM "User" WHERE "Name" = $1 LIMIT 1;`,
    [RegisteredBy]
  );
};

// insert an inquiry
export const createInquiryAsync = async (CreatedBy, Subject, Description) => {
  return await DatabaseHandler.executeSingleQueryAsync(
    `INSERT INTO "Inquiries"("CreatedBy", "Subject", "Description")
    VALUES($1, $2, $3)
    RETURNING *;`,
    [CreatedBy, Subject, Description]
  );
};

// get list of inquires
export const getInquiryListAsync = async () => {
  return await DatabaseHandler.executeSingleQueryAsync(
    `select "User"."Name","Inquiries"."Id","CreatedBy","Subject","Description" from "Inquiries" 
    inner join "User" on "Inquiries"."CreatedBy"="User"."Id";`,
    []
  );
};

// create Child Profile Delete Request
export const childProfileDeleteRequestAsync = async (
  ApprovalId,
  ChildId,
  Remark
) => {
  return await DatabaseHandler.executeSingleQueryAsync(
    ` INSERT INTO public."ChildProfileDeleteRequest" ("ApprovalId", "ChildProfileId", "Remark")
    VALUES ($1, $2, $3)
    RETURNING "Id";`,
    [ApprovalId, ChildId, Remark]
  );
};

// create  a fund
export const createFundAsync = async (
  Name,
  Email,
  Mobile,
  TransactionAmount,
  ApprovalLogId,
  Description
) => {
  return await DatabaseHandler.executeSingleQueryAsync(
    ` INSERT INTO public."Funding" ("Name", "Email", "Mobile", "TransactionAmount", "ApprovalLogId", "Description")
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING "Id";`,
    [Name, Email, Mobile, TransactionAmount, ApprovalLogId, Description]
  );
};

// approval log
export const createApprovalLogAsync = async (State, ReviewedBy, CreatedBy) => {
  return await DatabaseHandler.executeSingleQueryAsync(
    `INSERT INTO "ApprovalLog" ("State", "ReviewedBy", "CreatedBy")
    VALUES ($1, $2, $3)
    RETURNING "Id";`,
    [State, ReviewedBy, CreatedBy]
  );
};

export const getProfileCountForOrphanageAsync = async (orphanageId) => {
  return await DatabaseHandler.executeSingleQueryAsync(
    `SELECT
      COUNT(c."Id")
    FROM "ChildProfile" AS c
    WHERE c."OrphanageId" = $1`,
    [orphanageId]
  );
};

export const getStaffCountForOrphanageAsync = async (orphanageId) => {
  return await DatabaseHandler.executeSingleQueryAsync(
    `SELECT
      COUNT(u."Id")
    FROM "User" AS u
    INNER JOIN "UserRole" AS ur ON u."Id" = ur."UserId"
    WHERE u."OrphanageId" = $1
      AND (ur."RoleId" = (SELECT "Id" FROM "Role" WHERE "Name" = 'orphanageManager')
        OR ur."RoleId"=(SELECT "Id" FROM "Role" WHERE "Name"='orphanageStaff'))`,
    [orphanageId]
  );
};

export const getParentCountForOrphanageAsync = async (orphanageId) => {
  return await DatabaseHandler.executeSingleQueryAsync(
    `SELECT
      COUNT(u."Id")
    FROM "User" AS u
    INNER JOIN "UserRole" AS ur ON u."Id" = ur."UserId"
    WHERE u."OrphanageId" = $1
      AND ur."RoleId" = (SELECT "Id" FROM "Role" WHERE "Name" = 'parent')
        `,
    [orphanageId]
  );
};
