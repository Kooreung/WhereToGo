import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftjsToHtml from "draftjs-to-html";

const Container = styled.div`
  width: 100%;
`;

const RowBox = styled.div`
  width: 100%;
  display: flex;
`;

const Viewer = styled.div`
  width: calc(50% - 40px);
  height: 400px;
  padding: 20px;
  margin-top: 20px;
  border: 2px solid gray;
`;

const Draft = ({ setContent }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [htmlString, setHtmlString] = useState("");
  const isMounted = useRef(false); // 마운트 상태 추적용 ref

  useEffect(() => {
    isMounted.current = true; // 컴포넌트 마운트됨
    return () => {
      isMounted.current = false; // 컴포넌트 언마운트됨
    };
  }, []);

  const updateTextDescription = async (state) => {
    setEditorState(state);
    const contentState = state.getCurrentContent();
    const html = draftjsToHtml(convertToRaw(contentState));
    setContent(html);
    setHtmlString(html);
  };

  const uploadCallback = () => {
    console.log("이미지 업로드");
  };

  return (
    <>
      <Container>
        <Editor
          placeholder="게시글을 작성해주세요"
          editorState={editorState}
          onEditorStateChange={updateTextDescription}
          toolbar={{
            image: { uploadCallback: uploadCallback },
          }}
          localization={{ locale: "ko" }}
          editorStyle={{
            height: "400px",
            width: "100%",
            border: "3px solid lightgray",
            padding: "20px",
          }}
        />
      </Container>
    </>
  );
};

export default Draft;