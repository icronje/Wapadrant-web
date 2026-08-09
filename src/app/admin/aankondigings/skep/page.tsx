"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Megaphone, Save, X, Calendar, Tag } from "lucide-react";

const typeOptions = [
  { value: "general", label: "Algemeen" },
  { value: "birthday", label: "Verjaarsdag" },
  { value: "news", label: "Nuus" },
  { value: "gksa", label: "GKSA" },
];

interface FormErrors {
  title?: string;
  content?: string;
  form?: string;
}

export default function CreateAnnouncementPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    title: "",
    type: "general",
    content: "",
    expiresAt: "",
  });

  const setField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }));
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!formData.title.trim()) next.title = "Titel is vereis.";
    if (!formData.content.trim()) next.content = "Inhoud is vereis.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          type: formData.type,
          expiresAt: formData.expiresAt
            ? new Date(formData.expiresAt).toISOString()
            : null,
        }),
      });

      if (res.ok) {
        router.push("/admin/aankondigings");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setErrors({ form: data.error || "Kon nie aankondiging skep nie." });
      }
    } catch {
      setErrors({ form: "Kon nie aankondiging skep nie." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Skep Aankondiging</h1>
        <p className="text-sm text-gray-500">
          Deel ‘n boodskap met ons familie.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="space-y-2">
          <Label htmlFor="title" className="flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-gray-400" />
            Titel *
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setField("title", e.target.value)}
            className={errors.title ? "border-destructive" : ""}
            placeholder="bv. Jeugkamp 2026"
          />
          {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="type" className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-gray-400" />
              Tipe *
            </Label>
            <Select value={formData.type} onValueChange={(v: any) => setField("type", v ?? "general")}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Kies tipe" />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiresAt" className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              Verval datum (opsioneel)
            </Label>
            <Input
              id="expiresAt"
              type="date"
              value={formData.expiresAt}
              onChange={(e) => setField("expiresAt", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Inhoud *</Label>
          <Textarea
            id="content"
            rows={6}
            value={formData.content}
            onChange={(e) => setField("content", e.target.value)}
            className={errors.content ? "border-destructive" : ""}
            placeholder="Wat wil jy met die gemeente deel?"
          />
          {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
        </div>

        {errors.form && (
          <div className="rounded-lg bg-destructive/10 p-4 text-sm font-medium text-destructive">
            {errors.form}
          </div>
        )}

        <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
          <Button type="button" variant="outline" disabled={isLoading}>
            <Link href="/admin/aankondigings">
              <X className="mr-2 h-4 w-4" />
              Kanselleer
            </Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Stoor…" : "Stoor Aankondiging"}
          </Button>
        </div>
      </form>
    </div>
  );
}
