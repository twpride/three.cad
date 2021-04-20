import * as React from "react";
function Arc(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        d="M3.92 1.94a12.5 12.5 0 014.454 1.71"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        d="M.75.75h2v2h-2zM13.25 13.25h2v2h-2zM9.433 4.336h2v2h-2z"
      />
      <rect width={0.8} height={4} x={1.35} y={12} ry={0} />
      <rect width={0.8} height={4} x={-14.65} ry={0} transform="rotate(-90)" />
      <path
        d="M12.113 7.26a12.5 12.5 0 011.983 5.035"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      />
    </svg>
  );
}

function Coincident(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      {...props}
    >
      <g stroke="currentColor">
        <path strokeLinecap="round" d="M7 7h2v2H7z" />
        <path
          d="M1.847 14.153l4.305-4.306M9.847 6.153l4.305-4.306"
          fill="none"
          strokeWidth={0.983}
        />
        <path d="M10.034 10.034l3.932 3.932" fill="none" strokeWidth={1.51} />
      </g>
    </svg>
  );
}

function Dimension(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="currentColor"
      className="prefix__bi prefix__bi-intersect"
      viewBox="0 0 16 16"
      {...props}
    >
      <defs>
        <marker
          id="prefix__a"
          refX={0}
          refY={0}
          orient="auto"
          overflow="visible"
        >
          <path
            d="M-1.154 0l1.73-1v2l-1.73-1z"
            fillRule="evenodd"
            stroke="currentColor"
            strokeWidth=".2pt"
            fill="currentColor"
          />
        </marker>
        <marker
          id="prefix__b"
          refX={0}
          refY={0}
          orient="auto"
          overflow="visible"
        >
          <path
            d="M1.154 0l-1.73 1v-2l1.73 1z"
            fillRule="evenodd"
            stroke="currentColor"
            strokeWidth=".2pt"
            fill="currentColor"
          />
        </marker>
      </defs>
      <path
        d="M4.009 10.009l6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        markerStart="url(#prefix__a)"
        markerEnd="url(#prefix__b)"
      />
      <path
        d="M15.485 4.516l-4-4M4.516 15.485l-4-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={0.893}
      />
    </svg>
  );
}

function Extrude(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 512 512"
      {...props}
    >
      <path
        style={{
          lineHeight: "normal",
          fontVariantLigatures: "normal",
          fontVariantPosition: "normal",
          fontVariantCaps: "normal",
          fontVariantNumeric: "normal",
          fontVariantAlternates: "normal",
          fontVariantEastAsian: "normal",
          fontFeatureSettings: "normal",
          fontVariationSettings: "normal",
          textIndent: 0,
          textAlign: "start",
          textDecorationLine: "none",
          textDecorationStyle: "solid",
          textDecorationColor: "#000",
          textTransform: "none",
          textOrientation: "mixed",
          whiteSpace: "normal",
          shapePadding: 0,
          shapeMargin: 0,
          inlineSize: 0,
          isolation: "auto",
          mixBlendMode: "normal",
          solidColor: "#000",
          solidOpacity: 1,
        }}
        d="M256 0L144 144h64v240h96V144.802l64-1.604z"
        color="currentColor"
        fontWeight={400}
        fontFamily="sans-serif"
        overflow="visible"
        fillRule="evenodd"
      />
      <path
        style={{
          lineHeight: "normal",
          fontVariantLigatures: "normal",
          fontVariantPosition: "normal",
          fontVariantCaps: "normal",
          fontVariantNumeric: "normal",
          fontVariantAlternates: "normal",
          fontVariantEastAsian: "normal",
          fontFeatureSettings: "normal",
          fontVariationSettings: "normal",
          textIndent: 0,
          textAlign: "start",
          textDecorationLine: "none",
          textDecorationStyle: "solid",
          textDecorationColor: "#000",
          textTransform: "none",
          textOrientation: "mixed",
          whiteSpace: "normal",
          shapePadding: 0,
          shapeMargin: 0,
          inlineSize: 0,
          isolation: "auto",
          mixBlendMode: "normal",
          solidColor: "#000",
          solidOpacity: 1,
        }}
        d="M176 302.768L10.059 369.145a16.002 16.002 0 00-.825 29.353l240 112a16.002 16.002 0 0013.532 0l240-112a16.002 16.002 0 00-.825-29.353L336 302.768v34.464l119.746 47.899L256 478.344 56.254 385.13 176 337.232v-34.464z"
        color="currentColor"
        fontWeight={400}
        fontFamily="sans-serif"
        overflow="visible"
      />
    </svg>
  );
}

