import { collection, doc, setDoc, addDoc, deleteDoc, onSnapshot, updateDoc, increment, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export interface EventSpeaker {
  name: string;
  role: string;
  image?: string;
  uid?: string;
}

export interface AgendaItem {
  time: string;
  topic: string;
  presenter: string;
}

export interface FirmEvent {
  id: string;
  title: string;
  category: "Keynote & Summit" | "CLE & Workshop" | "Symposium" | "Community & Pro Bono" | "Special Lecture";
  date: string; // YYYY-MM-DD
  displayDate: string;
  time: string;
  location: string;
  isVirtual: boolean;
  featured: boolean;
  image: string;
  description: string;
  fullDetails: string;
  cpdCredits: string;
  speakers: EventSpeaker[];
  capacity: number;
  registeredCount: number;
  agenda: AgendaItem[];
  status: "Upcoming" | "Live Now" | "Past Event";
  gallery?: string[];
  recapUrl?: string;
  createdAt?: string;
  createdBy?: string;
}

export interface EventRSVP {
  id?: string;
  eventId: string;
  name: string;
  email: string;
  organization?: string;
  phone?: string;
  notes?: string;
  timestamp: string;
}

export const INITIAL_EVENTS: FirmEvent[] = [];

const LOCAL_STORAGE_KEY = "lexvanguard_firm_events";
const LOCAL_RSVP_KEY = "lexvanguard_event_rsvps";

function getLocalEvents(): FirmEvent[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Filter out legacy generic demo events
        const userEvents = parsed.filter(evt => !evt.id?.startsWith("evt-summit-") && !evt.id?.startsWith("evt-moot-court-"));
        const todayStr = new Date().toISOString().split("T")[0];
        return userEvents.map(evt => ({
          ...evt,
          status: (evt.date && evt.date < todayStr) ? "Past Event" : (evt.status || "Upcoming")
        }));
      }
    }
  } catch {}
  return [];
}

function saveLocalEvents(events: FirmEvent[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(events));
  } catch {}
}

export function subscribeEvents(callback: (events: FirmEvent[]) => void) {
  const todayStr = new Date().toISOString().split("T")[0];

  try {
    const colRef = collection(db, "events");
    return onSnapshot(colRef, (snapshot) => {
      const list: FirmEvent[] = [];
      const seen = new Set<string>();

      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as FirmEvent;
        const id = docSnap.id || data.id;
        if (id && !seen.has(id)) {
          seen.add(id);
          const computedStatus = (data.date && data.date < todayStr) ? "Past Event" : (data.status || "Upcoming");
          list.push({ ...data, id, status: computedStatus });
        }
      });

      // Merge with local events if missing
      const local = getLocalEvents();
      local.forEach((evt) => {
        if (!seen.has(evt.id)) {
          seen.add(evt.id);
          const computedStatus = (evt.date && evt.date < todayStr) ? "Past Event" : (evt.status || "Upcoming");
          list.push({ ...evt, status: computedStatus });
        }
      });

      // Sort by date ascending for upcoming, past at the end
      list.sort((a, b) => {
        if (a.status === "Past Event" && b.status !== "Past Event") return 1;
        if (a.status !== "Past Event" && b.status === "Past Event") return -1;
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });

      saveLocalEvents(list);
      callback(list);
    }, (error) => {
      console.warn("Firestore events subscription unavailable, using local state fallback:", error?.message || error);
      callback(getLocalEvents());
    });
  } catch (e) {
    console.warn("Error subscribing to events, using local state fallback:", e);
    callback(getLocalEvents());
    return () => {};
  }
}

export async function deleteFirmEvent(id: string): Promise<void> {
  const current = getLocalEvents();
  const updated = current.filter(e => e.id !== id);
  saveLocalEvents(updated);

  try {
    const docRef = doc(db, "events", id);
    await deleteDoc(docRef);
  } catch (e) {
    console.warn("Firestore delete event notice:", e);
  }
}

export async function rsvpToEvent(
  eventId: string,
  rsvpData: { name: string; email: string; organization?: string; phone?: string; notes?: string }
): Promise<boolean> {
  const timestamp = new Date().toISOString();
  const entry: EventRSVP = {
    eventId,
    name: rsvpData.name,
    email: rsvpData.email,
    organization: rsvpData.organization || "",
    phone: rsvpData.phone || "",
    notes: rsvpData.notes || "",
    timestamp
  };

  // 1. Save RSVP locally
  try {
    const stored = localStorage.getItem(LOCAL_RSVP_KEY);
    const list: EventRSVP[] = stored ? JSON.parse(stored) : [];
    list.push(entry);
    localStorage.setItem(LOCAL_RSVP_KEY, JSON.stringify(list));
  } catch {}

  // 2. Update local event count
  const currentEvents = getLocalEvents();
  const updatedEvents = currentEvents.map(evt => {
    if (evt.id === eventId) {
      return { ...evt, registeredCount: (evt.registeredCount || 0) + 1 };
    }
    return evt;
  });
  saveLocalEvents(updatedEvents);

  // 3. Try updating Firestore
  try {
    const rsvpCol = collection(db, "rsvps");
    await addDoc(rsvpCol, entry);

    const docRef = doc(db, "events", eventId);
    await updateDoc(docRef, {
      registeredCount: increment(1)
    });
  } catch (e) {
    console.log("Firestore sync for RSVP failed gracefully, saved locally.");
  }

  return true;
}

export async function createFirmEvent(newEvent: Omit<FirmEvent, "id" | "registeredCount">): Promise<FirmEvent> {
  const id = `evt-custom-${Date.now()}`;
  const fullEvt: FirmEvent = {
    ...newEvent,
    id,
    registeredCount: 0,
    status: newEvent.status || "Upcoming"
  };

  const current = getLocalEvents();
  const updated = [fullEvt, ...current];
  saveLocalEvents(updated);

  try {
    const docRef = doc(db, "events", id);
    await setDoc(docRef, fullEvt);
  } catch (e) {
    console.log("Firestore sync for new event failed gracefully, saved locally.");
  }

  return fullEvt;
}

export function isUserRegisteredForEvent(eventId: string, email: string): boolean {
  try {
    const stored = localStorage.getItem(LOCAL_RSVP_KEY);
    if (!stored) return false;
    const list: EventRSVP[] = JSON.parse(stored);
    return list.some(r => r.eventId === eventId && r.email.toLowerCase() === email.toLowerCase());
  } catch {
    return false;
  }
}

export function generateIcsCalendar(event: FirmEvent): string {
  const cleanDate = event.date.replace(/-/g, "");
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Lex Vanguard Counsels at Law//Events Calendar//EN",
    "BEGIN:VEVENT",
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, " ")}`,
    `LOCATION:${event.location}`,
    `DTSTART:${cleanDate}T090000Z`,
    `DTEND:${cleanDate}T170000Z`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  return `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;
}

export async function updateEventGallery(eventId: string, galleryPhotos: string[]): Promise<boolean> {
  const current = getLocalEvents();
  const updated = current.map(evt => {
    if (evt.id === eventId) {
      return { ...evt, gallery: galleryPhotos };
    }
    return evt;
  });
  saveLocalEvents(updated);

  try {
    const docRef = doc(db, "events", eventId);
    await updateDoc(docRef, { gallery: galleryPhotos });
  } catch (e) {
    console.warn("Firestore update event gallery notice:", e);
  }

  return true;
}
