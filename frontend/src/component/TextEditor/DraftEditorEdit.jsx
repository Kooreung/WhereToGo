import React, { useEffect, useRef, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { ContentState, convertToRaw, EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftjsToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { Container } from "@chakra-ui/react";

const Draft = ({ prevContent, onContentChange }) => {
  const [editorState, setEditorState] = useState(() => {
    if (prevContent) {
      const contentBlock = htmlToDraft(prevContent);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks,
        );
        return EditorState.createWithContent(contentState);
      }
    }
    return EditorState.createEmpty();
  });
  const isMounted = useRef(false); // 마운트 상태 추적용 ref

  useEffect(() => {
    if (isMounted.current) return;
    isMounted.current = true; // 컴포넌트 마운트됨
    return () => {
      isMounted.current = false; // 컴포넌트 언마운트됨
    };
  }, []);

  const updateTextDescription = async (state) => {
    setEditorState(state);
    const contentState = state.getCurrentContent();
    const html = draftjsToHtml(convertToRaw(contentState));
    onContentChange(html);
  };

  const handlePastedFiles = (files) => {
    return "handled";
  };

  const handleDroppedFiles = (selection, files) => {
    return "handled";
  };

  return (
    <Container>
      <Editor
        placeholder="게시글을 작성해주세요"
        editorState={editorState}
        onEditorStateChange={updateTextDescription}
        handlePastedFiles={handlePastedFiles}
        handleDroppedFiles={handleDroppedFiles}
        localization={{ locale: "ko" }}
        editorStyle={{
          height: "400px",
          width: "100%",
          border: "3px solid lightgray",
          padding: "20px",
        }}
      />
    </Container>
  );
};

export default Draft;