function Extrude_master(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 512 512"
      {...props}
    >
      <path
        style={{
          lineHeight: "normal",
          fontVariantLigatures: "normal",
          fontVariantPosition: "normal",
          fontVariantCaps: "normal",
          fontVariantNumeric: "normal",
          fontVariantAlternates: "normal",
          fontVariantEastAsian: "normal",
          fontFeatureSettings: "normal",
          fontVariationSettings: "normal",
          textIndent: 0,
          textAlign: "start",
          textDecorationLine: "none",
          textDecorationStyle: "solid",
          textDecorationColor: "#000",
          textTransform: "none",
          textOrientation: "mixed",
          whiteSpace: "normal",
          shapePadding: 0,
          shapeMargin: 0,
          inlineSize: 0,
          isolation: "auto",
          mixBlendMode: "normal",
          solidColor: "#000",
          solidOpacity: 1,
        }}
        d="M256 0L144 144h64v240h96V144.802l64-1.604z"
        color="currentColor"
        fontWeight={400}
        fontFamily="sans-serif"
        overflow="visible"
        fillRule="evenodd"
      />
      <path
        d="M256 288L16 384l240 112 240-112z"
        fill="none"
        stroke="currentColor"
        strokeWidth={32}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M176 223.932h160v158.285H176z" />
    </svg>
  );
}

function Flip(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      {...props}
    >
      <path d="M14.87.102L4.968 4.346l2.129 2.127-6.952 6.994 1.418 1.408 6.948-6.988 2.115 2.115 4.242-9.9z" />
      <path
        d="M15.281 8.387l-3.999 4-.96-.961-1.96 4.573 4.574-1.96-.96-.96 3.998-4z"
        fillOpacity={0.7}
      />
    </svg>
  );
}

function Horizontal(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="currentColor"
      className="prefix__bi prefix__bi-intersect"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        d="M14.506 8.007l-13-.012"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      />
    </svg>
  );
}

