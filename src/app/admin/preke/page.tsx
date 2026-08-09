"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mic,
  Plus,
  Search,
  Calendar,
  User,
  BookOpen,
  PlayCircle,
  Headphones,
  Pencil,
} from "lucide-react";
import { formatAfrikaansDateShort } from "@/lib/date-format";
import type { Sermon } from "@prisma/client";

export default function AdminSermonsPage() {
  const router = useRouter();
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [seriesFilter, setSeriesFilter] = useState<string>("all");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/sermons");
        if (res.ok) {
          const data = await res.json();
          setSermons(Array.isArray(data) ? data : []);
        } else {
          setSermons([]);
        }
      } catch {
        setSermons([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const allSeries = useMemo(
    () =>
      Array.from(new Set(sermons.map((s) => s.series).filter(Boolean))).sort(
        (a, b) => (a as string).localeCompare(b as string, "af")
      ),
    [sermons]
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return sermons.filter((s) => {
      const matchesQuery =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.speaker.toLowerCase().includes(q);
      const matchesSeries =
        seriesFilter === "all" || s.series === seriesFilter;
      return matchesQuery && matchesSeries;
    });
  }, [sermons, query, seriesFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Preke</h1>
          <p className="text-sm text-gray-500">Bestuur preke, klank en video’s.</p>
        </div>
        <Button asChild>
          <Link href="/admin/preke/skep">
            <Plus className="mr-2 h-4 w-4" />
            Voeg Preek By
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2">
          <label htmlFor="sermon-search" className="text-sm font-medium text-gray-700">
            Soek
          </label>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="sermon-search"
              type="search"
              placeholder="Soek volgens titel of spreker..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="w-full space-y-2 sm:w-56">
          <label htmlFor="series-filter" className="text-sm font-medium text-gray-700">
            Filter reeks
          </label>
          <Select value={seriesFilter} onValueChange={setSeriesFilter}>
            <SelectTrigger id="series-filter" className="w-full">
              <SelectValue placeholder="Alle reekse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle reekse</SelectItem>
              {allSeries.map((s) => (
                <SelectItem key={s as string} value={s as string}>
                  {s as string}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Laai preke…</p>
      ) : sermons.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <Mic className="mx-auto mb-3 h-12 w-12 text-gray-300" />
          <p className="text-lg font-semibold text-gray-900">Geen preke nie.</p>
          <p className="mt-2 text-sm text-gray-500">Voeg die eerste preek by om te begin.</p>
          <Button asChild className="mt-4">
            <Link href="/admin/preke/skep">Voeg Preek By</Link>
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <Search className="mx-auto mb-3 h-12 w-12 text-gray-300" />
          <p className="text-lg font-semibold text-gray-900">Geen preke pas by jou soektog nie.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((sermon) => (
              <div
                key={sermon.id}
                className="group rounded-lg border border-gray-200 bg-gray-50/50 p-4 transition-all hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-sm"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mic className="h-5 w-5" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    asChild
                    className="text-gray-500 hover:text-primary"
                  >
                    <Link href={`/admin/preke/${sermon.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <h3 className="font-semibold text-gray-900">{sermon.title}</h3>

                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    {sermon.speaker}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {formatAfrikaansDateShort(sermon.date)}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {sermon.series ? (
                    <Badge variant="secondary" className="gap-1">
                      <BookOpen className="h-3 w-3" />
                      {sermon.series}
                    </Badge>
                  ) : null}
                  {sermon.videoUrl ? (
                    <Badge variant="outline" className="gap-1">
                      <PlayCircle className="h-3 w-3" />
                      Video
                    </Badge>
                  ) : null}
                  {sermon.audioUrl ? (
                    <Badge variant="outline" className="gap-1">
                      <Headphones className="h-3 w-3" />
                      Klank
                    </Badge>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
