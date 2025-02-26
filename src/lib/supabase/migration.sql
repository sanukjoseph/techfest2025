DO $$
BEGIN
    -- Check if column coordinator_emails exists, drop it and add coordinator_email as TEXT
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'coordinator_emails') THEN
        ALTER TABLE public.events DROP COLUMN coordinator_emails;
    END IF;
    
    -- Add new column coordinator_email as TEXT
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'coordinator_email') THEN
        ALTER TABLE public.events ADD COLUMN coordinator_email TEXT;
    END IF;
END $$;