function Icon_text(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 452.459 96"
      {...props}
    >
      <defs>
        <path id="prefix__a" d="M645.91 45.978h248.231v71.301H645.91z" />
      </defs>
      <g
        aria-label="three.cad"
        fontWeight={400}
        fontSize={40}
        fontFamily="Ubuntu Mono"
        letterSpacing={0}
        wordSpacing={0}
      >
        <path
          d="M123.53 39.048h14.207v5.002H123.53v15.656q0 2.537.362 4.132.363 1.594 1.16 2.609.87.942 2.175 1.305 1.304.362 3.189.362 2.61 0 4.204-.435 1.594-.435 3.044-1.16l.87 5.074q-1.015.435-3.262 1.16-2.174.725-5.436.725-3.77 0-6.161-.87-2.392-.87-3.77-2.61-1.304-1.739-1.811-4.276-.508-2.61-.508-6.016V44.05h-7.103v-5.002h7.103v-9.422l5.944-1.015zM147.304 72.68V23.465l6.016-1.015v17.106q1.45-.58 3.262-.87 1.812-.362 3.552-.362 3.841 0 6.378 1.16 2.61 1.087 4.132 3.116 1.522 2.03 2.174 4.856.653 2.827.653 6.234v18.99h-5.944V54.995q0-6.234-1.74-8.77-1.74-2.61-6.233-2.61-1.885 0-3.697.435-1.74.362-2.537.725V72.68zM186.155 72.68V40.86q7.393-2.536 14.931-2.536 2.32 0 4.422.217 2.102.145 4.639.725l-1.088 5.291q-2.319-.652-4.131-.797-1.74-.218-3.842-.218-4.421 0-8.988 1.233V72.68zM233.414 38.251q6.813 0 10.51 4.277 3.696 4.204 3.696 12.829v2.102h-24.064q.362 5.219 3.407 7.973 3.116 2.682 8.698 2.682 3.189 0 5.436-.507 2.247-.508 3.406-1.088l.798 5.074q-1.087.58-3.914 1.232-2.827.653-6.379.653-4.349 0-7.683-1.305-3.262-1.377-5.436-3.697-2.175-2.319-3.262-5.508-1.087-3.262-1.087-7.031 0-4.494 1.377-7.828 1.377-3.334 3.624-5.509 2.247-2.174 5.074-3.262 2.827-1.087 5.799-1.087zm8.118 14.352q0-4.277-2.247-6.741-2.247-2.537-5.944-2.537-2.102 0-3.841.797-1.668.797-2.9 2.102-1.232 1.305-1.957 2.972-.725 1.667-.942 3.407zM269.655 38.251q6.813 0 10.51 4.277 3.697 4.204 3.697 12.829v2.102h-24.065q.363 5.219 3.407 7.973 3.117 2.682 8.698 2.682 3.19 0 5.436-.507 2.247-.508 3.407-1.088l.797 5.074q-1.087.58-3.914 1.232-2.827.653-6.378.653-4.35 0-7.684-1.305-3.261-1.377-5.436-3.697-2.174-2.319-3.262-5.508-1.087-3.262-1.087-7.031 0-4.494 1.377-7.828 1.378-3.334 3.624-5.509 2.247-2.174 5.074-3.262 2.827-1.087 5.799-1.087zm8.118 14.352q0-4.277-2.247-6.741-2.247-2.537-5.944-2.537-2.102 0-3.841.797-1.667.797-2.9 2.102-1.232 1.305-1.957 2.972-.724 1.667-.942 3.407zM310.608 68.042q0 2.174-1.45 3.841-1.45 1.667-3.842 1.667-2.464 0-3.914-1.667-1.45-1.667-1.45-3.841 0-2.247 1.45-3.915 1.45-1.667 3.914-1.667 2.392 0 3.842 1.667 1.45 1.668 1.45 3.915zM326.916 55.937q0-4.567 1.45-7.9 1.45-3.335 3.986-5.51 2.537-2.174 5.871-3.189 3.407-1.087 7.249-1.087 2.464 0 4.856.362 2.465.29 5.219 1.16l-1.377 5.146q-2.392-.87-4.422-1.087-1.957-.29-3.986-.29-2.61 0-4.93.725-2.319.652-4.058 2.175-1.667 1.45-2.682 3.841-1.015 2.32-1.015 5.654 0 3.19.942 5.509.943 2.247 2.61 3.769 1.74 1.45 4.131 2.174 2.392.725 5.292.725 2.32 0 4.421-.217 2.175-.29 4.711-1.16l.87 5.001q-2.537.942-5.146 1.305-2.61.435-5.654.435-4.059 0-7.465-1.088-3.335-1.16-5.8-3.334-2.391-2.174-3.768-5.436-1.305-3.334-1.305-7.683zM378.089 68.404q2.247 0 3.986-.145 1.813-.145 2.972-.362V57.894q-1.16-.362-2.827-.58-1.594-.217-3.406-.217-1.667 0-3.262.29-1.595.217-2.827.87-1.232.652-2.03 1.739-.797 1.015-.797 2.61 0 3.261 2.175 4.566 2.247 1.232 6.016 1.232zm-.58-30.153q3.77 0 6.306.942 2.61.943 4.204 2.61 1.595 1.667 2.247 4.059.652 2.392.652 5.219V72.1q-2.102.362-5.58.87-3.407.507-7.032.507-2.754 0-5.363-.508-2.61-.435-4.64-1.594-2.029-1.232-3.261-3.334-1.232-2.102-1.232-5.364 0-2.9 1.232-4.857 1.305-2.03 3.262-3.261 2.03-1.233 4.566-1.74 2.61-.58 5.219-.58 3.552 0 6.958.798V51.37q0-1.522-.362-2.899-.29-1.45-1.232-2.61-.87-1.159-2.465-1.811-1.522-.725-3.986-.725-3.117 0-5.437.435-2.319.435-3.551.87l-.725-4.93q1.232-.58 4.059-1.014 2.9-.435 6.161-.435zM420.926 46.152q-1.015-.943-2.972-1.74-1.957-.87-4.059-.87-2.392 0-4.131.943-1.667.942-2.755 2.609-1.087 1.595-1.594 3.914-.508 2.247-.508 4.856 0 5.872 2.755 9.06 2.754 3.19 7.176 3.19 2.247 0 3.769-.217 1.594-.218 2.32-.435zm0-22.687l6.016-1.015v49.288q-1.957.58-5.001 1.16-3.044.58-7.103.58-3.625 0-6.596-1.232-2.972-1.233-5.074-3.48-2.102-2.32-3.262-5.58-1.16-3.263-1.16-7.322 0-3.914.943-7.103 1.014-3.262 2.899-5.581 1.885-2.32 4.494-3.624 2.682-1.305 6.089-1.305 2.681 0 4.71.652 2.03.653 3.045 1.378z"
          style={{
            InkscapeFontSpecification: "'Ubuntu Mono'",
          }}
        />
      </g>
      <g fill="#34d399" fillOpacity={0.698}>
        <path d="M27.588 28.931l27.693-15.992L82.973 28.93 55.28 44.923zM86.483 35.097l.004 31.979L58.79 83.06l-.004-31.978zM51.696 83.061L24 67.076l.004-31.979L51.7 51.083z" />
      </g>
    </svg>
  );
}

