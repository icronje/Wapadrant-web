"use client";

import { useState, useMemo, isValidElement, type ReactElement } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Megaphone } from "lucide-react";
import type { Announcement } from "@prisma/client";

const typeLabels: Record<string, string> = {
  all: "Alle tipe",
  general: "Algemeen",
  birthday: "Verjaarsdag",
  news: "Nuus",
  gksa: "GKSA",
};

interface AnnouncementFilterClientProps {
  announcements: Announcement[];
  children: React.ReactNode;
  emptyState: React.ReactNode;
}

export function AnnouncementFilterClient({
  announcements,
  children,
  emptyState,
}: AnnouncementFilterClientProps) {
  const [type, setType] = useState<string>("all");

  const childArray = useMemo(
    () => (Array.isArray(children) ? children : [children]).flat(),
    [children]
  );

  const filtered = useMemo(() => {
    return childArray.filter((child) => {
      if (!isValidElement(child)) return false;
      const a: Announcement | undefined = (child as any).props?.announcement;
      if (!a) return false;
      return type === "all" || a.type === type;
    });
  }, [childArray, type]);

  if (announcements.length === 0) {
    return <>{emptyState}</>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card p-4 sm:flex-row sm:items-end">
        <div className="w-full space-y-2 sm:w-56">
          <label
            htmlFor="type-filter"
            className="text-sm font-medium text-foreground"
          >
            Filter tipe
          </label>
          <Select value={type} onValueChange={(v: any) => setType(v ?? "all")}>
            <SelectTrigger id="type-filter" className="w-full">
              <SelectValue placeholder="Alle tipe" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(typeLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {type !== "all"
          ? `${filtered.length} van ${announcements.length} aankondigings`
          : `${announcements.length} aankondigings`}
      </p>

      {filtered.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-secondary/40 p-10 text-center">
          <Megaphone className="mx-auto mb-3 h-12 w-12 text-muted-foreground/60" />
          <p className="font-heading text-lg font-semibold text-foreground">
            Geen aankondigings in hierdie kategorie nie.
          </p>
        </div>
      )}
    </div>
  );
}
