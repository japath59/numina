'use client';

import Script from "next/script";

export default function WatsonChat() {
  return (
    <Script id="watsonx-chat" strategy="afterInteractive">
      {`
        window.watsonAssistantChatOptions = {
          integrationID: "7d7d7e02-39af-473b-a108-fbd529fe8ac7",
          region: "us-east",
          serviceInstanceID: "0adcfa10-41f7-4d3e-a07d-b6b63eaa5c4c",
          onLoad: async (instance) => { await instance.render(); }
        };
        setTimeout(function(){
          const t = document.createElement('script');
          t.src = "https://web-chat.global.assistant.watson.appdomain.cloud/versions/" +
                  (window.watsonAssistantChatOptions.clientVersion || 'latest') +
                  "/WatsonAssistantChatEntry.js";
          document.head.appendChild(t);
        });
      `}
    </Script>
  );
}