function Intersect(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="currentColor"
      className="prefix__bi prefix__bi-intersect"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        d="M5.55 5.5c-.018.166-.05.329-.05.5 0 2.491 2.009 4.5 4.5 4.5.171 0 .334-.032.5-.05V6c0-.286-.214-.5-.5-.5z"
        fill="currentColor"
        fillOpacity={0.7}
      />
      <rect
        width={10}
        height={10}
        x={1}
        y={5}
        rx={1}
        ry={1}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <circle
        cx={10}
        cy={6}
        r={5}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

function Intersect_thin(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="currentColor"
      className="prefix__bi prefix__bi-intersect"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        d="M5.11 5.092c-.02.195-.059.384-.059.584a5.244 5.244 0 005.254 5.253c.2 0 .39-.037.583-.059V5.676a.57.57 0 00-.583-.584z"
        fill="currentColor"
        fillOpacity={0.7}
      />
      <rect
        width={10}
        height={10}
        x={1}
        y={5}
        rx={1}
        ry={1}
        fill="none"
        stroke="currentColor"
        strokeWidth={0.6}
        strokeLinecap="round"
      />
      <circle
        cx={10}
        cy={6}
        r={5}
        fill="none"
        stroke="currentColor"
        strokeWidth={0.6}
        strokeLinecap="round"
      />
    </svg>
  );
}

function Line(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      {...props}
    >
      <g stroke="currentColor">
        <path
          d="M2.75 11.75l1.5-4.5m2.5-.5l2.5 2.5m2.5-.5l1.5-4.5"
          fill="none"
          strokeWidth={1.5}
        />
        <path
          strokeLinecap="round"
          d="M1 13h2v2H1zM4 4h2v2H4zM10 10h2v2h-2zM13 1h2v2h-2z"
        />
      </g>
    </svg>
  );
}

function Logo(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 512 512"
      {...props}
    >
      <g fill="#34d399" fillOpacity={0.698}>
        <path d="M73.722 130.313l182.524-105.41 182.524 105.41-182.524 105.409zM461.905 170.955l.025 210.775-182.548 105.366-.025-210.775zM232.618 487.096L50.07 381.73l.025-210.775 182.548 105.366z" />
      </g>
    </svg>
  );
}

function Stl(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      {...props}
    >
      <g
        aria-label="STL"
        style={{
          lineHeight: 1.25,
        }}
        fontWeight={400}
        fontSize={12}
        fontFamily="Ubuntu Condensed"
        letterSpacing={0}
        wordSpacing={0}
      >
        <path
          d="M2.576 11.42q.648 0 .996-.36.36-.36.36-.972 0-.324-.108-.576-.108-.252-.288-.456-.168-.204-.396-.372t-.468-.336q-.276-.192-.576-.408-.3-.216-.552-.504-.24-.288-.396-.672-.156-.384-.156-.9 0-.504.168-.912.18-.408.48-.696.312-.288.732-.444.432-.156.924-.156.48 0 .888.12.408.12.684.288l-.336.852q-.252-.168-.552-.252-.288-.096-.612-.096-.588 0-.948.324-.348.312-.348.924 0 .336.108.588.12.252.3.456.192.204.432.372.252.168.528.348.276.18.564.396.288.216.516.504.24.276.384.66.156.372.156.888 0 .468-.144.888t-.456.744q-.3.312-.768.504-.456.18-1.08.18-.576 0-1.008-.132-.432-.132-.768-.348L1.172 11q.312.192.636.312.336.108.768.108zM10.28 3.848v.924H8.432v7.392h-1.08V4.772H5.504v-.924zM15.164 11.24v.924h-3.708V3.848h1.08v7.392z"
          style={{
            InkscapeFontSpecification: "'Ubuntu Condensed, '",
          }}
        />
      </g>
    </svg>
  );
}

