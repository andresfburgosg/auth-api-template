-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobileCountryCode" INTEGER NOT NULL,
    "mobilePhoneNumber" INTEGER NOT NULL,
    "password" TEXT NOT NULL,
    "passwordChangedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resetPasswordToken" TEXT,
    "resetPasswordIssueAt" TIMESTAMP(3),
    "resetPasswordExpireAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userProfilePic" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "secureUrl" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "format" TEXT NOT NULL,
    "bytes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "userProfilePic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "userProfilePic_userId_key" ON "userProfilePic"("userId");

-- CreateIndex
CREATE INDEX "userProfilePic_userId_idx" ON "userProfilePic"("userId");

-- AddForeignKey
ALTER TABLE "userProfilePic" ADD CONSTRAINT "userProfilePic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
