-- Enable the pgvector extension (if needed)
CREATE EXTENSION IF NOT EXISTS vector;

-- Table: profiles (unchanged)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    username VARCHAR(150),
    full_name VARCHAR(255),
    avatar_url TEXT,
    email VARCHAR(255) NOT NULL
);

ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Table: events (unchanged)
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name VARCHAR(100),
    description TEXT,
    price NUMERIC,
    event_limit INTEGER,
    image_url TEXT,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_type VARCHAR(50) DEFAULT 'single',
    category VARCHAR(50) DEFAULT 'technical',
    format VARCHAR(50) DEFAULT 'competition',
    min_group_size INTEGER DEFAULT 1,
    max_group_size INTEGER DEFAULT 5,
    registration_count INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE
);

ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;

-- Table: attendees (updated)
CREATE TABLE IF NOT EXISTS public.attendees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    full_name VARCHAR(255),
    college_name VARCHAR(255),
    department VARCHAR(255),
    email VARCHAR(255),
    phone_no VARCHAR(20),
    attendee_id VARCHAR(6),
    payment_id VARCHAR(255),
    payment_status VARCHAR(50) DEFAULT 'pending',
    paid_event_count INTEGER DEFAULT 0
);

-- Add paid_event_count column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'attendees' AND column_name = 'paid_event_count') THEN
        ALTER TABLE public.attendees ADD COLUMN paid_event_count INTEGER DEFAULT 0;
    END IF;
END $$;

ALTER TABLE public.attendees DISABLE ROW LEVEL SECURITY;

-- Table: attendee_events (new)
CREATE TABLE IF NOT EXISTS public.attendee_events (
    attendee_id UUID NOT NULL REFERENCES public.attendees(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    PRIMARY KEY (attendee_id, event_id)
);

ALTER TABLE public.attendee_events DISABLE ROW LEVEL SECURITY;

-- Function: create_attendees_transaction (unchanged)
CREATE OR REPLACE FUNCTION create_attendees_transaction()
RETURNS void AS $$
BEGIN
    -- Start a new advisory transaction lock
    PERFORM pg_advisory_xact_lock(1);
END;
$$ LANGUAGE plpgsql;

-- Function: commit_transaction (unchanged)
CREATE OR REPLACE FUNCTION commit_transaction()
RETURNS void AS $$
BEGIN
    -- Simply return, as explicit COMMIT is not allowed
    RETURN;
END;
$$ LANGUAGE plpgsql;

-- Function: rollback_transaction (unchanged)
CREATE OR REPLACE FUNCTION rollback_transaction()
RETURNS void AS $$
BEGIN
    -- Raise an exception to trigger rollback
    RAISE EXCEPTION 'Transaction rollback triggered';
END;
$$ LANGUAGE plpgsql;

-- Function: update_all_events_registration_count (new)
CREATE OR REPLACE FUNCTION update_all_events_registration_count()
RETURNS void AS $$
DECLARE
    event_record RECORD;
BEGIN
    FOR event_record IN SELECT id FROM public.events LOOP
        UPDATE public.events
        SET registration_count = (
            SELECT count(*)
            FROM public.attendee_events
            WHERE event_id = event_record.id
        )
        WHERE id = event_record.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function: sync_event_registration_counts (new)
CREATE OR REPLACE FUNCTION sync_event_registration_counts()
RETURNS void AS $$
BEGIN
  PERFORM update_all_events_registration_count();
END;
$$ LANGUAGE plpgsql;

-- Function: migrate_old_registrations (updated)
CREATE OR REPLACE FUNCTION migrate_old_registrations()
RETURNS void AS $$
BEGIN
    -- Check if event_id column exists in attendees table
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'attendees' AND column_name = 'event_id') THEN
        -- Migrate old registrations to attendee_events table if event_id is not null
        INSERT INTO public.attendee_events (attendee_id, event_id)
        SELECT id, event_id
        FROM public.attendees
        WHERE event_id IS NOT NULL;

        -- Remove the event_id column from attendees table
        ALTER TABLE public.attendees DROP COLUMN IF EXISTS event_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Update paid_event_count for existing attendees
UPDATE public.attendees
SET paid_event_count = (
    SELECT COUNT(*)
    FROM public.attendee_events ae
    JOIN public.events e ON ae.event_id = e.id
    WHERE ae.attendee_id = attendees.id AND e.price > 0
);

-- Update event registration counts
SELECT update_all_events_registration_count();

-- Migrate old registrations
SELECT migrate_old_registrations();
