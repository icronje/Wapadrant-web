"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatAfrikaansDateShort } from "@/lib/date-format";
import { FileText, Calendar, Download, Plus, Trash2 } from "lucide-react";
import type { Newsletter } from "@prisma/client";

interface NewsletterWithDate extends Newsletter {
  createdAt: string;
}

export default function AdminNewslettersPage() {
  const [newsletters, setNewsletters] = useState<NewsletterWithDate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/newsletters");
        if (res.ok) {
          const data = await res.json();
          setNewsletters(
            Array.isArray(data)
              ? data.sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
              : []
          );
        }
      } catch {
        setNewsletters([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Is jy seker jy wil hierdie nuusbrief verwyder?")) return;
    try {
      const res = await fetch(`/api/newsletters/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setNewsletters((prev) => prev.filter((n) => n.id !== id));
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nuusbriewe</h1>
          <p className="text-sm text-gray-500">Bestuur en laai nuusbriewe op.</p>
        </div>
        <Link href="/admin/nuusbriewe/laai-op"><Button >
            <Plus className="mr-2 h-4 w-4" />
            Laai Op Nuusbrief
          </Button></Link>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Laai nuusbriewe…</p>
      ) : newsletters.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <FileText className="mx-auto mb-3 h-12 w-12 text-gray-300" />
          <p className="text-lg font-semibold text-gray-900">Geen nuusbriewe nie.</p>
          <p className="mt-2 text-sm text-gray-500">Laai die eerste nuusbrief op.</p>
          <Link href="/admin/nuusbriewe/laai-op"><Button className="mt-4">Laai Op Nuusbrief</Button></Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {newsletters.map((newsletter) => (
              <div
                key={newsletter.id}
                className="flex flex-col justify-between rounded-lg border border-gray-200 bg-gray-50/50 p-4 transition-all hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-sm"
              >
                <div>
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{newsletter.title}</h3>
                  <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    {formatAfrikaansDateShort(newsletter.createdAt)}
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Button variant="outline" className="flex-1">
                    <a
                      href={newsletter.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Laai af
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleDelete(newsletter.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
