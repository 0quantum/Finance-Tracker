"use client";

import { Plus, Loader2 } from "lucide-react";
import { formatCurrency } from "./currency-input-preview";
import type { CategorySummary } from "@/hooks/use-category-summary";

type OnCategoryClick = (id: string, type: "income" | "expense") => void;

function CategoryIcon({ category }: { category: CategorySummary }) {
  if (category.icon) {
    return (
      <span
        className="text-lg leading-none"
        role="img"
        aria-label={category.name}
      >
        {category.icon}
      </span>
    );
  }
  return (
    <span
      className={`text-sm font-semibold ${
        category.type === "income"
          ? "text-green-600 dark:text-green-400"
          : "text-red-500"
      }`}
    >
      {category.name.slice(0, 2).toUpperCase()}
    </span>
  );
}

function CategoryBlock({
  category,
  isValidAmount,
  onClick,
  isSubmitting,
}: {
  category: CategorySummary;
  isValidAmount: boolean;
  onClick: OnCategoryClick;
  isSubmitting: boolean;
}) {
  const isIncome = category.type === "income";
  const clickable = isValidAmount && !isSubmitting;

  return (
    <button
      onClick={() => clickable && onClick(category.id, category.type)}
      disabled={isSubmitting}
      className={[
        "group flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-2.5 text-center w-full transition-all duration-200",
        clickable
          ? "cursor-pointer hover:scale-[1.03] hover:shadow-sm active:scale-95"
          : "cursor-default",
        clickable && isIncome
          ? "border-green-500/30 bg-green-500/5 hover:bg-green-500/10"
          : clickable
            ? "border-red-500/20 bg-red-500/5 hover:bg-red-500/10"
            : "border-border bg-muted/40",
      ].join(" ")}
      style={!clickable ? { borderColor: `${category.color}33` } : undefined}
    >
      <div
        className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full transition-colors"
        style={{ backgroundColor: `${category.color}1A` }}
      >
        <CategoryIcon category={category} />
      </div>

      <div className="w-full min-w-0">
        <p className="truncate text-[11px] sm:text-xs text-muted-foreground leading-tight">
          {category.name}
        </p>
        <p
          className={`mt-0.5 text-xs sm:text-sm font-semibold tabular-nums ${
            isIncome ? "text-green-600 dark:text-green-400" : "text-foreground"
          }`}
        >
          {isIncome ? "+" : ""}
          {formatCurrency(category.total)}
        </p>
      </div>
    </button>
  );
}

function AddCategoryBlock({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed px-2 py-2.5 text-center transition-colors hover:bg-muted/60 hover:border-solid hover:border-border cursor-pointer group w-full min-h-[80px]"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted ">
        <Plus className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:rotate-90 group-hover:text-foreground" />{" "}
      </div>
      <p className="text-[11px] text-muted-foreground">Додати</p>
    </button>
  );
}

function CategorySection({
  label,
  categories,
  isValidAmount,
  onCategoryClick,
  isSubmitting,
  showAdd,
  onAddClick,
}: {
  label: string;
  categories: CategorySummary[];
  isValidAmount: boolean;
  onCategoryClick: OnCategoryClick;
  isSubmitting: boolean;
  showAdd?: boolean;
  onAddClick?: () => void;
}) {
  return (
    <div>
      <p className="mb-2 text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-muted-foreground px-0.5">
        {label}
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2">
        {categories.map((cat) => (
          <CategoryBlock
            key={cat.id}
            category={cat}
            isValidAmount={isValidAmount}
            onClick={onCategoryClick}
            isSubmitting={isSubmitting}
          />
        ))}
        {showAdd && onAddClick && <AddCategoryBlock onClick={onAddClick} />}
      </div>
    </div>
  );
}

function SkeletonBlock() {
  return (
    <div className="h-[80px] sm:h-[88px] rounded-2xl bg-muted animate-pulse" />
  );
}

type CategoryGridProps = {
  categories: CategorySummary[];
  loading: boolean;
  error: string | null;
  isValidAmount: boolean;
  onCategoryClick: OnCategoryClick;
  isSubmitting: boolean;
  onAddCategory: () => void;
};

export function CategoryGrid({
  categories,
  loading,
  error,
  isValidAmount,
  onCategoryClick,
  isSubmitting,
  onAddCategory,
}: CategoryGridProps) {
  if (error) return <p className="text-xs text-red-500 px-1">{error}</p>;

  if (loading) {
    return (
      <div className="space-y-4">
        {[3, 4].map((n, si) => (
          <div
            key={si}
            className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2"
          >
            {Array.from({ length: n }).map((_, i) => (
              <SkeletonBlock key={i} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  const income = categories.filter((c) => c.type === "income");
  const expense = categories.filter((c) => c.type === "expense");

  return (
    <div className="flex-1 scrollbar-none space-y-4 sm:space-y-5">
      {isSubmitting && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          Зберігаємо...
        </div>
      )}
      {income.length > 0 && (
        <CategorySection
          label="Доходи"
          categories={income}
          isValidAmount={isValidAmount}
          onCategoryClick={onCategoryClick}
          isSubmitting={isSubmitting}
          showAdd={false}
        />
      )}
      <CategorySection
        label="Витрати"
        categories={expense}
        isValidAmount={isValidAmount}
        onCategoryClick={onCategoryClick}
        isSubmitting={isSubmitting}
        showAdd
        onAddClick={onAddCategory}
      />
    </div>
  );
}
