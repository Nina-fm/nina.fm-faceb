-- CreateTable
CREATE TABLE "TagOnMixtape" (
    "tagId" TEXT NOT NULL,
    "mixtapeId" TEXT NOT NULL,

    CONSTRAINT "TagOnMixtape_pkey" PRIMARY KEY ("tagId","mixtapeId")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- AddForeignKey
ALTER TABLE "TagOnMixtape" ADD CONSTRAINT "TagOnMixtape_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagOnMixtape" ADD CONSTRAINT "TagOnMixtape_mixtapeId_fkey" FOREIGN KEY ("mixtapeId") REFERENCES "Mixtape"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
