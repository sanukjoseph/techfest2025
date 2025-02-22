-- Enable the pgvector extension (if needed)
CREATE EXTENSION IF NOT EXISTS vector;

-- Table: profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    username VARCHAR(150),
    full_name VARCHAR(255),
    avatar_url TEXT,
    email VARCHAR(255) NOT NULL
);

-- Disable RLS for the profiles table
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Table: events
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name VARCHAR(100),
    description TEXT,
    price NUMERIC,
    event_limit INTEGER,
    image_url TEXT,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_type VARCHAR(50) DEFAULT 'single', -- single, group, reward1, reward2, no_reward
    category VARCHAR(50) DEFAULT 'technical', -- technical, non-technical
    format VARCHAR(50) DEFAULT 'competition', -- workshop, competition
    num_winners INTEGER DEFAULT 0, -- Number of winners for competition
    min_group_size INTEGER DEFAULT 1,
    max_group_size INTEGER DEFAULT 5
);

-- Disable RLS for the events table
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;

-- Table: attendees
CREATE TABLE IF NOT EXISTS public.attendees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    full_name VARCHAR(255),
    college_name VARCHAR(255),
    department VARCHAR(255),
    email VARCHAR(255),
    phone_no VARCHAR(20),
    school_id VARCHAR(255),
    university_reg_no VARCHAR(255),
    attendee_id VARCHAR(3),
    general_pass BOOLEAN DEFAULT TRUE,
    group_member_ids TEXT,
    winning_position INTEGER,
    payment_id VARCHAR(255),
    event_ids UUID[] -- Array of event IDs
);

-- Disable RLS for the attendees table
ALTER TABLE public.attendees DISABLE ROW LEVEL SECURITY;

-- Disable RLS for the storage.objects table
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Create the General Pass event if it doesn't exist
INSERT INTO public.events (name, description, price, event_limit, image_url, user_id, event_type, category, format, num_winners, min_group_size, max_group_size)
SELECT 'General Pass', 'A free pass for general access to the tech fest.', 0, 1000, '/globe.svg', (SELECT id FROM public.profiles LIMIT 1), 'single', 'non-technical', 'workshop', 0, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM public.events WHERE name = 'General Pass');

-- Remove the event_id column from the attendees table
-- ALTER TABLE public.attendees DROP COLUMN IF EXISTS event_id; -- Remove this line

-- Drop the attendee_events table if it exists
DROP TABLE IF EXISTS public.attendee_events;
