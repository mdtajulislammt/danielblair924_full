"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";

// Dynamically import JoditEditor with SSR disabled
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-44 animate-pulse rounded-lg flex items-center justify-center text-stone-500 text-sm">
      Loading Editor...
    </div>
  ),
});

interface EditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export const JoditEditorWrapper: React.FC<EditorProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || "Write your post content here...",
      theme: "dark",
      height: 220,
      toolbarAdaptive: false,
      buttons: [
        "bold",
        "italic",
        "underline",
        "|",
        "link",
        "unlink",
        "|",
        "undo",
        "redo",
      ],
      statusbar: false,
      showCharsCounter: false,
      showWordsCounter: false,
      about: false,
    }),
    [placeholder],
  );

  return (
    <div className="jodit-dark-theme-override w-full overflow-hidden rounded-lg border border-lime-800 [&_.jodit-about]:hidden">
      <JoditEditor
        value={value}
        config={config}
        onBlur={(newContent) => onChange(newContent)}
      />
    </div>
  );
};
