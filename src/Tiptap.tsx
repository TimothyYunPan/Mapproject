import "./styles.css";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import { pointListType } from "./App";
import styled from "styled-components";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, H1, H2, H3, H4, H5, ListNumbers, Menu } from "tabler-icons-react";

const MenuBarStyle = styled.div`
  /* border: 1px solid white; */
  justify-content: space-between;
  display: flex;
  border-bottom: 1px solid white;
  padding: 8px 4px;
`;

const TipTapBox = styled.div`
  padding: 2px 10px;
  *:focus {
    outline: none;
  }
`;

const MenuBar = ({ editor }: any) => {
  if (!editor) {
    return null;
  }

  return (
    <>
      <MenuBarStyle>
        <Bold onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive("bold") ? "is-active" : ""}>
          bold
        </Bold>
        <Italic onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive("italic") ? "is-active" : ""}>
          italic
        </Italic>
        <H1 onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}>
          h2
        </H1>
        <H2 onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} className={editor.isActive("heading", { level: 4 }) ? "is-active" : ""}>
          h4
        </H2>
        <H3 onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()} className={editor.isActive("heading", { level: 5 }) ? "is-active" : ""}>
          h2
        </H3>
        <ListNumbers onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive("orderedList") ? "is-active" : ""}>
          ordered list
        </ListNumbers>
        <Menu onClick={() => editor.chain().focus().setHorizontalRule().run()}>horizontal rule</Menu>
      </MenuBarStyle>
    </>
  );
};

const Tiptap = ({ setPointNotes, pointList, pointIndex }: { setPointNotes: React.Dispatch<React.SetStateAction<string>>; pointList: pointListType[]; pointIndex: number }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start type something...",
      }),
    ],
    content: `
    ${pointList && pointList[pointIndex].notes}
    `,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setPointNotes(html);
    },
  });

  return (
    <TipTapBox>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="ProseMirror" />
    </TipTapBox>
  );
};

export default Tiptap;
