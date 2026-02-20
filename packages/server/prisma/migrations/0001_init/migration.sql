-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "displayName" TEXT,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "location" TEXT,
    "experienceLevel" TEXT,
    "climbingStyles" TEXT,
    "socialLinks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Peak" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "alternateNames" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "elevation" DOUBLE PRECISION NOT NULL,
    "prominence" DOUBLE PRECISION,
    "country" TEXT,
    "region" TEXT,
    "range" TEXT,
    "description" TEXT,
    "imageUrl" TEXT,
    "closestAirport" TEXT,
    "closestAirportDistance" TEXT,
    "permitRequired" BOOLEAN NOT NULL DEFAULT false,
    "permitInfo" TEXT,
    "bestMonths" TEXT,
    "osmId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'osm',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Peak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Route" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "peakId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "difficulty" TEXT,
    "gradeSystem" TEXT,
    "activityType" TEXT NOT NULL DEFAULT 'alpine',
    "description" TEXT,
    "summary" TEXT,
    "imageUrl" TEXT,
    "technicalGrade" TEXT,
    "commitment" TEXT,
    "distance" DOUBLE PRECISION,
    "elevationGain" DOUBLE PRECISION,
    "estimatedTime" DOUBLE PRECISION,
    "approachTime" DOUBLE PRECISION,
    "descentTime" DOUBLE PRECISION,
    "basecamp" TEXT,
    "season" TEXT,
    "hazards" TEXT,
    "safetyNotes" TEXT,
    "permitRequired" BOOLEAN NOT NULL DEFAULT false,
    "permitInfo" TEXT,
    "closestAirport" TEXT,
    "geoJson" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Waypoint" (
    "id" SERIAL NOT NULL,
    "routeId" INTEGER NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "elevation" DOUBLE PRECISION,
    "name" TEXT,
    "description" TEXT,
    "waypointType" TEXT NOT NULL DEFAULT 'waypoint',

    CONSTRAINT "Waypoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "routeId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "body" TEXT NOT NULL,
    "climbDate" TIMESTAMP(3),
    "conditions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tip" (
    "id" SERIAL NOT NULL,
    "routeId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GearRecommendation" (
    "id" SERIAL NOT NULL,
    "routeId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "itemName" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "isEssential" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "weight" TEXT,
    "priceRange" TEXT,
    "specificProduct" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GearRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GearLink" (
    "id" SERIAL NOT NULL,
    "gearId" INTEGER NOT NULL,
    "retailer" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "price" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GearLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClimbLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "peakId" INTEGER NOT NULL,
    "routeId" INTEGER,
    "date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "conditions" TEXT,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "duration" DOUBLE PRECISION,
    "photos" TEXT,
    "rating" INTEGER,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "elevationGain" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClimbLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedRoute" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "routeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedRoute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuideService" (
    "id" SERIAL NOT NULL,
    "peakId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "description" TEXT,
    "priceRange" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "location" TEXT,
    "specialties" TEXT,
    "logoUrl" TEXT,
    "rating" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuideService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFollow" (
    "id" SERIAL NOT NULL,
    "followerId" INTEGER NOT NULL,
    "followingId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserFollow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "climbLogId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Peak_osmId_key" ON "Peak"("osmId");

-- CreateIndex
CREATE INDEX "Peak_latitude_longitude_idx" ON "Peak"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "Peak_elevation_idx" ON "Peak"("elevation");

-- CreateIndex
CREATE INDEX "Peak_country_idx" ON "Peak"("country");

-- CreateIndex
CREATE INDEX "Peak_name_idx" ON "Peak"("name");

-- CreateIndex
CREATE INDEX "Route_peakId_idx" ON "Route"("peakId");

-- CreateIndex
CREATE INDEX "Route_authorId_idx" ON "Route"("authorId");

-- CreateIndex
CREATE INDEX "Route_activityType_idx" ON "Route"("activityType");

-- CreateIndex
CREATE INDEX "Waypoint_routeId_idx" ON "Waypoint"("routeId");

-- CreateIndex
CREATE UNIQUE INDEX "Waypoint_routeId_orderIndex_key" ON "Waypoint"("routeId", "orderIndex");

-- CreateIndex
CREATE INDEX "Review_routeId_idx" ON "Review"("routeId");

-- CreateIndex
CREATE INDEX "Review_authorId_idx" ON "Review"("authorId");

-- CreateIndex
CREATE INDEX "Tip_routeId_idx" ON "Tip"("routeId");

-- CreateIndex
CREATE INDEX "GearRecommendation_routeId_idx" ON "GearRecommendation"("routeId");

-- CreateIndex
CREATE INDEX "GearLink_gearId_idx" ON "GearLink"("gearId");

-- CreateIndex
CREATE INDEX "ClimbLog_userId_idx" ON "ClimbLog"("userId");

-- CreateIndex
CREATE INDEX "ClimbLog_peakId_idx" ON "ClimbLog"("peakId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedRoute_userId_routeId_key" ON "SavedRoute"("userId", "routeId");

-- CreateIndex
CREATE INDEX "GuideService_peakId_idx" ON "GuideService"("peakId");

-- CreateIndex
CREATE INDEX "UserFollow_followerId_idx" ON "UserFollow"("followerId");

-- CreateIndex
CREATE INDEX "UserFollow_followingId_idx" ON "UserFollow"("followingId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFollow_followerId_followingId_key" ON "UserFollow"("followerId", "followingId");

-- CreateIndex
CREATE INDEX "Comment_climbLogId_idx" ON "Comment"("climbLogId");

-- CreateIndex
CREATE INDEX "Comment_authorId_idx" ON "Comment"("authorId");

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_peakId_fkey" FOREIGN KEY ("peakId") REFERENCES "Peak"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Waypoint" ADD CONSTRAINT "Waypoint_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tip" ADD CONSTRAINT "Tip_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tip" ADD CONSTRAINT "Tip_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GearRecommendation" ADD CONSTRAINT "GearRecommendation_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GearRecommendation" ADD CONSTRAINT "GearRecommendation_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GearLink" ADD CONSTRAINT "GearLink_gearId_fkey" FOREIGN KEY ("gearId") REFERENCES "GearRecommendation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClimbLog" ADD CONSTRAINT "ClimbLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClimbLog" ADD CONSTRAINT "ClimbLog_peakId_fkey" FOREIGN KEY ("peakId") REFERENCES "Peak"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClimbLog" ADD CONSTRAINT "ClimbLog_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedRoute" ADD CONSTRAINT "SavedRoute_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedRoute" ADD CONSTRAINT "SavedRoute_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuideService" ADD CONSTRAINT "GuideService_peakId_fkey" FOREIGN KEY ("peakId") REFERENCES "Peak"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollow" ADD CONSTRAINT "UserFollow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollow" ADD CONSTRAINT "UserFollow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_climbLogId_fkey" FOREIGN KEY ("climbLogId") REFERENCES "ClimbLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

