-- CreateTable
CREATE TABLE `auths` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `accessToken` VARCHAR(191) NOT NULL,
    `createdAt` DATE NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contacts` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `dob` DATE NULL,
    `mobile_number` VARCHAR(191) NOT NULL,
    `whatsapp_number` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NULL,
    `series_number` INTEGER NOT NULL,
    `pob_description` VARCHAR(191) NULL,
    `pob_latitude` DOUBLE NULL,
    `pob_longitude` DOUBLE NULL,
    `last_fetched` DATE NULL,
    `createdAt` DATE NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATE NULL,

    UNIQUE INDEX `mobile_number_1`(`mobile_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ivrs` (
    `id` VARCHAR(191) NOT NULL,
    `from` VARCHAR(191) NULL,
    `agent_duration` VARCHAR(191) NULL,
    `agent_name` VARCHAR(191) NULL,
    `agent_number` VARCHAR(191) NULL,
    `circle` VARCHAR(191) NULL,
    `extension` VARCHAR(191) NULL,
    `operator` VARCHAR(191) NULL,
    `recording` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL,
    `time` VARCHAR(191) NULL,
    `to` VARCHAR(191) NULL,
    `total_duration` VARCHAR(191) NULL,
    `uniqueid` VARCHAR(191) NULL,
    `unix` VARCHAR(191) NULL,
    `createdAt` DATE NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
