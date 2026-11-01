// Rebuilds the database with fictional sample data for the demo.
// Every date is relative to "today", so the demo always looks current.
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_PATH = path.join(__dirname, '..', 'database', 'schema.sql');

const TABLES = ['Booking', 'BookingScope', 'Equipment', 'OTP', 'Schedules', 'Terms', 'TokenBlacklist', 'Rooms', 'Users'];

const pad = (n) => String(n).padStart(2, '0');
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

const users = [
  // user_id, title, name, surname, role, email
  ['demo-staff', 'นาย', 'Demo', 'Staff', 'staff', 'demo.staff@ku.th'],
  ['demo-teacher', 'ดร.', 'Demo', 'Teacher', 'teacher', 'demo.teacher@ku.th'],
  ['t-001', 'ผศ.ดร.', 'Somchai', 'Jaidee', 'teacher', 'somchai.j@ku.th'],
  ['t-002', 'อ.', 'Suda', 'Rakdee', 'teacher', 'suda.r@ku.th'],
  ['t-003', 'ดร.', 'Anan', 'Meesuk', 'teacher', 'anan.m@ku.th'],
  ['s-001', 'นางสาว', 'Malee', 'Srisuk', 'staff', 'malee.s@ku.th'],
];

const rooms = [
  // room_id, type, capacity, location, characteristics, repair, is_active, equipment
  ['LAB-101', 'Computer lab', 50, 'Building A, 1st floor', 'Computer lab for programming classes and workshops', false, true,
    { computer: 50, microphone: 2, type_of_computer: 'PC', whiteboard: 1, projector: 2 }],
  ['LAB-102', 'Computer lab', 45, 'Building A, 1st floor', 'VDI lab for data science and cloud courses', false, true,
    { computer: 45, microphone: 1, type_of_computer: 'VDI', whiteboard: 1, projector: 1 }],
  ['LAB-201', 'Computer lab', 40, 'Building A, 2nd floor', 'Network and systems lab', false, true,
    { computer: 40, microphone: 1, type_of_computer: 'PC', whiteboard: 1, projector: 1 }],
  ['LEC-301', 'Lecture room', 120, 'Building B, 3rd floor', 'Large lecture hall with sound system', false, true,
    { computer: 1, microphone: 4, type_of_computer: '-', whiteboard: 2, projector: 2 }],
  ['LEC-302', 'Lecture room', 60, 'Building B, 3rd floor', 'Medium lecture room', false, true,
    { computer: 1, microphone: 2, type_of_computer: '-', whiteboard: 1, projector: 1 }],
  ['MTG-401', 'Meeting room', 15, 'Building B, 4th floor', 'Meeting room for project discussions', true, true,
    { computer: 0, microphone: 1, type_of_computer: '-', whiteboard: 1, projector: 1 }],
];

// Weekly classes: room, course, subject, teacher id, weekday (0=Sun), start, end, sec
const classes = [
  ['LAB-101', 'CS-201', 'Data Structures', 't-001', 1, '09:00', '12:00', '1'],
  ['LAB-101', 'CS-305', 'Web Application Development', 'demo-teacher', 3, '13:00', '16:00', '1'],
  ['LAB-102', 'CS-342', 'Introduction to Data Science', 't-002', 2, '09:00', '12:00', '1'],
  ['LAB-102', 'CS-342', 'Introduction to Data Science', 't-002', 4, '13:00', '16:00', '2'],
  ['LAB-201', 'CS-321', 'Computer Networks', 't-003', 5, '09:00', '12:00', '1'],
  ['LEC-301', 'CS-101', 'Introduction to Computer Science', 't-001', 1, '13:00', '15:00', '1'],
  ['LEC-302', 'CS-410', 'Software Engineering', 'demo-teacher', 4, '09:00', '11:00', '1'],
];

const findUser = (id) => users.find((u) => u[0] === id);