function Subtract(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="currentColor"
      className="prefix__bi prefix__bi-intersect"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        d="M2 5.5c-.286 0-.5.214-.5.5v8c0 .286.214.5.5.5h8c.286 0 .5-.214.5-.5v-2.525a5.504 5.504 0 01-.5.025A5.508 5.508 0 014.5 6c0-.169.01-.335.025-.5z"
        fill="currentColor"
        fillOpacity={0.7}
      />
      <rect
        width={10}
        height={10}
        x={1}
        y={5}
        rx={1}
        ry={1}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <circle
        cx={10}
        cy={6}
        r={5}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

function Tangent(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      {...props}
    >
      <g fill="none" stroke="currentColor">
        <path d="M1.497 15.004l13.847-8.686" strokeWidth={2} />
        <circle
          cx={5.25}
          cy={5.25}
          r={4.5}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

function Union(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="currentColor"
      className="prefix__bi prefix__bi-intersect"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        d="M5.55 5.5c-.018.166-.05.329-.05.5 0 2.491 2.009 4.5 4.5 4.5.171 0 .334-.032.5-.05V6c0-.286-.214-.5-.5-.5z"
        fill="currentColor"
        fillOpacity={0.7}
      />
      <path
        d="M2 5.5c-.286 0-.5.214-.5.5v8c0 .286.214.5.5.5h8c.286 0 .5-.214.5-.5v-2.525a5.504 5.504 0 01-.5.025A5.508 5.508 0 014.5 6c0-.169.01-.335.025-.5zM10 1.5a4.477 4.477 0 00-4.225 3H10c.822 0 1.5.678 1.5 1.5v4.225A4.477 4.477 0 0014.5 6c0-2.491-2.009-4.5-4.5-4.5z"
        fill="currentColor"
        fillOpacity={0.7}
      />
      <rect
        width={10}
        height={10}
        x={1}
        y={5}
        rx={1}
        ry={1}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <circle
        cx={10}
        cy={6}
        r={5}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

function Union_thin(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="currentColor"
      className="prefix__bi prefix__bi-intersect"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        d="M5.383 5.33c-.02.178-.054.352-.054.535a4.81 4.81 0 004.818 4.818c.183 0 .357-.034.535-.054V5.865a.523.523 0 00-.535-.535z"
        fill="currentColor"
        fillOpacity={0.7}
      />
      <path
        d="M1.9 4.899a.529.529 0 00-.542.541v8.663c0 .309.232.541.541.541h8.663c.309 0 .541-.232.541-.541v-2.735a5.962 5.962 0 01-.541.028A5.964 5.964 0 014.606 5.44c0-.183.011-.362.028-.541zM9.815 1.317c-2.114 0-3.887 1.351-4.553 3.233h4.553c.887 0 1.617.73 1.617 1.617v4.552c1.882-.666 3.233-2.438 3.233-4.552a4.842 4.842 0 00-4.85-4.85z"
        fill="currentColor"
        fillOpacity={0.7}
      />
      <rect
        width={10}
        height={10}
        x={1}
        y={5}
        rx={1}
        ry={1}
        fill="none"
        stroke="currentColor"
        strokeWidth={0.9}
        strokeLinecap="round"
      />
      <circle
        cx={10}
        cy={6}
        r={5}
        fill="none"
        stroke="currentColor"
        strokeWidth={0.9}
        strokeLinecap="round"
      />
    </svg>
  );
}

function Vertical(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="currentColor"
      className="prefix__bi prefix__bi-intersect"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        d="M8.012 1.5L8 14.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      />
    </svg>
  );
}
export { Arc, Coincident, Dimension, Extrude, Extrude_master, Flip, Horizontal, Icon_text, Intersect, Intersect_thin, Line, Logo, Stl, Subtract, Tangent, Union, Union_thin, Vertical };