import { useEffect, useRef } from "react";

export function ShadowDOM({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Create shadow root if it doesn't exist
      let shadow = containerRef.current.shadowRoot;
      if (!shadow) {
        shadow = containerRef.current.attachShadow({ mode: "open" });
      }

      // We inject an additional global style base to normalize the ebook content
      // and ensure it adapts to our current theme colors (which are CSS properties inherited)
      const baseStyles = `
        <style>
          :host {
            display: block;
            width: 100%;
            color: inherit;
            background: transparent;
            font-family: inherit;
            font-size: inherit;
            line-height: inherit;
          }
          /* Reset basic elements to inherit properties to fit the reader theme */
          body, p, div, span, h1, h2, h3, h4, h5, h6 {
             color: inherit;
             background: transparent !important;
             font-family: inherit;
          }
          body {
            margin: 0;
            padding: 0;
            max-width: 100%;
          }
          img {
            max-width: 100%;
            height: auto;
          }
          a {
            color: currentColor;
          }
        </style>
      `;

      shadow.innerHTML = baseStyles + html;
    }
  }, [html]);

  return <div ref={containerRef} className="w-full" />;
}
