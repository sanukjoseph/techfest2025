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
    description TEXT, -- Increased size
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
    attendee_id VARCHAR(6),
    payment_id VARCHAR(255),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE -- Foreign key to events
);

-- Disable RLS for the attendees table
ALTER TABLE public.attendees DISABLE ROW LEVEL SECURITY;

-- Disable RLS for the storage.objects table
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
