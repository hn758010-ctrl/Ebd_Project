# StudySpot

**Course:** Electronic Business Development (BINF 503) · Winter 2026
**Instructor:** Dr. Nourhan Hamdi
**Teaching Assistants:** Mr. Nour Gaser, Mr. Omar Alaa, Ms. Mariam Khalid, Mr. Younes Zied, Mr. Mahmoud Hani

## 1. Team

| Name | Student ID | Tutorial group | GitHub username |
|---|---|---|---|
| Kevin Amgad | 16002266 | T7 | kevinamgad | 
| Haneen Nafea | 16001689 | T8 | hn758010-ctrl |
| Aly Farouk | 16002325 | T8 | alyzayed2006-web |
| Youssef Mossad | 16006264 | T7 | youssefmmossad-cmd |
| Judy Ehab | 16001422| T8 | judyyehabb |
| Ahmed Mohammed | 16001346| T7 | | meedo-giu|

## 2. The idea

StudySpot is a web application for booking study rooms at the university. It is for students who need a quiet room for group work, project meetings or presentation practice, and for the staff who look after those rooms. Today students walk from building to building looking for a free room, two groups often arrive for the same room at the same time, and broken equipment is reported by word of mouth, if at all. With StudySpot a student sees every room with its size, equipment and reviews, sees which times are already taken, and books a free time slot in a few clicks. The system never lets two bookings for the same room overlap. Students can reschedule or cancel a booking, report a problem in a room, and review rooms they have used, while an admin manages the rooms and resolves the reported problems.

## 3. Features

### 3.1 The full product

- Register and log in with a university email; students and admins have different roles
- Browse study rooms and filter them by building and group size
- See a room's details: building, floor, capacity, equipment, description and reviews
- See which times are already booked in a room on a chosen day
- Book a room for a date and time, with no overlapping bookings for the same room or the same student
- Reschedule or cancel a booking before it starts
- Report a problem in a room (equipment, cleanliness, furniture, air conditioning)
- Rate and review a room after booking it
- Admin: add, edit, close and delete rooms
- Admin: see every reported problem and resolve it with a note to the student
- Admin: remove inappropriate reviews
- Email or push reminders before a booking starts (not built in this course)
- Check in with a QR code at the room door; bookings with no check-in after 15 minutes are released (not built in this course)
- Invite group members to a booking so it appears in their calendars too (not built in this course)
- Recurring weekly bookings for a semester (not built in this course)
- Waiting list that notifies a student when a taken slot is cancelled (not built in this course)
- Floor maps that show where each room is (not built in this course)
- Usage statistics for admins: busiest rooms and hours (not built in this course)
- Log in with the university's single sign-on (not built in this course)

### 3.2 The use cases we will build

| # | Use case | What the user does | What they see | What is stored |
|---|---|---|---|---|
| 1 | Registration and login | Registers with name, email and password; logs in with email and password; logs out | Their home page, with their name in the header and links to their bookings and reports. A wrong password shows an error | A User, with the password hashed with bcrypt and the role `student` |
| 2 | Manage study rooms (admin) | The admin adds a room (name, building, floor, capacity, equipment, description), edits it, closes it for booking, or deletes it | The list of all rooms with their status (Open or Closed), updated after each change | A Room is created, updated or deleted. Deleting a room also deletes its bookings, reports and reviews |
| 3 | Book a study room | The student opens the rooms list, filters by building or group size, chooses a room, picks a date, a start and end time, the number of people and a purpose, and books | The times already taken on that day; after booking, their bookings page with a confirmation. A clash, a time in the past, more than 3 hours, or more people than the room fits shows an error | A Booking with the user, room, date, start time, end time, number of people and purpose |
| 4 | Manage my bookings | The student opens My bookings, reschedules an upcoming booking (new date, times or number of people) or cancels it | Their upcoming and past bookings; after a change, the updated list with a confirmation. A new time that clashes shows an error | The Booking is updated with the new date and times, or deleted when cancelled |
| 5 | Report a room issue | The student opens a room, chooses "Report a problem", picks a category and describes it; they can withdraw it while it is open. The admin marks a report as resolved with a note | The student sees their reports with the status (Open or Resolved) and the admin's note. The admin sees all reports, open ones first, with who reported them | An Issue with the user, room, category, description and status `open`; the admin's change updates the status to `resolved` and saves the note |
| 6 | Review a room | On a room's page, a student who has booked that room gives it 1 to 5 stars and a comment; they can edit or delete their own review | The room's reviews with each student's name, and the average rating; their own review has Edit and Delete buttons | A Review with the user, room, rating and comment; one review per student per room |

## 4. Who owns what

| Member | Use case |
|---|---|
| Aly Farouk | 1. Registration and login |
| Judy Ehab | 2. Manage study rooms (admin) |
| Haneen Nafea | 3. Book a study room |
| Kevin Amgad  | 4. Manage my bookings |
| Ahmed Mohammed  | 5. Report a room issue |
| Youssef Mossad | 6. Review a room |

## 5. Data model

### User

```js
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // stored hashed with bcrypt, never as plain text
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
  },
  { timestamps: true }
);
```

### Room

```js
const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true }, // e.g. "B2.104"
    building: { type: String, required: true, trim: true },           // e.g. "Building B"
    floor: { type: Number, required: true },
    capacity: { type: Number, required: true, min: 1 },
    equipment: [{ type: String, trim: true }],                        // e.g. ["Whiteboard", "Screen"]
    description: { type: String, default: '' },
    isAvailable: { type: Boolean, default: true },                    // admin can close a room for booking
  },
  { timestamps: true }
);
```

### Booking

```js
const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    date: { type: String, required: true },      // "YYYY-MM-DD"
    startTime: { type: String, required: true }, // "HH:MM", 24-hour
    endTime: { type: String, required: true },   // "HH:MM", 24-hour
    attendees: { type: Number, required: true, min: 1 },
    purpose: { type: String, default: '' },      // e.g. "BINF 503 project meeting"
  },
  { timestamps: true }
);
```

### Issue

```js
const issueSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    category: {
      type: String,
      enum: ['Equipment', 'Cleanliness', 'Furniture', 'Air conditioning', 'Other'],
      required: true,
    },
    description: { type: String, required: true },
    status: { type: String, enum: ['open', 'resolved'], default: 'open' },
    adminNote: { type: String, default: '' }, // written by the admin when resolving
  },
  { timestamps: true }
);
```

### Review

```js
const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
  },
  { timestamps: true }
);

// One review per user per room
reviewSchema.index({ user: 1, room: 1 }, { unique: true });
```

## 6. Run it locally

> Leave this section as it is until Submission 2 (Thursday 10 December 2026,
> 23:59). Then fill it in: we follow these steps to run your project.

### Back end

```bash
cd backend
npm install
# create backend/.env from backend/.env.example (see the table below)
npm start
```

The API runs on http://localhost:3000.

| Variable in `.env` | What it is |
|---|---|
| `MONGODB_URI` | The connection string of your MongoDB Atlas database |
| `JWT_SECRET` | Any long random text, used to sign login tokens |
| [Any other variable] | [What it is] |

### Front end

```bash
cd frontend
npm install
npm run dev
```

The app runs on [the address `npm run dev` prints, e.g. http://localhost:5173].
