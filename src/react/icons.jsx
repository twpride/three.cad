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
      <g fill="#10b981">
        <path d="M73.722 130.313l182.524-105.41 182.524 105.41-182.524 105.409zM461.905 170.955l.025 210.775-182.548 105.366-.025-210.775zM232.618 487.096L50.07 381.73l.025-210.775 182.548 105.366z" />
      </g>
    </svg>
  );
}

function MouseLeft(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 105.833 169.333"
      height="1em"
      width="1em"
      {...props}
    >
      <path
        d="M46.56 30.571l-.001 9.986a11.89 11.89 0 00-7.912 11.225v21.404a11.865 11.865 0 0011.891 11.892h4.757a11.865 11.865 0 0011.891-11.892V51.782c0-5.209-3.315-9.615-7.959-11.23l-.031-9.981zm-3.157 0c-22.398 0-40.43 18.032-40.43 40.43v54.929c0 22.398 18.032 40.43 40.43 40.43H62.43c22.398 0 40.43-18.032 40.43-40.43V71c0-22.398-18.032-40.43-40.43-40.43z"
        fill="none"
        stroke="#fff"
        strokeWidth={5.946}
        strokeLinecap="round"
        paintOrder="markers stroke fill"
      />
      <path
        d="M35.648 40.523a35.596 35.596 0 00-24.352 33.852v23.307h41.62V92.71h-2.378c-10.505 0-19.131-8.629-19.131-19.132V52.173c0-4.456 1.625-8.462 4.241-11.65z"
        fill="#fff"
        paintOrder="markers stroke fill"
      />
    </svg>
  );
}

function MouseMiddle(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 105.833 169.333"
      height="1em"
      width="1em"
      {...props}
    >
      <path
        d="M46.56 30.571l-.001 9.986a11.89 11.89 0 00-7.912 11.225v21.404a11.865 11.865 0 0011.891 11.892h4.757a11.865 11.865 0 0011.891-11.892V51.782c0-5.209-3.315-9.615-7.959-11.23l-.031-9.981zm-3.157 0c-22.398 0-40.43 18.032-40.43 40.43v54.929c0 22.398 18.032 40.43 40.43 40.43H62.43c22.398 0 40.43-18.032 40.43-40.43V71c0-22.398-18.032-40.43-40.43-40.43z"
        fill="none"
        stroke="#fff"
        strokeWidth={5.946}
        strokeLinecap="round"
        paintOrder="markers stroke fill"
      />
      <rect
        width={13.081}
        height={29.728}
        x={46.376}
        y={47.757}
        rx={4.757}
        ry={4.757}
        fill="#fff"
        paintOrder="markers stroke fill"
      />
    </svg>
  );
}

function MouseRight(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 105.833 169.333"
      height="1em"
      width="1em"
      {...props}
    >
      <path
        d="M46.56 30.571l-.001 9.986a11.89 11.89 0 00-7.912 11.225v21.404a11.865 11.865 0 0011.891 11.892h4.757a11.865 11.865 0 0011.891-11.892V51.782c0-5.209-3.315-9.615-7.959-11.23l-.031-9.981zm-3.157 0c-22.398 0-40.43 18.032-40.43 40.43v54.929c0 22.398 18.032 40.43 40.43 40.43H62.43c22.398 0 40.43-18.032 40.43-40.43V71c0-22.398-18.032-40.43-40.43-40.43z"
        fill="none"
        stroke="#fff"
        strokeWidth={5.946}
        strokeLinecap="round"
        paintOrder="markers stroke fill"
      />
      <path
        d="M70.184 40.523a35.596 35.596 0 0124.352 33.852v23.307h-41.62V92.71h2.38c10.504 0 19.13-8.629 19.13-19.132V52.173c0-4.456-1.626-8.462-4.242-11.65z"
        fill="#fff"
        paintOrder="markers stroke fill"
      />
    </svg>
  );
}

