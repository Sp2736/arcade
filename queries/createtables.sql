CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    
    -- Auth Details
    full_name VARCHAR(255) NOT NULL,
    college_email VARCHAR(255) UNIQUE NOT NULL,
    personal_email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    
    -- Identification
    college_id VARCHAR(50) UNIQUE NOT NULL, -- e.g., "24DCS088"
    role VARCHAR(20) CHECK (role IN ('student', 'faculty', 'admin')) NOT NULL,
    department VARCHAR(100) NOT NULL,       -- e.g., "Computer Engineering"
    
    -- Profile Fields (New)
    bio TEXT,
    phone_number VARCHAR(20),
    profile_picture VARCHAR(500),           -- URL to S3/Cloudinary
    
    -- Student Specific
    target_role VARCHAR(100),               -- e.g., "Frontend Developer"
    
    -- Faculty Specific
    designation VARCHAR(100),               -- e.g., "Assistant Professor"
    cabin_location VARCHAR(50),
    is_hod BOOLEAN DEFAULT FALSE,           -- Critical for Resume Approval workflow
    
    -- Security & Locks
    last_login TIMESTAMP,
    last_profile_update TIMESTAMP,          -- For the 24hr edit lock
    last_role_update TIMESTAMP,             -- For the 7-day role change lock
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE, -- Who receives it
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) CHECK (type IN ('info', 'success', 'warning', 'error')) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Standard Catalog of Subjects
CREATE TABLE subjects (
    subject_id SERIAL PRIMARY KEY,
    subject_name VARCHAR(255) NOT NULL,     -- e.g., "Operating Systems"
    subject_code VARCHAR(20) UNIQUE,        -- e.g., "CS402"
    semester VARCHAR(20) NOT NULL,          -- e.g., "Semester 4"
    department VARCHAR(100) NOT NULL
);

-- Linking Faculty to Subjects (The Toggle System)
CREATE TABLE faculty_teaching_load (
    load_id SERIAL PRIMARY KEY,
    faculty_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    subject_id INT REFERENCES subjects(subject_id) ON DELETE CASCADE,
    
    -- The specific toggles from your UI
    is_theory BOOLEAN DEFAULT FALSE,
    is_practical BOOLEAN DEFAULT FALSE,
    
    UNIQUE(faculty_id, subject_id) -- Prevent duplicate assignments
);

CREATE TABLE notes (
    note_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Metadata
    subject_id INT REFERENCES subjects(subject_id), -- Links to subject
    semester VARCHAR(20),                           -- Redundant but fast for filtering
    file_path VARCHAR(500) NOT NULL,                -- URL to file storage
    
    -- Ownership & Approval
    uploaded_by INT REFERENCES users(user_id) ON DELETE SET NULL,
    verified_by INT REFERENCES users(user_id) ON DELETE SET NULL, -- HOD/Faculty ID
    
    -- Status Workflow
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    
    -- Stats
    download_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE resume_samples (
    resume_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,            -- e.g., "Google STEP Intern Format"
    
    -- Classification (Matches ResumeResourcesView.tsx)
    domain VARCHAR(100) NOT NULL,           -- e.g., "Software Engineering"
    experience_level VARCHAR(50) CHECK (experience_level IN ('intern', 'fresher', 'experienced', 'advanced')),
    
    file_path VARCHAR(500) NOT NULL,
    uploaded_by INT REFERENCES users(user_id) ON DELETE SET NULL,
    
    -- HOD Verification Workflow
    status VARCHAR(20) DEFAULT 'pending_hod' CHECK (status IN ('pending_hod', 'approved', 'rejected')),
    rejection_reason TEXT,
    
    download_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE student_progress (
    progress_id SERIAL PRIMARY KEY,
    student_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    
    -- Stores the user's current goal
    target_role VARCHAR(100), 
    
    -- Stores the list of completed skill IDs/Names as a JSON array
    -- Example: ["HTML5", "React", "Docker"]
    completed_nodes JSONB DEFAULT '[]', 
    
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, target_role) -- One active progress record per role per student
);

CREATE TABLE audit_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    action VARCHAR(255) NOT NULL,           -- e.g., "APPROVED_RESUME", "CHANGED_ROLE"
    details JSONB,                          -- Extra data (e.g., which resume ID)
    ip_address VARCHAR(45),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);