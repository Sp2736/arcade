CREATE TABLE "USER" (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    personal_email VARCHAR(100) UNIQUE NOT NULL,
    college_email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role SMALLINT NOT NULL DEFAULT 1 CHECK (role IN (0,1,2,3)), -- 0=Admin, 1=Student, 2=Faculty, 3=HOD
    department VARCHAR(3) CHECK (department IN ('CS', 'CE', 'IT')),
    college_id VARCHAR(50), 
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
    profile_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

CREATE TABLE SUBJECT (
    subject_id SERIAL PRIMARY KEY,
    subject_name VARCHAR(100) NOT NULL,
    subject_code VARCHAR(8) UNIQUE NOT NULL,
    semester INT,
    department VARCHAR(3) CHECK (department IN ('CS', 'CE', 'IT','--')),
    subject_head_id INT REFERENCES "USER"(user_id) ON DELETE SET NULL
);

CREATE TABLE SUBJECT_ALLOTMENT (
    allotment_id SERIAL PRIMARY KEY,
    subject_id INT REFERENCES SUBJECT(subject_id) ON DELETE CASCADE,
    teaching_mode VARCHAR(11) CHECK (teaching_mode IN ('CLASSROOM', 'MOOC')),
    mooc_platform VARCHAR(30),
    faculty_user_id INT REFERENCES "USER"(user_id) ON DELETE SET NULL,
    department VARCHAR(3) CHECK (department IN ('CS', 'CE', 'IT','--')),
    section_or_class INT DEFAULT 0
);

CREATE TABLE NOTES (
    note_id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    subject_id INT REFERENCES SUBJECT(subject_id) ON DELETE CASCADE,
    uploaded_by_user_id INT REFERENCES "USER"(user_id),
    file_path TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    approved_by_user_id INT REFERENCES "USER"(user_id),
    visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'subject-only')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ROADMAP (
    roadmap_id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    goal_type VARCHAR(100),
    suggested_by_user_id INT REFERENCES "USER"(user_id),
    steps JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE STUDENT_SKILLS (
    record_id SERIAL PRIMARY KEY,
    student_user_id INT REFERENCES "USER"(user_id) ON DELETE CASCADE,
    selected_skills JSONB NOT NULL,
    completion_status VARCHAR(50),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ROLE_REQUIREMENTS (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL,
    mandatory_skills JSONB,
    advanced_skills JSONB,
    optional_skills JSONB,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE RESUME_SAMPLES (
    resume_id SERIAL PRIMARY KEY,
    domain VARCHAR(100),
    experience_level VARCHAR(20) CHECK (experience_level IN ('intern', 'fresher', 'experienced')),
    file_path TEXT NOT NULL,
    uploaded_by_user_id INT REFERENCES "USER"(user_id),
    reference TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE RESOURCES (
    resource_id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    subject_or_concept VARCHAR(100),
    link TEXT NOT NULL,
    description TEXT,
    approved_by_user_id INT REFERENCES "USER"(user_id)
);

CREATE TABLE AUDIT_LOG (
    log_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "USER"(user_id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);