function MouseScroll(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 105.833 169.333"
      height="1em"
      width="1em"
      {...props}
    >
      <path
        d="M46.56 30.571l-.001 9.986a11.89 11.89 0 00-7.912 11.225v21.404a11.865 11.865 0 0011.891 11.892h4.757a11.865 11.865 0 0011.891-11.892V51.782c0-5.209-3.315-9.615-7.959-11.23l-.031-9.981zm-3.157 0c-22.398 0-40.43 18.032-40.43 40.43v54.929c0 22.398 18.032 40.43 40.43 40.43H62.43c22.398 0 40.43-18.032 40.43-40.43V71c0-22.398-18.032-40.43-40.43-40.43z"
        fill="none"
        stroke="#fff"
        strokeWidth={5.946}
        strokeLinecap="round"
        paintOrder="markers stroke fill"
      />
      <path
        d="M42.607 14.547L52.95 4.204 63.226 14.48M52.95 25.827V4.204M42.607 101.655l10.343 10.342 10.276-10.275M52.95 90.374v21.623"
        fill="none"
        stroke="#fff"
        strokeWidth={5.946}
      />
    </svg>
  );
}

function Pan(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Pan"
      viewBox="0 0 24 24"
      className="prefix__StyledIcon-ofa7kd-0 prefix__dSCMyp"
      width="1em"
      height="1em"
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
        d="M12 2L8.314 5.686l1.239 1.239 1.57-1.571v5.77h-5.77l1.572-1.571-1.24-1.239L2 12l3.686 3.686 1.239-1.239-1.571-1.57h5.77v5.77l-1.571-1.572-1.239 1.24L12 22l3.686-3.686-1.239-1.239-1.57 1.571v-5.77h5.77l-1.572 1.571 1.24 1.239L22 12l-3.686-3.686-1.239 1.239 1.571 1.57h-5.77v-5.77l1.571 1.572 1.239-1.24z"
        color="currentColor"
        fontWeight={400}
        fontFamily="sans-serif"
        overflow="visible"
      />
    </svg>
  );
}

function Rotate(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-label="PowerCycle"
      viewBox="0 0 24 24"
      className="prefix__StyledIcon-ofa7kd-0 prefix__dSCMyp"
      width="1em"
      height="1em"
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
        d="M11.967 3C7.023 3 3 7.042 3 12h1.8c0-3.989 3.2-7.2 7.167-7.2 2.26 0 4.233 1.068 5.545 2.7H14.7v1.8H21V3h-1.8v3.81C17.572 4.53 14.969 3 11.967 3zm7.233 9c0 3.989-3.2 7.2-7.167 7.2-2.26 0-4.233-1.068-5.545-2.7H9.3v-1.8H3V21h1.8v-3.81C6.428 19.47 9.031 21 12.033 21 16.977 21 21 16.958 21 12z"
        color="currentColor"
        fontWeight={400}
        fontFamily="sans-serif"
        overflow="visible"
      />
    </svg>
  );
}

function Select(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="1em"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M17 5h-2V3h2v2zm-2 10v6l2.29-2.29 2.3 2.29L21 19.59l-2.29-2.29L21 15h-6zm4-6h2V7h-2v2zm0 4h2v-2h-2v2zm-8 8h2v-2h-2v2zM7 5h2V3H7v2zM3 17h2v-2H3v2zm2 4v-2H3c0 1.1.9 2 2 2zM19 3v2h2c0-1.1-.9-2-2-2zm-8 2h2V3h-2v2zM3 9h2V7H3v2zm4 12h2v-2H7v2zm-4-8h2v-2H3v2zm0-8h2V3c-1.1 0-2 .9-2 2z" />
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
export { Arc, Coincident, Dimension, Extrude, Flip, Horizontal, Intersect, Line, Logo, MouseLeft, MouseMiddle, MouseRight, MouseScroll, Pan, Rotate, Select, Stl, Subtract, Tangent, Union, Vertical };