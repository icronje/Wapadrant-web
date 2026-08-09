"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Calendar, MapPin, Image as ImageIcon, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TicketTypeForm {
  name: string;
  price: string;
  quantity: string;
}

const emptyTicketType: TicketTypeForm = { name: "", price: "", quantity: "" };

export default function CreateEventPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    endDate: "",
    location: "",
    imageUrl: "",
    isPublished: false,
  });

  const [ticketTypes, setTicketTypes] = useState<TicketTypeForm[]>([{ ...emptyTicketType }]);

  const setField = (field: keyof typeof formData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const setTicketField = (
    index: number,
    field: keyof TicketTypeForm,
    value: string
  ) => {
    const next = [...ticketTypes];
    next[index] = { ...next[index], [field]: value };
    setTicketTypes(next);
    setErrors((prev) => ({ ...prev, [`ticket-${index}-${field}`]: "" }));
  };

  const addTicketType = () => {
    setTicketTypes([...ticketTypes, { ...emptyTicketType }]);
  };

  const removeTicketType = (index: number) => {
    setTicketTypes(ticketTypes.filter((_, i) => i !== index));
  };

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!formData.title.trim()) next.title = "Titel is vereis.";
    if (!formData.date) next.date = "Datum is vereis.";
    if (!formData.location.trim()) next.location = "Ligging is vereis.";

    if (formData.endDate && new Date(formData.endDate) <= new Date(formData.date)) {
      next.endDate = "Einddatum moet na die begin datum wees.";
    }

    if (ticketTypes.length === 0) {
      next.tickets = "Ten minste een kaartjie tipe is vereis.";
    }

    ticketTypes.forEach((tt, idx) => {
      if (!tt.name.trim()) {
        next[`ticket-${idx}-name`] = "Naam is vereis.";
      }
      const price = parseFloat(tt.price);
      if (isNaN(price) || price < 0) {
        next[`ticket-${idx}-price`] = "Prys moet 0 of meer wees.";
      }
      const qty = parseInt(tt.quantity);
      if (isNaN(qty) || qty <= 0) {
        next[`ticket-${idx}-quantity`] = "Hoeveelheid moet meer as 0 wees.";
      }
    });

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          ticketTypes: ticketTypes.map((tt) => ({
            name: tt.name.trim(),
            price: parseFloat(tt.price),
            quantity: parseInt(tt.quantity),
          })),
        }),
      });

      if (response.ok) {
        router.push("/admin/gebeurtenisse");
        router.refresh();
      } else {
        const data = await response.json().catch(() => ({}));
        setErrors({ form: data.error || "Fout met skep van gebeurtenis" });
      }
    } catch (error) {
      console.error("Error creating event:", error);
      setErrors({ form: "Fout met skep van gebeurtenis" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Skep Nuwe Gebeurtenis</h1>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Kanselleer
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left column: event details */}
          <div className="space-y-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="font-heading text-lg font-semibold text-gray-900">Gebeurtenis besonderhede</h2>

            <div className="space-y-2">
              <Label htmlFor="title">Titel *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setField("title", e.target.value)}
                className={errors.title ? "border-destructive" : ""}
                placeholder="bv. Jeugkamp 2026"
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Beskrywing</Label>
              <Textarea
                id="description"
                rows={5}
                value={formData.description}
                onChange={(e) => setField("description", e.target.value)}
                placeholder="Beskryf die gebeurtenis..."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Datum en Tyd *</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <Input
                    id="date"
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) => setField("date", e.target.value)}
                    className={errors.date ? "border-destructive" : ""}
                  />
                </div>
                {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Einddatum en -tyd (opsioneel)</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setField("endDate", e.target.value)}
                  className={errors.endDate ? "border-destructive" : ""}
                />
                {errors.endDate && <p className="text-sm text-destructive">{errors.endDate}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Ligging *</Label>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setField("location", e.target.value)}
                  className={errors.location ? "border-destructive" : ""}
                  placeholder="bv. Wapadrant Kerksaal"
                />
              </div>
              {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Beeld URL</Label>
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-gray-400" />
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setField("imageUrl", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="isPublished"
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setField("isPublished", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isPublished" className="mb-0">
                Publiseer onmiddellik
              </Label>
            </div>
          </div>

          {/* Right column: ticket types */}
          <div className="space-y-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold text-gray-900">Kaartjie tipes</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTicketType}
              >
                <Plus className="mr-1 h-4 w-4" />
                Voeg By
              </Button>
            </div>

            {errors.tickets && <p className="text-sm text-destructive">{errors.tickets}</p>}

            <div className="space-y-4">
              {ticketTypes.map((tt, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Kaartjie tipe #{index + 1}
                    </span>
                    {ticketTypes.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => removeTicketType(index)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-3">
                    <div className="space-y-2">
                      <Label htmlFor={`ticket-${index}-name`}>Naam *</Label>
                      <Input
                        id={`ticket-${index}-name`}
                        value={tt.name}
                        onChange={(e) =>
                          setTicketField(index, "name", e.target.value)
                        }
                        className={
                          errors[`ticket-${index}-name`] ? "border-destructive" : ""
                        }
                        placeholder="bv. Volwassene"
                      />
                      {errors[`ticket-${index}-name`] && (
                        <p className="text-sm text-destructive">{errors[`ticket-${index}-name`]}</p>
                      )}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`ticket-${index}-price`}>Prys (R) *</Label>
                        <Input
                          id={`ticket-${index}-price`}
                          type="number"
                          step="0.01"
                          min="0"
                          value={tt.price}
                          onChange={(e) =>
                            setTicketField(index, "price", e.target.value)
                          }
                          className={
                            errors[`ticket-${index}-price`]
                              ? "border-destructive"
                              : ""
                          }
                          placeholder="0.00"
                        />
                        {errors[`ticket-${index}-price`] && (
                          <p className="text-sm text-destructive">{errors[`ticket-${index}-price`]}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`ticket-${index}-quantity`}>Hoeveelheid *</Label>
                        <Input
                          id={`ticket-${index}-quantity`}
                          type="number"
                          min="1"
                          value={tt.quantity}
                          onChange={(e) =>
                            setTicketField(index, "quantity", e.target.value)
                          }
                          className={
                            errors[`ticket-${index}-quantity`]
                              ? "border-destructive"
                              : ""
                          }
                          placeholder="100"
                        />
                        {errors[`ticket-${index}-quantity`] && (
                          <p className="text-sm text-destructive">{errors[`ticket-${index}-quantity`]}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {errors.form && (
          <div className="mt-6 rounded-lg bg-destructive/10 p-4 text-sm font-medium text-destructive">
            {errors.form}
          </div>
        )}

        <div className="mt-8 flex justify-end gap-3 border-t border-gray-200 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Kanselleer
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              "Skep..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Skep Gebeurtenis
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
