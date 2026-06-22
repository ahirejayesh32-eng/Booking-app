# Appointment Booking System

A full-stack appointment booking application with real-time conflict prevention, built with React and Node.js. Features a premium editorial UI and PostgreSQL-backed data integrity.

## Features

- Browse available appointment slots for a doctor/resource
- Book a slot by entering your name and email
- Conflict prevention at the database level — if two users try to book the same slot simultaneously, the database uniquely rejects the second request (PostgreSQL UNIQUE constraint, error code 23505)
- Booked slots instantly update to "Taken" across all connected clients after booking
- Premium editorial design with Playfair Display and Jost typography

## Tech stack

**Frontend:** React, Axios
**Backend:** Node.js, Express
**Database:** PostgreSQL (via pg driver)
**Design:** Google Fonts (Playfair Display + Jost), inline styles

## How conflict prevention works

Rather than checking "is this slot free?" in application code (which has a race condition flaw), the `bookings` table has a `UNIQUE (slot_id)` constraint. This means PostgreSQL itself physically rejects any attempt to insert two bookings for the same slot, even if two requests arrive at exactly the same millisecond. The backend catches the `23505` unique violation error code and returns a friendly message to the user instead of crashing.

## Running it locally

**1. Set up PostgreSQL and create the database:**