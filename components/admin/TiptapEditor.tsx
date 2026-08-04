"use client";

import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { LinkModal } from "@/components/admin/LinkModal";
import { MediaPicker } from "@/components/admin/MediaPicker";

type ToolbarButtonProps = {
  onClick: () => void;
  active?: boolean;
  label: string;
  children: React.ReactNode;
};

function ToolbarButton({ onClick, active, label, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "rounded-sm px-2.5 py-1.5 text-sm font-medium",
        active ? "bg-accent-soft text-accent-deep" : "text-ink hover:bg-line/40",
      )}
    >
      {children}
    </button>
  );
}

export function TiptapEditor({
  initialContent,
  onChange,
}: {
  initialContent: JSONContent | null;
  onChange: (content: JSONContent) => void;
}) {
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        strike: false,
        code: false,
        codeBlock: false,
        horizontalRule: false,
        link: { openOnClick: false, autolink: false },
      }),
      Image,
    ],
    content: initialContent ?? "",
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
    editorProps: {
      attributes: {
        class:
          "prose-content min-h-[16rem] rounded-b-sm border border-t-0 border-line bg-paper px-4 py-3 text-sm text-ink focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  return (
    <div>
      <div className="flex flex-wrap gap-1 rounded-t-sm border border-line bg-paper px-2 py-2">
        <ToolbarButton
          label="Gras"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <strong>G</strong>
        </ToolbarButton>
        <ToolbarButton
          label="Italique"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          label="Titre 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          label="Titre 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </ToolbarButton>
        <ToolbarButton
          label="Liste à puces"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          •
        </ToolbarButton>
        <ToolbarButton
          label="Liste numérotée"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1.
        </ToolbarButton>
        <ToolbarButton
          label="Citation"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          &ldquo;
        </ToolbarButton>
        <ToolbarButton
          label="Lien"
          active={editor.isActive("link")}
          onClick={() => setLinkModalOpen(true)}
        >
          Lien
        </ToolbarButton>
        <ToolbarButton label="Image" onClick={() => setImageModalOpen(true)}>
          Image
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />

      <LinkModal
        open={linkModalOpen}
        onClose={() => setLinkModalOpen(false)}
        onConfirm={(url) => {
          editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
          setLinkModalOpen(false);
        }}
      />
      <MediaPicker
        open={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        title="Insérer une image"
        confirmLabel="Insérer"
        onConfirm={({ url, alt }) => {
          editor.chain().focus().setImage({ src: url, alt }).run();
          setImageModalOpen(false);
        }}
      />
    </div>
  );
}
