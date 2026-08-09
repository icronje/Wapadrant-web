"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
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
  Megaphone,
  Plus,
  Search,
  Calendar,
  Pencil,
  Trash2,
} from "lucide-react";
import { formatAfrikaansDateShort } from "@/lib/date-format";
import type { Announcement } from "@prisma/client";

const typeLabels: Record<string, string> = {
  general: "Algemeen",
  birthday: "Verjaarsdag",
  news: "Nuus",
  gksa: "GKSA",
};

const typeColors: Record<string, string> = {
  general: "bg-blue-100 text-blue-800 hover:bg-blue-100/80",
  birthday: "bg-pink-100 text-pink-800 hover:bg-pink-100/80",
  news: "bg-green-100 text-green-800 hover:bg-green-100/80",
  gksa: "bg-purple-100 text-purple-800 hover:bg-purple-100/80",
};

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/announcements");
        if (res.ok) {
          const data = await res.json();
          setAnnouncements(
            Array.isArray(data)
              ? data.sort(
                  (a, b) =>
                    new Date(b.publishedAt).getTime() -
                    new Date(a.publishedAt).getTime()
                )
              : []
          );
        }
      } catch {
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return announcements.filter((a) => {
      const matchesQuery =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q);
      const matchesType = typeFilter === "all" || a.type === typeFilter;
      return matchesQuery && matchesType;
    });
  }, [announcements, query, typeFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Is jy seker jy wil hierdie aankondiging verwyder?")) return;
    try {
      const res = await fetch(`/api/announcements/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Aankondigings</h1>
          <p className="text-sm text-gray-500">Bestuur aankondigings, verjaarsdae en nuus.</p>
        </div>
        <Button asChild>
          <Link href="/admin/aankondigings/skep">
            <Plus className="mr-2 h-4 w-4" />
            Skep Aankondiging
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2">
          <label
            htmlFor="announcement-search"
            className="text-sm font-medium text-gray-700"
          >
            Soek
          </label>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="announcement-search"
              type="search"
              placeholder="Soek volgens titel of inhoud..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="w-full space-y-2 sm:w-56">
          <label
            htmlFor="type-filter"
            className="text-sm font-medium text-gray-700"
          >
            Filter tipe
          </label>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger id="type-filter" className="w-full">
              <SelectValue placeholder="Alle tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle tipe</SelectItem>
              {Object.entries(typeLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Laai aankondigings…</p>
      ) : announcements.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <Megaphone className="mx-auto mb-3 h-12 w-12 text-gray-300" />
          <p className="text-lg font-semibold text-gray-900">Geen aankondigings nie.</p>
          <p className="mt-2 text-sm text-gray-500">Skep die eerste aankondiging om te begin.</p>
          <Button asChild className="mt-4">
            <Link href="/admin/aankondigings/skep">Skep Aankondiging</Link>
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <Search className="mx-auto mb-3 h-12 w-12 text-gray-300" />
          <p className="text-lg font-semibold text-gray-900">Geen aankondigings pas by jou soektog nie.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((a) => (
            <div
              key={a.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-3 flex items-start justify-between">
                <Badge
                  variant="outline"
                  className={`${
                    typeColors[a.type] || typeColors.general
                  } border-transparent`}
                >
                  {typeLabels[a.type] || a.type}
                </Badge>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon-sm" asChild>
                    <Link href={`/admin/aankondigings/${a.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleDelete(a.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900">{a.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                {a.content}
              </p>

              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                {formatAfrikaansDateShort(a.publishedAt)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
