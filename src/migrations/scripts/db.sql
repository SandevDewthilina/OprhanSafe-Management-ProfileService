CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE "ChildProfile" (
  "Id" uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  "FirstName" varchar(225) NOT NULL,
  "MiddleNames" varchar(225),
  "LastName" varchar(225),
  "DateOfBirth" date NOT NULL,
  "Gender" varchar(20) NOT NULL,
  "DateOfAdmission" date NOT NULL,
  "DateOfEntry" date NOT NULL,
  "Country" varchar(25) NOT NULL,
  "City" varchar(225) NOT NULL,
  "GuardianInfo" varchar(225),
  "GuardianId" UUID NOT NULL,
  CONSTRAINT "FK_ChildProfile.GuardianId"
    FOREIGN KEY ("GuardianId")
      REFERENCES "User"("Id") ON DELETE CASCADE
);


INSERT INTO "Role" (
"Name") VALUES (
'staff'::character varying)
 returning "Id";

INSERT INTO "ChildProfile" ("FirstName", "MiddleNames", "LastName","DateOfBirth","Gender","DateOfAdmission","DateOfEntry","Country","City","GuardianInfo","GuardianId") VALUES ('Kamal','Sahan','Perera','2016-06-22 19:10:25-07','Male','Jan-08-1999','Jan-08-1999','Srilanka','Kalutara','Teacher','072d6328-ed13-4dbd-9c7f-7fc702037780');
SELECT * FROM "ChildProfile";

INSERT INTO "UserRole" ("UserId", "RoleId")VALUES('072d6328-ed13-4dbd-9c7f-7fc702037780','2968d631-591b-4265-b374-747e19848ddc');


  SELECT
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
    "GuardianInfo",
    "GuardianId"
FROM
    "ChildProfile"
WHERE
    "Id" = '892be416-9383-421b-98d3-abcdeabd3d59';


select * from "User";
select * from "ChildProfile";
INSERT INTO "ChildProfile" ("FullName", "DOB","Gender","DateOfAdmission","Country","City","Nationality","Language","Remark","MedicalDesc","BirthFather","BirthMother","ReasonForPlacement","RegisteredBy"
) VALUES ('Kamal Perera','2023-09-24 10:00:00','Male','Jan-08-1999','Srilanka','Kalutara','Sri lankan','Sinhala','remarks...', 'medical','piyal pushpakumara','kamala perera','reason','c9e3b830-5a62-468b-8936-c4d9b8c1268d');

INSERT INTO "ChildProfile" (
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
    
) VALUES (
    'John Doe',                 -- Replace with the full name
    '2023-09-24 10:00:00',      -- Replace with the date of birth (timestamp)
    'Male',                     -- Replace with the gender
    '2023-09-24',               -- Replace with the date of admission (date)
    'United States',            -- Replace with the country
    'New York',                 -- Replace with the city
    'American',                 -- Replace with the nationality
    'English',                  -- Replace with the language
    'Some remark',              -- Replace with the remark
    'Medical description',      -- Replace with the medical description
    'Johns Father',            -- Replace with the birth father
    'Janes Mother',            -- Replace with the birth mother
    'Reason for placement',     -- Replace with the reason for placement
    'c9e3b830-5a62-468b-8936-c4d9b8c1268d'       
   
);

  select  "User"."Name",
    "User"."Email",
    "User"."PhoneNumber",
    "User"."Gender"
FROM
  "User"
INNER JOIN
  "UserRole" ON "User"."Id" = "UserRole"."UserId"
INNER JOIN
  "Role" ON "UserRole"."RoleId" = "Role"."Id"
WHERE
   "Role"."Name" IN ('admin', 'systemManger','orphanageStaff');