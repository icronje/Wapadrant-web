"use client";

import { useState, useMemo, isValidElement, type ReactElement } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import type { Sermon } from "@prisma/client";

interface SermonArchiveClientProps {
  sermons: Sermon[];
  series: string[];
  children: React.ReactNode;
  emptyState: React.ReactNode;
}

export function SermonArchiveClient({
  sermons,
  series,
  children,
  emptyState,
}: SermonArchiveClientProps) {
  const [query, setQuery] = useState("");
  const [selectedSeries, setSelectedSeries] = useState<string>("all");

  const childArray = useMemo(
    () => (Array.isArray(children) ? children : [children]).flat(),
    [children]
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return childArray.filter((child) => {
      if (!isValidElement(child)) return false;
      const sermon: Sermon | undefined = (child as ReactElement).props?.sermon;
      if (!sermon) return false;
      const matchesQuery =
        !q ||
        sermon.title.toLowerCase().includes(q) ||
        sermon.speaker.toLowerCase().includes(q) ||
        (sermon.series && sermon.series.toLowerCase().includes(q));
      const matchesSeries =
        selectedSeries === "all" || sermon.series === selectedSeries;
      return matchesQuery && matchesSeries;
    });
  }, [childArray, query, selectedSeries]);

  if (sermons.length === 0) {
    return <>{emptyState}</>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card p-4 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2">
          <label
            htmlFor="sermon-search"
            className="text-sm font-medium text-foreground"
          >
            Soek
          </label>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="sermon-search"
              type="search"
              placeholder="Soek volgens titel, spreker of reeks..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="w-full space-y-2 sm:w-56">
          <label
            htmlFor="series-filter"
            className="text-sm font-medium text-foreground"
          >
            Filter reeks
          </label>
          <Select value={selectedSeries} onValueChange={setSelectedSeries}>
            <SelectTrigger id="series-filter" className="w-full">
              <SelectValue placeholder="Alle reekse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle reekse</SelectItem>
              {series.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {query || selectedSeries !== "all"
          ? `${filtered.length} van ${sermons.length} preke`
          : `${sermons.length} preke beskikbaar`}
      </p>

      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{filtered}</div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-secondary/40 p-10 text-center">
          <Search className="mx-auto mb-3 h-12 w-12 text-muted-foreground/60" />
          <p className="font-heading text-lg font-semibold text-foreground">
            Geen preke pas by jou soektog nie.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Probeer ‘n ander woord of kies ‘n ander reeks.
          </p>
        </div>
      )}
    </div>
  );
}
