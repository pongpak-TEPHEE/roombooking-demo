-- Room Booking schema (structure only, no data)
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

CREATE TABLE public."Booking" (
    booking_id character varying NOT NULL,
    room_id character varying NOT NULL,
    user_id character varying,
    purpose character varying,
    date date,
    start_time time without time zone,
    end_time time without time zone,
    status character varying,
    approved_by character varying,
    cancel_reason character varying,
    additional_notes character varying
);

CREATE TABLE public."BookingScope" (
    opening_mins time without time zone,
    closing_mins time without time zone,
    max_duration_hours integer,
    max_advance_days integer,
    date_create date NOT NULL,
    min_advance_hours integer
);

CREATE TABLE public."Equipment" (
    equipment_id character varying NOT NULL,
    room_id character varying NOT NULL,
    computer integer,
    microphone integer,
    type_of_computer character varying,
    whiteboard integer,
    projector integer
);

CREATE TABLE public."OTP" (
    request_id character varying NOT NULL,
    email character varying,
    otp_code character varying,
    expired_at timestamp with time zone,
    created_at timestamp with time zone
);

CREATE TABLE public."Rooms" (
    room_id character varying NOT NULL,
    room_type character varying,
    capacity integer,
    location character varying,
    room_characteristics character varying,
    repair boolean,
    is_active boolean
);

CREATE TABLE public."Schedules" (
    schedule_id character varying NOT NULL,
    room_id character varying NOT NULL,
    subject_name character varying,
    teacher_name character varying,
    start_time time without time zone,
    end_time time without time zone,
    date date,
    temporarily_closed boolean,
    user_id character varying,
    teacher_surname character varying,
    sec character varying,
    closed_reason character varying,
    course_code character varying
);

CREATE TABLE public."Terms" (
    id character varying NOT NULL,
    academic_year character varying,
    status character varying,
    term character varying,
    start_date date,
    end_date date
);

CREATE TABLE public."TokenBlacklist" (
    token text NOT NULL,
    expires_at timestamp without time zone NOT NULL
);

CREATE TABLE public."Users" (
    user_id character varying(20) NOT NULL,
    title character varying(10),
    name character varying(50),
    surname character varying(50),
    role character varying(20),
    email character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_verified boolean,
    is_active boolean,
    session_id character varying(20)
);

ALTER TABLE ONLY public."BookingScope"
    ADD CONSTRAINT "BookingScope_pkey" PRIMARY KEY (date_create);

ALTER TABLE ONLY public."Terms"
    ADD CONSTRAINT "Terms_pkey" PRIMARY KEY (id);

ALTER TABLE ONLY public."TokenBlacklist"
    ADD CONSTRAINT "TokenBlacklist_pkey" PRIMARY KEY (token);

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT booking_pkey PRIMARY KEY (booking_id);

ALTER TABLE ONLY public."Equipment"
    ADD CONSTRAINT equipment_pkey PRIMARY KEY (equipment_id);

ALTER TABLE ONLY public."OTP"
    ADD CONSTRAINT otp_pkey PRIMARY KEY (request_id);

ALTER TABLE ONLY public."Rooms"
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (room_id);

ALTER TABLE ONLY public."Schedules"
    ADD CONSTRAINT schedules_pkey PRIMARY KEY (schedule_id);

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT booking_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public."Users"(user_id);

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT booking_room_id_fkey FOREIGN KEY (room_id) REFERENCES public."Rooms"(room_id);

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT booking_teacher_id_fkey FOREIGN KEY (user_id) REFERENCES public."Users"(user_id);

ALTER TABLE ONLY public."Equipment"
    ADD CONSTRAINT equipment_room_id_fkey FOREIGN KEY (room_id) REFERENCES public."Rooms"(room_id);

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT fk_approved FOREIGN KEY (approved_by) REFERENCES public."Users"(user_id) ON DELETE SET NULL;

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT fk_room_id FOREIGN KEY (room_id) REFERENCES public."Rooms"(room_id) ON DELETE SET NULL;

ALTER TABLE ONLY public."Schedules"
    ADD CONSTRAINT fk_room_id FOREIGN KEY (room_id) REFERENCES public."Rooms"(room_id) ON DELETE SET NULL;

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES public."Users"(user_id) ON DELETE SET NULL;

ALTER TABLE ONLY public."Schedules"
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES public."Users"(user_id) ON DELETE SET NULL;

ALTER TABLE ONLY public."Schedules"
    ADD CONSTRAINT schedules_room_id_fkey FOREIGN KEY (room_id) REFERENCES public."Rooms"(room_id);












