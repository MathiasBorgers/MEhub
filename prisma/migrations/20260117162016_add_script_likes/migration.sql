-- CreateTable
CREATE TABLE "ScriptLike" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "scriptId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScriptLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScriptLike_id_key" ON "ScriptLike"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ScriptLike_userId_scriptId_key" ON "ScriptLike"("userId", "scriptId");

-- AddForeignKey
ALTER TABLE "ScriptLike" ADD CONSTRAINT "ScriptLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScriptLike" ADD CONSTRAINT "ScriptLike_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "Script"("id") ON DELETE CASCADE ON UPDATE CASCADE;
