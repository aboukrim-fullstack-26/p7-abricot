"use client";
import { useState, useMemo } from "react";
import type { Task } from "@/types";

const MONTHS_FR = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const DAYS_FR = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];

interface CalendarViewProps {
  tasks: Task[];
  onTaskClick: (t: Task) => void;
}

export default function CalendarView({ tasks, onTaskClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = useMemo(() => new Date(), []);

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  let startDow = firstDay.getDay() - 1;
  if (startDow < 0) startDow = 6;
  const totalCells = Math.ceil((startDow + lastDay.getDate()) / 7) * 7;

  const cells: Date[] = [];
  for (let i = 0; i < totalCells; i++) {
    cells.push(new Date(year, month, i - startDow + 1));
  }

  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    tasks.forEach((t) => {
      if (!t.dueDate) return;
      const key = t.dueDate.split("T")[0];
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });
    return map;
  }, [tasks]);

  const fmtKey = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;

  return (
    <div>
      <div className="calendar-toolbar">
        <div className="calendar-toolbar__nav">
          <button className="calendar-toolbar__nav-btn" onClick={() => setCurrentDate(new Date(year, month - 1, 1))} aria-label="Mois précédent">
            <svg viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <span className="calendar-toolbar__month">{MONTHS_FR[month]} {year}</span>
          <button className="calendar-toolbar__nav-btn" onClick={() => setCurrentDate(new Date(year, month + 1, 1))} aria-label="Mois suivant">
            <svg viewBox="0 0 14 14" fill="none"><path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button className="calendar-toolbar__today-btn" onClick={() => setCurrentDate(new Date())}>Aujourd&apos;hui</button>
        </div>
      </div>

      <div className="calendar-grid">
        <div className="calendar-grid__header">
          {DAYS_FR.map((d, i) => (
            <div key={d} className={`calendar-grid__day-name${i >= 5 ? " calendar-grid__day-name--weekend" : ""}`}>{d}</div>
          ))}
        </div>
        <div className="calendar-grid__body">
          {cells.map((cellDate, i) => {
            const isOther = cellDate.getMonth() !== month;
            const isToday = cellDate.toDateString() === today.toDateString();
            const isWeekend = cellDate.getDay() === 0 || cellDate.getDay() === 6;
            const key = fmtKey(cellDate);
            const dayTasks = tasksByDate[key] || [];

            let cls = "calendar-grid__cell";
            if (isOther) cls += " calendar-grid__cell--other-month";
            if (isToday) cls += " calendar-grid__cell--today";
            if (isWeekend && !isOther) cls += " calendar-grid__cell--weekend";

            return (
              <div key={i} className={cls}>
                <span className="calendar-grid__cell-number">{cellDate.getDate()}</span>
                {dayTasks.length > 0 && (
                  <div className="calendar-grid__cell-tasks">
                    {dayTasks.slice(0, 3).map((t) => {
                      const statusMap: Record<string, string> = { TODO: "todo", IN_PROGRESS: "inprogress", DONE: "done" };
                      return (
                        <span key={t.id}
                          className={`calendar-grid__task-pill calendar-grid__task-pill--${statusMap[t.status] || "todo"}`}
                          title={t.title}
                          onClick={(e) => { e.stopPropagation(); onTaskClick(t); }}
                          role="button" tabIndex={0}
                        >
                          {t.title}
                        </span>
                      );
                    })}
                    {dayTasks.length > 3 && <span className="calendar-grid__more">+{dayTasks.length - 3} autres</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
