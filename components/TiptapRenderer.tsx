import type { JSONContent } from "@tiptap/react";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

// Rendu contrôlé du JSON Tiptap — jamais de dangerouslySetInnerHTML sur du
// contenu venant de la base (plan §7.7). Ne couvre que les nœuds réellement
// proposés par l'éditeur (components/admin/TiptapEditor.tsx).

function renderMarks(text: string, marks: JSONContent["marks"] = []) {
  return marks.reduce<React.ReactNode>((acc, mark) => {
    if (mark.type === "bold") return <strong>{acc}</strong>;
    if (mark.type === "italic") return <em>{acc}</em>;
    if (mark.type === "link" && typeof mark.attrs?.href === "string") {
      const href = mark.attrs.href as string;
      const isExternal = /^https?:\/\//.test(href);
      return (
        <Link
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          {acc}
        </Link>
      );
    }
    return acc;
  }, text);
}

function renderNode(node: JSONContent, key: number): React.ReactNode {
  const children = node.content?.map((child, index) => renderNode(child, index));

  switch (node.type) {
    case "doc":
      return <Fragment key={key}>{children}</Fragment>;
    case "paragraph":
      return <p key={key}>{children}</p>;
    case "heading": {
      const level = node.attrs?.level === 3 ? 3 : 2;
      return level === 3 ? (
        <h3 key={key}>{children}</h3>
      ) : (
        <h2 key={key}>{children}</h2>
      );
    }
    case "bulletList":
      return <ul key={key}>{children}</ul>;
    case "orderedList":
      return <ol key={key}>{children}</ol>;
    case "listItem":
      return <li key={key}>{children}</li>;
    case "blockquote":
      return <blockquote key={key}>{children}</blockquote>;
    case "hardBreak":
      return <br key={key} />;
    case "image": {
      const src = typeof node.attrs?.src === "string" ? node.attrs.src : null;
      const alt = typeof node.attrs?.alt === "string" ? node.attrs.alt : "";
      if (!src) return null;
      return (
        <Image
          key={key}
          src={src}
          alt={alt}
          width={800}
          height={450}
          sizes="(min-width: 768px) 700px, 100vw"
          style={{ width: "100%", height: "auto" }}
        />
      );
    }
    case "text":
      return (
        <Fragment key={key}>{renderMarks(node.text ?? "", node.marks)}</Fragment>
      );
    default:
      return children ? <Fragment key={key}>{children}</Fragment> : null;
  }
}

export function TiptapRenderer({ content }: { content: JSONContent }) {
  return <div className="prose-content">{renderNode(content, 0)}</div>;
}
