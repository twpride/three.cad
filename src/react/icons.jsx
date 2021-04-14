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
export { Arc, Coincident, Dimension, Extrude, Extrude_master, Horizontal, Intersect, Intersect_thin, Line, Stl, Subtract, Tangent, Union, Union_thin, Vertical };