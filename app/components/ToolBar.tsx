import React, { useCallback, useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { Editor } from "@tiptap/react";
import {
  BoldIcon,
  Heading2,
  ItalicIcon,
  ListOrdered,
  Redo,
  StrikethroughIcon,
  Undo,
  LinkIcon,
  HighlighterIcon,
  UnlinkIcon,
} from "lucide-react";
import { ListBulletIcon } from "@radix-ui/react-icons";

const ToolBar = ({ editor }: { editor: Editor | null }) => {
  const [highlightColor, setHighlightColor] = useState("#d72d77");

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    if (url === null) {
      return;
    }

    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    // update link
    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;
  return (
    <div className="border border-input bg-transparent rounded-br-md">
      <Toggle
        size={"sm"}
        pressed={editor.isActive("heading")}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size={"sm"}
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <BoldIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size={"sm"}
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <ItalicIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size={"sm"}
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <StrikethroughIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size={"sm"}
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <ListBulletIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size={"sm"}
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>
      <Toggle size={"sm"} onPressedChange={() => editor.chain().focus().undo().run()}>
        <Undo className="h-4 w-4" />
      </Toggle>
      <Toggle size={"sm"} onPressedChange={() => editor.chain().focus().redo().run()}>
        <Redo className="h-4 w-4" />
      </Toggle>
      <Toggle size={"sm"} onPressedChange={() => setLink()} pressed={editor.isActive("link")}>
        <LinkIcon className="h-4 w-4" />
      </Toggle>
      <Toggle className=" inline" onPressedChange={() => editor.chain().focus().unsetLink().run()}>
        <UnlinkIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size={"sm"}
        pressed={editor.isActive("highlight", { color: highlightColor })}
        onPressedChange={() => editor.chain().focus().toggleHighlight({ color: highlightColor }).run()}
      >
        <HighlighterIcon className="h-4 w-4" />
      </Toggle>
      <input
        type="color"
        value={highlightColor}
        onChange={(e) => setHighlightColor(e.target.value)}
        className="ml-2 border rounded"
      />
    </div>
  );
};

export default ToolBar;
