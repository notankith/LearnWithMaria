-- Users table for authentication
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'instructor', 'admin')),
  profile_photo_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  instructor_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  category TEXT NOT NULL CHECK (category IN ('IELTS', 'OET', 'TOEFL', 'General English')),
  level TEXT NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  thumbnail_url TEXT,
  price DECIMAL(10, 2),
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Course modules/lessons
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'text', 'interactive')),
  content_url TEXT,
  order_index INTEGER NOT NULL,
  duration_minutes INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student enrollments
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  progress_percentage INTEGER DEFAULT 0,
  completed_at TIMESTAMP,
  UNIQUE(student_id, course_id)
);

-- Test types: Speaking, Writing, Reading, Listening
CREATE TABLE tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  test_type TEXT NOT NULL CHECK (test_type IN ('Speaking', 'Writing', 'Reading', 'Listening')),
  total_questions INTEGER,
  duration_minutes INTEGER,
  passing_score INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Test attempts by students
CREATE TABLE test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  submitted_at TIMESTAMP,
  score INTEGER,
  status TEXT NOT NULL CHECK (status IN ('in_progress', 'submitted', 'graded')),
  feedback TEXT
);

-- Speaking responses (for speaking tests)
CREATE TABLE speaking_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES test_attempts(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  audio_url TEXT,
  duration_seconds INTEGER,
  transcription TEXT,
  score INTEGER,
  feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Writing submissions
CREATE TABLE writing_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES test_attempts(id) ON DELETE CASCADE,
  task_number INTEGER NOT NULL,
  prompt TEXT NOT NULL,
  submission_text TEXT,
  word_count INTEGER,
  score INTEGER,
  feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reading test responses
CREATE TABLE reading_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES test_attempts(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  answer TEXT,
  is_correct BOOLEAN,
  score INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Listening test responses
CREATE TABLE listening_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES test_attempts(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  answer TEXT,
  is_correct BOOLEAN,
  score INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student progress tracking
CREATE TABLE student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,
  completed_at TIMESTAMP,
  time_spent_minutes INTEGER DEFAULT 0,
  UNIQUE(student_id, course_id, lesson_id)
);

-- Enable RLS for security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE speaking_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE writing_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE listening_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can read their own profile
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Instructors can update their own profile
CREATE POLICY "Instructors can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Anyone can view published courses
CREATE POLICY "Anyone can view published courses" ON courses
  FOR SELECT USING (is_published = TRUE OR instructor_id = auth.uid());

-- Instructors can manage their own courses
CREATE POLICY "Instructors can manage own courses" ON courses
  FOR ALL USING (instructor_id = auth.uid());

-- Students can view enrolled course lessons
CREATE POLICY "Students can view lessons of enrolled courses" ON lessons
  FOR SELECT USING (
    course_id IN (
      SELECT course_id FROM enrollments WHERE student_id = auth.uid()
    ) OR EXISTS (
      SELECT 1 FROM courses WHERE courses.id = lessons.course_id AND courses.instructor_id = auth.uid()
    )
  );

-- Students can only see their own enrollments
CREATE POLICY "Students can view their own enrollments" ON enrollments
  FOR SELECT USING (student_id = auth.uid());

-- Students can enroll in courses
CREATE POLICY "Students can enroll in courses" ON enrollments
  FOR INSERT WITH CHECK (student_id = auth.uid());

-- Students can only see their own test attempts
CREATE POLICY "Students can view their own test attempts" ON test_attempts
  FOR SELECT USING (student_id = auth.uid());

-- Students can submit test attempts
CREATE POLICY "Students can submit test attempts" ON test_attempts
  FOR INSERT WITH CHECK (student_id = auth.uid());

-- Students can only see their own responses
CREATE POLICY "Students can view their own responses" ON speaking_responses
  FOR SELECT USING (
    attempt_id IN (
      SELECT id FROM test_attempts WHERE student_id = auth.uid()
    )
  );

CREATE POLICY "Students can insert their own responses" ON speaking_responses
  FOR INSERT WITH CHECK (
    attempt_id IN (
      SELECT id FROM test_attempts WHERE student_id = auth.uid()
    )
  );

-- Similar policies for writing, reading, listening responses
CREATE POLICY "Students can view their own writing submissions" ON writing_submissions
  FOR SELECT USING (
    attempt_id IN (
      SELECT id FROM test_attempts WHERE student_id = auth.uid()
    )
  );

CREATE POLICY "Students can insert their own writing submissions" ON writing_submissions
  FOR INSERT WITH CHECK (
    attempt_id IN (
      SELECT id FROM test_attempts WHERE student_id = auth.uid()
    )
  );

CREATE POLICY "Students can view their own reading responses" ON reading_responses
  FOR SELECT USING (
    attempt_id IN (
      SELECT id FROM test_attempts WHERE student_id = auth.uid()
    )
  );

CREATE POLICY "Students can insert their own reading responses" ON reading_responses
  FOR INSERT WITH CHECK (
    attempt_id IN (
      SELECT id FROM test_attempts WHERE student_id = auth.uid()
    )
  );

CREATE POLICY "Students can view their own listening responses" ON listening_responses
  FOR SELECT USING (
    attempt_id IN (
      SELECT id FROM test_attempts WHERE student_id = auth.uid()
    )
  );

CREATE POLICY "Students can insert their own listening responses" ON listening_responses
  FOR INSERT WITH CHECK (
    attempt_id IN (
      SELECT id FROM test_attempts WHERE student_id = auth.uid()
    )
  );

-- Progress tracking policies
CREATE POLICY "Students can view their own progress" ON student_progress
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Students can update their own progress" ON student_progress
  FOR ALL USING (student_id = auth.uid());
