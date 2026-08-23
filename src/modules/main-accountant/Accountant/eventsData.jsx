// Seed data for the Events module — school events, ceremonies and activities.
export const eventThemes = [
  { key: "purple", bg: "#4d0011", emoji: "🏆", label: "Sports / Academic" },
  { key: "pink", bg: "#d4537e", emoji: "🎨", label: "Art / Craft" },
  { key: "blue", bg: "#2a78d6", emoji: "📚", label: "Academic / Exhibition" },
  { key: "teal", bg: "#0f6e56", emoji: "🎭", label: "Cultural / Drama" },
  { key: "amber", bg: "#c07a12", emoji: "🎤", label: "Cultural / Speech" },
  { key: "green", bg: "#3b6d11", emoji: "🎓", label: "Ceremony / Graduation" },
];

export const eventStatuses = ["Scheduled", "Upcoming", "Planning"];

export let schoolEvents = [
  {
    id: "EV-1",
    title: "Annual Sports Day",
    date: "2026-07-15",
    dateLabel: "15 Jul 2026",
    status: "Scheduled",
    location: "School Ground",
    theme: eventThemes[0],
  },
  {
    id: "EV-2",
    title: "Art & Craft Exhibition",
    date: "2026-07-18",
    dateLabel: "18 Jul 2026",
    status: "Upcoming",
    location: "Main Hall",
    theme: eventThemes[1],
  },
  {
    id: "EV-3",
    title: "Science Exhibition",
    date: "2026-07-22",
    dateLabel: "22 Jul 2026",
    status: "Planning",
    location: "Science Block",
    theme: eventThemes[2],
  },
  {
    id: "EV-4",
    title: "Cultural Fest",
    date: "2026-07-28",
    dateLabel: "28 Jul 2026",
    status: "Upcoming",
    location: "Auditorium",
    theme: eventThemes[3],
  },
  {
    id: "EV-5",
    title: "Parent-Teacher Meeting",
    date: "2026-08-02",
    dateLabel: "2 Aug 2026",
    status: "Scheduled",
    location: "Classrooms",
    theme: eventThemes[4],
  },
  {
    id: "EV-6",
    title: "Annual Day Ceremony",
    date: "2026-08-20",
    dateLabel: "20 Aug 2026",
    status: "Planning",
    location: "School Auditorium",
    theme: eventThemes[5],
  },
];
