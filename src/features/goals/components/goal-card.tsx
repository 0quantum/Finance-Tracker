"use client";

import { useState } from "react";
import {
  Pencil, Trash2, Loader2, Plus, ChevronDown, ChevronUp,
  CheckCircle2, Clock, AlertTriangle, TrendingUp,
} from "lucide-react";
import type { GoalWithContributions } from "@/src/types/goals";

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - new Date().setHours(0,0,0,0);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function monthsUntil(dateStr: string) {
  const now = new Date();
  const end = new Date(dateStr);
  return Math.max(0, (end.getFullYear() - now.getFullYear()) * 12 + (end.getMonth() - now.getMonth()));
}

const PRIORITY_LABEL = ["Низький", "Середній", "Високий"];
const PRIORITY_COLOR = ["text-muted-foreground", "text-yellow-500", "text-red-400"];

export function GoalCard({
  goal,
  onEdit,
  onDeleteRequest,
  onAddContribution,
  onDeleteContribution,
  onComplete,
}: {
  goal: GoalWithContributions;
  onEdit: (g: GoalWithContributions) => void;
  onDeleteRequest: (g: GoalWithContributions) => void;
  onAddContribution: (g: GoalWithContributions) => void;
  onDeleteContribution: (contributionId: string, goalId: string, amount: number) => void;
  onComplete: (id: string, completed: boolean) => void;
}) {
  const [expanded, setExpanded]   = useState(false);
  const [completing, setCompleting] = useState(false);

  const progress  = Math.min((goal.saved_amount / goal.target_amount) * 100, 100);
  const remaining = Math.max(0, goal.target_amount - goal.saved_amount);
  const days      = goal.target_date ? daysUntil(goal.target_date) : null;
  const months    = goal.target_date ? monthsUntil(goal.target_date) : null;
  const isOverdue = days !== null && days < 0 && !goal.is_completed;
  const isClose   = days !== null && days <= 30 && days >= 0 && !goal.is_completed;

  const monthlyNeeded = months && months > 0 && remaining > 0
    ? remaining / months
    : null;

  const weeklyNeeded = days && days > 0 && remaining > 0
    ? remaining / (days / 7)
    : null;

  const projectedDate = monthlyNeeded === null && goal.saved_amount < goal.target_amount
    ? null
    : null; // можна розширити

  return (
    <div className={[
      "rounded-2xl border bg-muted/20 transition-all duration-200",
      goal.is_completed
        ? "opacity-70 border-green-500/30"
        : isOverdue ? "border-red-500/30" : isClose ? "border-yellow-500/30" : "border-border",
    ].join(" ")}>

      {/* main */}
      <div className="p-4 flex items-start gap-3">
        {/* іконка */}
        <div
          className="h-11 w-11 shrink-0 rounded-2xl flex items-center justify-center text-2xl"
          style={{ backgroundColor: `${goal.color ?? "#6366f1"}22` }}
        >
          {goal.icon ?? "🎯"}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold truncate">{goal.name}</p>
            {goal.is_completed && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-500">
                Виконано
              </span>
            )}
            {goal.priority > 0 && !goal.is_completed && (
              <span className={["text-[10px] font-medium", PRIORITY_COLOR[goal.priority]].join(" ")}>
                {PRIORITY_LABEL[goal.priority]}
              </span>
            )}
          </div>

          {goal.description && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{goal.description}</p>
          )}

          {/* прогрес */}
          <div className="mt-2.5">
            <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
              <span>{goal.saved_amount.toLocaleString("uk-UA")} накопичено</span>
              <span className="font-medium">{progress.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${progress}%`,
                  backgroundColor: goal.is_completed ? "#22c55e" : (goal.color ?? "#6366f1"),
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>Ціль: {goal.target_amount.toLocaleString("uk-UA")}</span>
              {remaining > 0 && (
                <span className="text-foreground font-medium">
                  Лишилось: {remaining.toLocaleString("uk-UA")}
                </span>
              )}
            </div>
          </div>

          {/* дата і розрахунок */}
          {!goal.is_completed && goal.target_date && (
            <div className={[
              "mt-2.5 rounded-xl px-3 py-2 flex flex-col gap-1",
              isOverdue ? "bg-red-500/10" : isClose ? "bg-yellow-500/10" : "bg-muted/40",
            ].join(" ")}>
              <div className="flex items-center gap-1.5">
                {isOverdue
                  ? <AlertTriangle className="h-3 w-3 text-red-400 shrink-0" />
                  : isClose
                    ? <Clock className="h-3 w-3 text-yellow-500 shrink-0" />
                    : <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
                }
                <p className={[
                  "text-[11px] font-medium",
                  isOverdue ? "text-red-400" : isClose ? "text-yellow-500" : "text-muted-foreground",
                ].join(" ")}>
                  {isOverdue
                    ? `Прострочено на ${Math.abs(days!)} дн.`
                    : days === 0 ? "Сьогодні дедлайн!"
                    : `${days} дн. · ${new Date(goal.target_date).toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" })}`
                  }
                </p>
              </div>
              {monthlyNeeded !== null && monthlyNeeded > 0 && (
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-3 w-3 text-muted-foreground shrink-0" />
                  <p className="text-[11px] text-muted-foreground">
                    Потрібно <span className="font-semibold text-foreground">{Math.ceil(monthlyNeeded).toLocaleString("uk-UA")}/міс</span>
                    {weeklyNeeded && (
                      <> · <span className="font-semibold text-foreground">{Math.ceil(weeklyNeeded).toLocaleString("uk-UA")}/тиж</span></>
                    )}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* кнопки */}
      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-1.5 px-4 pb-3">
        <button
          onClick={() => onAddContribution(goal)}
          disabled={goal.is_completed}
          className="rounded-xl border border-border py-1.5 text-xs text-muted-foreground hover:bg-muted transition-colors flex items-center justify-center gap-1 disabled:opacity-40"
        >
          <Plus className="h-3 w-3 shrink-0" />
          <span className="hidden sm:inline">Поповнити</span>
          <span className="sm:hidden">+</span>
        </button>

        <button
          onClick={async () => {
            setCompleting(true);
            await onComplete(goal.id, !goal.is_completed);
            setCompleting(false);
          }}
          disabled={completing}
          aria-label={goal.is_completed ? "Відкрити" : "Позначити виконаним"}
          className={[
            "h-8 w-8 shrink-0 rounded-xl border flex items-center justify-center transition-colors",
            goal.is_completed
              ? "border-green-500/30 text-green-500 hover:bg-green-500/10"
              : "border-border text-muted-foreground hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/20",
          ].join(" ")}
        >
          {completing
            ? <Loader2 className="h-3 w-3 animate-spin" />
            : <CheckCircle2 className="h-3 w-3" />
          }
        </button>

        <button
          onClick={() => onEdit(goal)}
          aria-label="Редагувати"
          className="h-8 w-8 shrink-0 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Pencil className="h-3 w-3" />
        </button>

        <button
          onClick={() => onDeleteRequest(goal)}
          aria-label="Видалити"
          className="h-8 w-8 shrink-0 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-colors"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>

      {/* історія внесків */}
      {goal.contributions.length > 0 && (
        <div className="border-t border-border/50">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between px-4 py-2 text-xs text-muted-foreground hover:bg-muted/30 transition-colors rounded-b-2xl"
          >
            <span>Внески ({goal.contributions.length})</span>
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
          {expanded && (
            <div className="px-4 pb-3 space-y-1">
              {[...goal.contributions]
                .sort((a, b) => new Date(b.contributed_at).getTime() - new Date(a.contributed_at).getTime())
                .map((c) => (
                  <div key={c.id} className="flex items-center justify-between py-1 group">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(c.contributed_at).toLocaleDateString("uk-UA", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                      {c.note && <p className="text-[10px] text-muted-foreground/60">{c.note}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-green-500 tabular-nums">
                        +{c.amount.toLocaleString("uk-UA")}
                      </p>
                      <button
                        onClick={() => onDeleteContribution(c.id, goal.id, c.amount)}
                        className="opacity-0 group-hover:opacity-100 md:opacity-0 h-5 w-5 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 transition-all"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}