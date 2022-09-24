import "./styles.css";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import { pointListType } from "./App";

const MenuBar = ({ editor }: any) => {
  if (!editor) {
    return null;
  }

  return (
    <>
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive("bold") ? "is-active" : ""}>
        bold
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive("italic") ? "is-active" : ""}>
        italic
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}>
        h1
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}>
        h3
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()} className={editor.isActive("heading", { level: 6 }) ? "is-active" : ""}>
        h6
      </button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive("orderedList") ? "is-active" : ""}>
        ordered list
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>horizontal rule</button>
      <button onClick={() => editor.chain().focus().undo().run()}>undo</button>
      <button onClick={() => editor.chain().focus().redo().run()}>redo</button>
    </>
  );
};

const Tiptap = ({ setPointNotes, pointList, pointIndex }: { setPointNotes: React.Dispatch<React.SetStateAction<string>>; pointList: pointListType[]; pointIndex: number }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: `
    ${pointList && pointList[pointIndex].notes}
    `,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setPointNotes(html);
    },
  });

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
