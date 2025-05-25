-- CreateTable
CREATE TABLE "DjOnMixtape" (
    "djId" TEXT NOT NULL,
    "mixtapeId" TEXT NOT NULL,
    "position" INTEGER,

    CONSTRAINT "DjOnMixtape_pkey" PRIMARY KEY ("djId","mixtapeId")
);

-- AddForeignKey
ALTER TABLE "DjOnMixtape" ADD CONSTRAINT "DjOnMixtape_djId_fkey" FOREIGN KEY ("djId") REFERENCES "Dj"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DjOnMixtape" ADD CONSTRAINT "DjOnMixtape_mixtapeId_fkey" FOREIGN KEY ("mixtapeId") REFERENCES "Mixtape"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
