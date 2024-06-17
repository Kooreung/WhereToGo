import React, { useEffect, useRef, useState } from "react";
import { Box, Textarea } from "@chakra-ui/react";

function SmartEditor() {
  const [content, setContent] = useState("");
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);

  useEffect(() => {
    // 기존에 추가된 스크립트를 확인하고 삭제
    const existingScript = document.querySelector(
      `script[src="/lib/smarteditor/js/service/HuskyEZCreator.js"]`,
    );
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = `/lib/smarteditor/js/service/HuskyEZCreator.js`;
      script.async = true;
      document.body.appendChild(script);

      // 스마트에디터 초기화
      script.onload = () => {
        if (window.nhn && window.nhn.husky && window.nhn.husky.EZCreator) {
          window.nhn.husky.EZCreator.createInIFrame({
            oAppRef: [],
            elPlaceHolder: "smartEditor",
            sSkinURI: `/lib/smarteditor/SmartEditor2Skin.html`,
            fCreator: "createSEditor2",
          });
        }
      };

      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  return (
    <Box>
      <Textarea
        id="smartEditor"
        ref={editorRef}
        placeholder={"내용을 작성해주세요."}
        onChange={(e) => setContent(e.target.value)}
      />
    </Box>
  );
}

export default SmartEditor;
