-- CreateTable
CREATE TABLE "Decision" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "caseId" TEXT NOT NULL,
    "caseType" TEXT NOT NULL,
    "caseTitle" TEXT NOT NULL,
    "caseSummary" TEXT NOT NULL,
    "selectedEvidence" TEXT NOT NULL,
    "selectedWitness" TEXT,
    "objection" TEXT NOT NULL DEFAULT 'none',
    "juryVotesGuilty" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT NOT NULL DEFAULT '',
    "strength" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Decision_caseType_idx" ON "Decision"("caseType");

-- CreateIndex
CREATE INDEX "Decision_createdAt_idx" ON "Decision"("createdAt");
