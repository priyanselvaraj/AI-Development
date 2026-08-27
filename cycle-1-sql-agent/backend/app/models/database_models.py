"""
Database Schema Definitions and Seed Data for University Academic Domain
"""

CREATE_TABLES_SQL = """
CREATE TABLE IF NOT EXISTS departments (
    department_id INTEGER PRIMARY KEY AUTOINCREMENT,
    department_name TEXT NOT NULL UNIQUE,
    building TEXT NOT NULL,
    budget REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS professors (
    professor_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    department_id INTEGER NOT NULL,
    salary REAL NOT NULL,
    hire_date TEXT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

CREATE TABLE IF NOT EXISTS students (
    student_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    major_id INTEGER NOT NULL,
    gpa REAL NOT NULL,
    enrollment_year INTEGER NOT NULL,
    FOREIGN KEY (major_id) REFERENCES departments(department_id)
);

CREATE TABLE IF NOT EXISTS courses (
    course_id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    department_id INTEGER NOT NULL,
    credits INTEGER NOT NULL,
    professor_id INTEGER NOT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(department_id),
    FOREIGN KEY (professor_id) REFERENCES professors(professor_id)
);

CREATE TABLE IF NOT EXISTS enrollments (
    enrollment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    semester TEXT NOT NULL,
    marks REAL NOT NULL,
    grade TEXT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);
"""

SEED_DATA_SQL = """
-- Departments
INSERT OR IGNORE INTO departments (department_id, department_name, building, budget) VALUES
(1, 'Computer Science', 'Turing Hall', 1200000.0),
(2, 'Electrical Engineering', 'Maxwell Hall', 950000.0),
(3, 'Mechanical Engineering', 'Newton Center', 850000.0),
(4, 'Mathematics', 'Euler Building', 600000.0),
(5, 'Data Science', 'Lovelace Complex', 1100000.0);

-- Professors
INSERT OR IGNORE INTO professors (professor_id, name, email, department_id, salary, hire_date) VALUES
(1, 'Dr. Alan Turing', 'alan.turing@univ.edu', 1, 145000.0, '2018-08-15'),
(2, 'Dr. Ada Lovelace', 'ada.lovelace@univ.edu', 1, 150000.0, '2017-01-10'),
(3, 'Dr. Claude Shannon', 'claude.shannon@univ.edu', 2, 140000.0, '2019-03-20'),
(4, 'Dr. Nikola Tesla', 'nikola.tesla@univ.edu', 2, 135000.0, '2020-07-01'),
(5, 'Dr. Isaac Newton', 'isaac.newton@univ.edu', 3, 138000.0, '2016-09-01'),
(6, 'Dr. Carl Gauss', 'carl.gauss@univ.edu', 4, 142000.0, '2015-11-15'),
(7, 'Dr. Geoffrey Hinton', 'geoffrey.hinton@univ.edu', 5, 160000.0, '2021-02-01');

-- Students
INSERT OR IGNORE INTO students (student_id, first_name, last_name, email, major_id, gpa, enrollment_year) VALUES
(1, 'Alice', 'Johnson', 'alice.j@univ.edu', 1, 3.85, 2022),
(2, 'Bob', 'Smith', 'bob.s@univ.edu', 1, 3.40, 2023),
(3, 'Charlie', 'Davis', 'charlie.d@univ.edu', 1, 3.92, 2021),
(4, 'Diana', 'Prince', 'diana.p@univ.edu', 2, 3.75, 2022),
(5, 'Ethan', 'Hunt', 'ethan.h@univ.edu', 2, 2.95, 2023),
(6, 'Fiona', 'Gallagher', 'fiona.g@univ.edu', 3, 3.60, 2022),
(7, 'George', 'Clark', 'george.c@univ.edu', 4, 3.98, 2021),
(8, 'Hannah', 'Abbott', 'hannah.a@univ.edu', 5, 3.88, 2023),
(9, 'Ian', 'Malcolm', 'ian.m@univ.edu', 5, 3.25, 2022),
(10, 'Julia', 'Roberts', 'julia.r@univ.edu', 1, 3.65, 2023),
(11, 'Kevin', 'Hart', 'kevin.h@univ.edu', 3, 3.10, 2024),
(12, 'Laura', 'Croft', 'laura.c@univ.edu', 5, 3.95, 2021);

-- Courses
INSERT OR IGNORE INTO courses (course_id, course_code, title, department_id, credits, professor_id) VALUES
(1, 'CS101', 'Intro to Computer Science', 1, 4, 1),
(2, 'CS201', 'Data Structures & Algorithms', 1, 4, 2),
(3, 'CS301', 'Artificial Intelligence', 1, 3, 1),
(4, 'EE101', 'Circuit Theory', 2, 4, 3),
(5, 'EE201', 'Digital Signal Processing', 2, 3, 4),
(6, 'ME101', 'Engineering Thermodynamics', 3, 4, 5),
(7, 'MATH201', 'Linear Algebra & Calculus', 4, 4, 6),
(8, 'DS101', 'Foundations of Data Science', 5, 3, 7),
(9, 'DS201', 'Applied Machine Learning', 5, 4, 7);

-- Enrollments & Grades
INSERT OR IGNORE INTO enrollments (enrollment_id, student_id, course_id, semester, marks, grade) VALUES
(1, 1, 1, 'Fall 2022', 92.5, 'A'),
(2, 1, 2, 'Spring 2023', 88.0, 'A-'),
(3, 1, 3, 'Fall 2023', 95.0, 'A+'),
(4, 2, 1, 'Fall 2023', 76.0, 'B'),
(5, 2, 2, 'Spring 2024', 82.5, 'B+'),
(6, 3, 1, 'Fall 2021', 98.0, 'A+'),
(7, 3, 2, 'Spring 2022', 94.0, 'A'),
(8, 3, 3, 'Fall 2022', 91.0, 'A'),
(9, 4, 4, 'Fall 2022', 89.0, 'A-'),
(10, 4, 5, 'Spring 2023', 85.0, 'B+'),
(11, 5, 4, 'Fall 2023', 68.0, 'C+'),
(12, 6, 6, 'Fall 2022', 87.5, 'B+'),
(13, 7, 7, 'Fall 2021', 99.0, 'A+'),
(14, 8, 8, 'Fall 2023', 93.0, 'A'),
(15, 8, 9, 'Spring 2024', 96.0, 'A+'),
(16, 9, 8, 'Fall 2022', 79.5, 'B'),
(17, 10, 1, 'Fall 2023', 84.0, 'B+'),
(18, 10, 3, 'Spring 2024', 89.5, 'A-'),
(19, 12, 8, 'Fall 2021', 97.0, 'A+'),
(20, 12, 9, 'Spring 2022', 95.5, 'A+');
"""
