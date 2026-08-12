import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { subscribeEvents, getEventRegistrationUrl, type FirmEvent } from "@/lib/events-store";
import { RsvpModal } from "./RsvpModal";
import { EventGalleryModal } from "./EventGalleryModal";

export default function EventsSection() {
  const [events, setEvents] = useState<FirmEvent[]>([]);
  const [activeRsvpEvent, setActiveRsvpEvent] = useState<FirmEvent | null>(null);
  const [activeGalleryEvent, setActiveGalleryEvent] = useState<FirmEvent | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeEvents((list) => {
      setEvents(list);
    });
    return () => unsubscribe();
  }, []);

  const handleCardClick = (evt: FirmEvent) => {
    if (evt.status === "Past Event") {
      setActiveGalleryEvent(evt);
    } else {
      const regUrl = getEventRegistrationUrl(evt);
      if (regUrl) {
        window.open(regUrl, "_blank", "noopener,noreferrer");
      } else {
        setActiveRsvpEvent(evt);
      }
    }
  };

  return (
    <section id="events-section" className="py-16 sm:py-24 bg-white text-black w-full max-w-full overflow-x-hidden border-t border-gray-100 font-sans">
      {activeRsvpEvent && (
        <RsvpModal event={activeRsvpEvent} onClose={() => setActiveRsvpEvent(null)} />
      )}

      {activeGalleryEvent && (
        <EventGalleryModal event={activeGalleryEvent} onClose={() => setActiveGalleryEvent(null)} />
      )}

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 text-center">
        
        {/* Section Heading & Accent Line */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-black uppercase tracking-wider">
          Events & Colloquiums
        </h2>
        <div className="h-1 w-12 sm:w-16 bg-[#ffc107] mx-auto mb-8 sm:mb-12" />

        {/* Content Area */}
        {events.length === 0 ? (
          <div className="max-w-2xl mx-auto space-y-6">
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base md:text-lg font-normal">
              No upcoming events are currently scheduled. Check back for future symposiums, legal workshops, and mooting championships.
            </p>
            <div>
              <Link
                href="/events"
                className="bg-[#ffc107] text-black px-8 py-3.5 font-extrabold text-xs sm:text-sm uppercase tracking-widest hover:bg-yellow-400 transition-colors inline-block shadow-xs"
              >
                VIEW EVENTS CALENDAR
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 text-left">
              {events.slice(0, 3).map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => handleCardClick(evt)}
                  className="group cursor-pointer bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-2xl hover:border-yellow-500/50 transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-[16/10] w-full bg-neutral-900 overflow-hidden">
                    <img
                      src={evt.image}
                      alt={evt.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/default.png";
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-black/80 backdrop-blur-md text-yellow-400 border border-yellow-500/30 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                        {evt.category || "Symposium"}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 space-y-4">
                    <div className="space-y-2">
                      <p className="text-xs sm:text-sm font-mono font-bold text-yellow-600 uppercase tracking-widest flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-yellow-500 shrink-0" />
                        {evt.displayDate}
                      </p>
                      <h3 className="font-extrabold text-gray-900 text-lg sm:text-xl group-hover:text-yellow-600 transition-colors leading-snug line-clamp-2">
                        {evt.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 truncate flex items-center gap-1.5 pt-1">
                        <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                        {evt.location}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-black uppercase tracking-wider group-hover:text-yellow-600 transition-colors">
                      <span>{evt.status === "Past Event" ? "View Past Gallery" : "Event Details"}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <Link
                href="/events"
                className="bg-[#ffc107] text-black px-8 py-3.5 font-extrabold text-xs sm:text-sm uppercase tracking-widest hover:bg-yellow-400 transition-colors inline-block shadow-xs"
              >
                VIEW ALL EVENTS ({events.length})
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
