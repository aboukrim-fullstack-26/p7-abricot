import AssigneeSelector from "./AssigneeSelector";
import { STATUS_LABELS, STATUS_BADGE_CLASS, PRIORITY_LABELS } from "@/lib/utils";
import type { TaskStatus, TaskPriority, ProjectMember } from "@/types";

interface TaskFormProps {
  title: string; setTitle: (v: string) => void;
  desc: string; setDesc: (v: string) => void;
  dueDate: string; setDueDate: (v: string) => void;
  status: TaskStatus; setStatus: (v: TaskStatus) => void;
  priority: TaskPriority; setPriority: (v: TaskPriority) => void;
  assigneeIds: string[]; setAssigneeIds: (ids: string[]) => void;
  members: ProjectMember[];
}

export default function TaskForm({
  title, setTitle, desc, setDesc, dueDate, setDueDate,
  status, setStatus, priority, setPriority,
  assigneeIds, setAssigneeIds, members,
}: TaskFormProps) {
  return (
    <>
      <div className="form-group">
        <label className="form-label form-label--required" htmlFor="tt">Titre</label>
        <input id="tt" type="text" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="td">Description</label>
        <textarea id="td" className="form-input form-input--textarea" value={desc} onChange={(e) => setDesc(e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="tdd">Échéance</label>
        <input id="tdd" type="date" className="form-input" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">Priorité</label>
        <div className="status-picker">
          {(["LOW","MEDIUM","HIGH","URGENT"] as TaskPriority[]).map((p) => (
            <span key={p}
              className={`badge badge--selectable ${priority === p ? "active" : ""}`}
              style={{ background: priority === p ? "#F3F4F6" : "#fff", border: "1px solid #E8EAED" }}
              onClick={() => setPriority(p)} role="radio" aria-checked={priority === p} tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setPriority(p); }}
            >{PRIORITY_LABELS[p]}</span>
          ))}
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Statut</label>
        <div className="status-picker">
          {(["TODO","IN_PROGRESS","DONE"] as TaskStatus[]).map((s) => (
            <span key={s}
              className={`badge ${STATUS_BADGE_CLASS[s]} badge--selectable ${status === s ? "active" : ""}`}
              onClick={() => setStatus(s)} role="radio" aria-checked={status === s} tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setStatus(s); }}
            >{STATUS_LABELS[s]}</span>
          ))}
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Assigné à</label>
        <AssigneeSelector members={members} selectedIds={assigneeIds} onChange={setAssigneeIds} />
      </div>
    </>
  );
}
