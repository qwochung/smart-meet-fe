import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarClock, ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

const toDateKey = (date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const toMonthKey = (date) => `${date.getFullYear()}-${date.getMonth()}`;

const parseDate = (value) => {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const dayStart = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const compareByStartAt = (a, b) => {
  const left = parseDate(a.startAt)?.getTime() ?? 0;
  const right = parseDate(b.startAt)?.getTime() ?? 0;
  return left - right;
};

const formatMonth = (date) =>
  new Intl.DateTimeFormat("vi-VN", { month: "long", year: "numeric" }).format(date);

const formatTime = (value) =>
  new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit" }).format(parseDate(value) ?? new Date());

export default function MeetingCalendar({
  events = [],
  compact = false,
  compactAgendaLimit = 3,
  selectedDate: controlledSelectedDate,
  onSelectedDateChange,
}) {
  const today = dayStart(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [internalSelectedDate, setInternalSelectedDate] = useState(today);

  const selectedDate = controlledSelectedDate ? dayStart(controlledSelectedDate) : internalSelectedDate;

  const eventsByDay = useMemo(() => {
    const bucket = {};

    events.forEach((item) => {
      const startAt = parseDate(item.startAt);
      if (!startAt) {
        return;
      }

      const key = toDateKey(startAt);
      bucket[key] = bucket[key] ? [...bucket[key], item] : [item];
    });

    Object.keys(bucket).forEach((key) => {
      bucket[key].sort(compareByStartAt);
    });

    return bucket;
  }, [events]);

  const visibleMonth = currentMonth;
  const firstDayOfMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
  const firstDayIndex = (firstDayOfMonth.getDay() + 6) % 7;
  const firstVisibleDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1 - firstDayIndex);

  const calendarDays = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(firstVisibleDay);
    date.setDate(firstVisibleDay.getDate() + index);
    return date;
  });

  const setSelectedDate = (date) => {
    const normalized = dayStart(date);

    if (onSelectedDateChange) {
      onSelectedDateChange(normalized);
      return;
    }

    setInternalSelectedDate(normalized);
  };

  const onPickDay = (date) => {
    setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    setSelectedDate(date);
  };

  const selectedEvents = eventsByDay[toDateKey(selectedDate)] ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() =>
            setCurrentMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))
          }
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100"
          aria-label="Tháng trước"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="text-center">
          <p className="text-sm font-semibold capitalize text-slate-900">{formatMonth(visibleMonth)}</p>
          {!compact && <p className="text-xs text-slate-500">Nhấn ngày để xem chi tiết lịch họp</p>}
        </div>

        <button
          type="button"
          onClick={() =>
            setCurrentMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))
          }
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100"
          aria-label="Tháng sau"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="py-1 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {calendarDays.map((date) => {
          const isInCurrentMonth = toMonthKey(date) === toMonthKey(visibleMonth);
          const isSelected = toDateKey(date) === toDateKey(selectedDate);
          const isToday = toDateKey(date) === toDateKey(today);
          const dayEvents = eventsByDay[toDateKey(date)] ?? [];

          return (
            <button
              key={toDateKey(date)}
              type="button"
              onClick={() => onPickDay(date)}
              className={`min-h-16 rounded-lg border p-1.5 text-left transition ${
                isSelected
                  ? "border-primary-500 bg-primary-50"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              } ${isInCurrentMonth ? "text-slate-800" : "text-slate-300"}`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold ${
                    isToday ? "bg-slate-900 text-white" : ""
                  }`}
                >
                  {date.getDate()}
                </span>
                {dayEvents.length > 0 && <span className="text-[10px] font-semibold text-primary-600">{dayEvents.length}</span>}
              </div>

              {dayEvents.length > 0 && (
                <div className="mt-1.5 space-y-1">
                  {compact ? (
                    <div className="flex gap-1">
                      {dayEvents.slice(0, 3).map((item) => (
                        <span key={item.id} className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                      ))}
                    </div>
                  ) : (
                    dayEvents.slice(0, 2).map((item) => (
                      <p key={item.id} className="truncate rounded bg-primary-100 px-1.5 py-0.5 text-[10px] font-medium text-primary-700">
                        {formatTime(item.startAt)} · {item.title}
                      </p>
                    ))
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className={`rounded-xl border border-slate-200 bg-slate-50 ${compact ? "p-2.5" : "p-3"}`}>
        <div className={`mb-2 flex items-center gap-2 ${compact ? "text-xs" : "text-sm"} font-semibold text-slate-800`}>
            <CalendarClock className="h-4 w-4 text-primary-600" />
            Lịch ngày {selectedDate.toLocaleDateString("vi-VN")}
        </div>

        {selectedEvents.length === 0 ? (
          <p className={`${compact ? "text-xs" : "text-sm"} text-slate-500`}>Chưa có cuộc họp nào trong ngày này.</p>
        ) : (
          <div className="space-y-2">
            {selectedEvents.slice(0, compact ? compactAgendaLimit : selectedEvents.length).map((item) => (
              <Link
                key={item.id}
                to={`/meetings/${item.id}`}
                className={`flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white ${compact ? "px-2.5 py-2 text-xs" : "px-3 py-2 text-sm"} hover:bg-slate-100`}
              >
                <div>
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500">{formatTime(item.startAt)} · {item.attendees ?? 0} người tham gia</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                  {item.status ?? "Đã lên lịch"}
                </span>
              </Link>
            ))}

            {compact && selectedEvents.length > compactAgendaLimit && (
              <p className="text-[11px] text-slate-500">
                +{selectedEvents.length - compactAgendaLimit} cuộc họp khác trong ngày
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
