ALTER TABLE "ChildProfile" ADD "OrphanageId" uuid NOT NULL default 'bb190a0d-046f-455f-a03b-9908c07dc2ff';
ALTER TABLE "ChildProfile"
ADD CONSTRAINT "FK_OrphanageId.Id"
FOREIGN KEY ("OrphanageId") REFERENCES "Orphanage"("Id");

CREATE TABLE "ProfileVersion" (
  "ChildProfileId" uuid PRIMARY KEY,
  "ProfileData" varchar(2000) NOT NULL,
  "CommitMessage" varchar(225) NOT NULL,
  "CommittedAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "CommittedBy" uuid NOT NULL,
  CONSTRAINT "FK_ProfileVersion.CommittedBy"
    FOREIGN KEY ("CommittedBy")
      REFERENCES "User"("Id") ON DELETE CASCADE
);
