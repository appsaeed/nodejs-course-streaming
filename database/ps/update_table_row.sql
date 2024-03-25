ALTER TABLE tutors
ALTER COLUMN "password" TYPE TEXT;

-- set default value
ALTER TABLE content
ALTER COLUMN "password" TYPE TEXT,
ALTER COLUMN "password" SET DEFAULT NULL,
ALTER COLUMN "password" DROP NOT NULL;

