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