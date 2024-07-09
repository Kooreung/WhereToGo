import React from "react";

export function ContentParser({ content }) {
  function parseHtmlToText(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    return doc.body.textContent || "";
  }

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: parseHtmlToText(content),
      }}
    />
  );
}

export default ContentParser;
