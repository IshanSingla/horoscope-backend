-- CreateTable
CREATE TABLE `auths` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `accessToken` VARCHAR(191) NOT NULL,
    `createdAt` DATE NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `updatedAt` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contacts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATE NOT NULL,
    `dob` DATE NOT NULL,
    `gender` VARCHAR(191) NULL,
    `last_fetched` DATETIME(3) NULL,
    `mobile_number` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `series_number` INTEGER NOT NULL,
    `updatedAt` DATE NOT NULL,
    `whatsapp_number` VARCHAR(191) NOT NULL,
    `pob_description` VARCHAR(191) NULL,
    `pob_latitude` DOUBLE NULL,
    `pob_longitude` DOUBLE NULL,

    UNIQUE INDEX `mobile_number_1`(`mobile_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ivrs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `agent_duration` VARCHAR(191) NULL,
    `agent_name` VARCHAR(191) NULL,
    `agent_number` VARCHAR(191) NULL,
    `circle` VARCHAR(191) NULL,
    `createdAt` DATE NOT NULL,
    `extension` VARCHAR(191) NULL,
    `from` VARCHAR(191) NULL,
    `operator` VARCHAR(191) NULL,
    `recording` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL,
    `time` VARCHAR(191) NULL,
    `to` VARCHAR(191) NULL,
    `total_duration` VARCHAR(191) NULL,
    `uniqueid` VARCHAR(191) NULL,
    `unix` VARCHAR(191) NULL,
    `updatedAt` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
