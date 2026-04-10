-- CreateTable
CREATE TABLE "GroupMemberSchedule" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scheduleUrl" TEXT NOT NULL,

    CONSTRAINT "GroupMemberSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GroupMemberSchedule_groupId_idx" ON "GroupMemberSchedule"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupMemberSchedule_groupId_name_key" ON "GroupMemberSchedule"("groupId", "name");
