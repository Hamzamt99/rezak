"use client";

import { FormProps, Section } from "@/types/builder";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

export interface FormField {
  label: string;
  type: string; // e.g., "text", "textarea", "submit", etc.
}

interface SectionEditorProps {
  section: Section | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedSection: Section) => void;
}

export const SectionEditor = ({
  section,
  isOpen,
  onClose,
  onSave,
}: SectionEditorProps) => {
  const [editedSection, setEditedSection] = useState<Section | null>(null);

  useEffect(() => {
    if (section) {
      setEditedSection(JSON.parse(JSON.stringify(section)));
    }
  }, [section]);

  if (!editedSection) return null;

  const handlePropertyChange = (path: string[], value: string) => {
    setEditedSection((prev) => {
      if (!prev) return null;
      const newSection = JSON.parse(JSON.stringify(prev));
      let current: any = newSection.properties;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newSection;
    });
  };

  const handleSave = () => {
    if (editedSection) {
      onSave(editedSection);
      onClose();
    }
  };

  const handleFieldChange = (
    index: number,
    key: keyof FormField,
    value: string
  ) => {
    setEditedSection((prev:any) => {
      if (!prev) return prev;

      const formProps = prev.properties as FormProps;
      const updatedFields = formProps.fields.map((field, i) =>
        i === index ? { ...field, [key]: value } : field
      );

      return {
        ...prev,
        properties: {
          ...formProps,
          fields: updatedFields,
        },
      };
    });
  };

  const renderFields = () => {
    switch (editedSection.type) {
      case "header":
        return (
          <div className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                type="text"
                id="title"
                value={editedSection.properties.title}
                onChange={(e) =>
                  handlePropertyChange(["title"], e.target.value)
                }
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                type="text"
                id="subtitle"
                value={editedSection.properties.subtitle}
                onChange={(e) =>
                  handlePropertyChange(["subtitle"], e.target.value)
                }
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input
                type="text"
                id="logoUrl"
                value={editedSection.properties.logoUrl}
                onChange={(e) =>
                  handlePropertyChange(["logoUrl"], e.target.value)
                }
              />
            </div>
          </div>
        );

      case "form":
        const formProps = editedSection.properties as FormProps;
        return (
          <div className="space-y-4">
            {/* Now render each field */}
            <div className="space-y-4">
              <Label className="text-md font-semibold">Fields</Label>
              <div className="space-y-3">
                {formProps.fields.map(
                  (field, index) =>
                    field.type !== "submit" && (
                      <div key={index} className="space-y-2 border p-3 rounded">
                        {
                          <Input
                            type="text"
                            value={field.label}
                            onChange={(e) =>
                              handleFieldChange(index, "label", e.target.value)
                            }
                          />
                        }
                      </div>
                    )
                )}
              </div>
            </div>
          </div>
        );

      case "footer":
        return (
          <div className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                type="text"
                id="companyName"
                value={editedSection.properties.companyName}
                onChange={(e) =>
                  handlePropertyChange(["companyName"], e.target.value)
                }
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="copyright">Copyright Text</Label>
              <Input
                type="text"
                id="copyright"
                value={editedSection.properties.copyrightText}
                onChange={(e) =>
                  handlePropertyChange(["copyrightText"], e.target.value)
                }
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit {editedSection.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">{renderFields()}</div>
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