export async function resetDemoData(pool) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const t of TABLES) {
      await client.query(`DROP TABLE IF EXISTS public."${t}" CASCADE`);
    }
    await client.query(fs.readFileSync(SCHEMA_PATH, 'utf8'));
    // schema.sql switches search_path off; switch it back for the inserts below.
    await client.query('SET search_path TO public');

    for (const u of users) {
      await client.query(
        `INSERT INTO "Users" (user_id, title, name, surname, role, email, is_verified, is_active)
         VALUES ($1,$2,$3,$4,$5,$6,true,true)`,
        u
      );
    }

    for (const [id, type, cap, loc, ch, repair, active, eq] of rooms) {
      await client.query(
        `INSERT INTO "Rooms" (room_id, room_type, capacity, location, room_characteristics, repair, is_active)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [id, type, cap, loc, ch, repair, active]
      );
      await client.query(
        `INSERT INTO "Equipment" (equipment_id, room_id, computer, microphone, type_of_computer, whiteboard, projector)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [`eq-${id}`, id, eq.computer, eq.microphone, eq.type_of_computer, eq.whiteboard, eq.projector]
      );
    }

    // Terms: the current one runs from 4 weeks ago to 12 weeks from now.
    const firstStart = addDays(today, -28);
    const firstEnd = addDays(today, 84);
    const terms = [
      ['summer', addDays(firstStart, -90), addDays(firstStart, -30)],
      ['first', firstStart, firstEnd],
      ['end', addDays(firstEnd, 30), addDays(firstEnd, 150)],
    ];
    const academicYear = String(terms[0][1].getFullYear());
    for (const [term, s, e] of terms) {
      await client.query(
        `INSERT INTO "Terms" (id, academic_year, status, term, start_date, end_date) VALUES ($1,$2,'active',$3,$4,$5)`,
        [crypto.randomUUID(), academicYear, term, ymd(s), ymd(e)]
      );
    }

    await client.query(
      `INSERT INTO "BookingScope" (opening_mins, closing_mins, max_duration_hours, max_advance_days, date_create, min_advance_hours)
       VALUES ('08:00','20:00',8,30,$1,1)`,
      [ymd(today)]
    );

    // Expand weekly classes over the current term.
    for (let d = new Date(firstStart); d <= firstEnd; d = addDays(d, 1)) {
      for (const [room, code, subject, tid, wd, st, et, sec] of classes) {
        if (d.getDay() !== wd) continue;
        const t = findUser(tid);
        await client.query(
          `INSERT INTO "Schedules" (schedule_id, room_id, course_code, subject_name, teacher_name, teacher_surname,
             start_time, end_time, date, temporarily_closed, user_id, sec)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,false,$10,$11)`,
          [crypto.randomUUID(), room, code, subject, t[2], t[3], st, et, ymd(d), tid, sec]
        );
      }
    }

    // Bookings in every state, on days without a clashing class.
    const bookings = [
      // room, user, purpose, dayOffset, start, end, status, approver, reason, notes
      ['LEC-301', 'demo-teacher', 'Guest lecture: Cloud-native backends', 2, '15:30', '17:30', 'pending', null, null, 'Need 2 wireless microphones'],
      ['LAB-201', 't-002', 'Python workshop for first-year students', 3, '13:00', '16:00', 'pending', null, null, null],
      ['LEC-302', 't-003', 'Thesis progress presentation', 5, '13:00', '15:00', 'pending', null, null, null],
      ['LAB-101', 'demo-teacher', 'Make-up class: Web Application Development', 1, '16:00', '18:00', 'approved', 'demo-staff', null, null],
      ['LAB-102', 't-001', 'Programming contest practice', 6, '17:00', '19:00', 'approved', 'demo-staff', null, null],
      ['LEC-302', 'demo-teacher', 'Department seminar', 8, '13:00', '16:00', 'approved', 's-001', null, 'Coffee break at 14:30'],
      ['LAB-201', 'demo-teacher', 'Lab exam preparation', 4, '17:00', '19:00', 'rejected', 'demo-staff', 'Room reserved for maintenance', null],
      ['LEC-301', 't-002', 'Club meeting', -3, '16:00', '18:00', 'completed', 'demo-staff', null, null],
      ['LAB-101', 'demo-teacher', 'Extra lab session', -6, '16:00', '18:00', 'completed', 'demo-staff', null, null],
      ['LAB-102', 'demo-teacher', 'Project consultation', -2, '17:00', '18:00', 'cancelled', null, 'Schedule changed', null],
    ];
    for (const [room, uid, purpose, off, st, et, status, approver, reason, notes] of bookings) {
      await client.query(
        `INSERT INTO "Booking" (booking_id, room_id, user_id, purpose, date, start_time, end_time, status, approved_by, cancel_reason, additional_notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [crypto.randomUUID(), room, uid, purpose, ymd(addDays(today, off)), st, et, status, approver, reason, notes]
      );
    }

    await client.query('COMMIT');
    console.log(`🌱 Demo data reset (${ymd(today)})`);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
