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
  MessageSquare,
  Mail,
  User,
  Phone,
  Calendar,
  Eye,
  Reply,
  CheckCircle2,
} from "lucide-react";
import { formatAfrikaansDateShort } from "@/lib/date-format";
import type { ContactMessage } from "@prisma/client";

const statusLabels: Record<string, string> = {
  new: "Nuut",
  read: "Gelees",
  responded: "Gereageer",
  closed: "Gesluit",
};

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  read: "bg-gray-100 text-gray-800",
  responded: "bg-green-100 text-green-800",
  closed: "bg-red-100 text-red-800",
};

const typeLabels: Record<string, string> = {
  general: "Algemeen",
  prayer: "Gebed",
  volunteer: "Vrywilliger",
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/contact");
        if (res.ok) {
          const data = await res.json();
          setMessages(
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
        setMessages([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    return statusFilter === "all"
      ? messages
      : messages.filter((m) => m.status === statusFilter);
  }, [messages, statusFilter]);

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "read" }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: "read" } : m))
        );
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Boodskappe</h1>
          <p className="text-sm text-gray-500">Bestuur kontakboodskappe en reageer.</p>
        </div>
        <div className="w-full sm:w-56">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle</SelectItem>
              <SelectItem value="new">Nuut</SelectItem>
              <SelectItem value="read">Gelees</SelectItem>
              <SelectItem value="responded">Gereageer</SelectItem>
              <SelectItem value="closed">Gesluit</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Laai boodskappe…</p>
      ) : messages.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <MessageSquare className="mx-auto mb-3 h-12 w-12 text-gray-300" />
          <p className="text-lg font-semibold text-gray-900">Geen boodskappe nie.</p>
          <p className="mt-2 text-sm text-gray-500">Nuwe boodskappe sal hier verskyn.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <MessageSquare className="mx-auto mb-3 h-12 w-12 text-gray-300" />
          <p className="text-lg font-semibold text-gray-900">Geen boodskappe in hierdie filter nie.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((message) => {
            const isExpanded = expandedId === message.id;
            return (
              <div
                key={message.id}
                className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all ${
                  message.status === "new" ? "ring-1 ring-blue-100" : ""
                }`}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                        <User className="h-4 w-4 text-gray-400" />
                        {message.name}
                      </span>
                      <Badge
                        className={
                          statusColors[message.status] || statusColors.new
                        }
                      >
                        {statusLabels[message.status] || message.status}
                      </Badge>
                      <Badge variant="outline">
                        {typeLabels[message.type] || message.type}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {message.email}
                      </span>
                      {message.phone && (
                        <span className="flex items-center gap-1.5">
                          <Phone className="h-4 w-4 text-gray-400" />
                          {message.phone}
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-medium text-gray-900">
                      {message.subject || "Geen onderwerp"}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExpandedId(isExpanded ? null : message.id)}
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      {isExpanded ? "Vou toe" : "Bekyk"}
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        href={`mailto:${message.email}?subject=Re:%20${encodeURIComponent(
                          message.subject || "Wapadrant%20navraag"
                        )}`}
                      >
                        <Reply className="mr-1 h-4 w-4" />
                        Reageer
                      </Link>
                    </Button>
                    {message.status === "new" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(message.id)}
                        className="text-gray-600 hover:text-primary"
                      >
                        <CheckCircle2 className="mr-1 h-4 w-4" />
                        Merk Gelees
                      </Button>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatAfrikaansDateShort(message.createdAt)}
                </div>

                {isExpanded && (
                  <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
                    <p className="whitespace-pre-wrap text-sm text-gray-800">
                      {message.message}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
