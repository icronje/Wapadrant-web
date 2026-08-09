"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Upload, X, Save } from "lucide-react";

interface FormErrors {
  title?: string;
  fileUrl?: string;
  form?: string;
}

export default function UploadNewsletterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    title: "",
    fileUrl: "",
    publishedAt: "",
  });

  const setField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }));
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!formData.title.trim()) next.title = "Titel is vereis.";
    if (!formData.fileUrl.trim()) next.fileUrl = "Leêr URL is vereis.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/newsletters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          fileUrl: formData.fileUrl,
          publishedAt: formData.publishedAt
            ? new Date(formData.publishedAt).toISOString()
            : null,
        }),
      });

      if (res.ok) {
        router.push("/admin/nuusbriewe");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setErrors({ form: data.error || "Kon nie nuusbrief oplaai nie." });
      }
    } catch {
      setErrors({ form: "Kon nie nuusbrief oplaai nie." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Laai Nuusbrief Op</h1>
        <p className="text-sm text-gray-500">
          Voeg ‘n nuwe nuusbrief of e-Nuus by die argief.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="space-y-2">
          <Label htmlFor="title" className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-400" />
            Titel *
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setField("title", e.target.value)}
            className={errors.title ? "border-destructive" : ""}
            placeholder="bv. Wapadrant e-Nuus - Augustus 2026"
          />
          {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="fileUrl" className="flex items-center gap-2">
            <Upload className="h-4 w-4 text-gray-400" />
            Leêr URL *
          </Label>
          <Input
            id="fileUrl"
            type="url"
            value={formData.fileUrl}
            onChange={(e) => setField("fileUrl", e.target.value)}
            className={errors.fileUrl ? "border-destructive" : ""}
            placeholder="https://example.com/newsletter.pdf"
          />
          {errors.fileUrl && <p className="text-sm text-destructive">{errors.fileUrl}</p>}
          <p className="text-xs text-gray-500">
            Plak die skakel na die PDF of dokument. Oplaai van lêers volg later.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="publishedAt" className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            Gepubliseer datum
          </Label>
          <Input
            id="publishedAt"
            type="date"
            value={formData.publishedAt}
            onChange={(e) => setField("publishedAt", e.target.value)}
          />
        </div>

        {errors.form && (
          <div className="rounded-lg bg-destructive/10 p-4 text-sm font-medium text-destructive">
            {errors.form}
          </div>
        )}

        <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
          <Button type="button" variant="outline" disabled={isLoading}>
            <Link href="/admin/nuusbriewe">
              <X className="mr-2 h-4 w-4" />
              Kanselleer
            </Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Laai op…" : "Laai Op"}
          </Button>
        </div>
      </form>
    </div>
  );
}
