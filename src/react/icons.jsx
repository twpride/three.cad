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
      <g stroke="currentColor">
        <path
          d="M8.553 3.145a12.5 12.5 0 015.644 9.339"
          fill="none"
          strokeWidth={1.5}
        />
        <path
          strokeLinecap="round"
          d="M.75 12.631h2v2h-2zM6.75 1.35h2v2h-2zM13.25 12.631h2v2h-2z"
        />
      </g>
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
        <path d="M2.5 13l2-4M6 8h4m1.5-1l2-4" fill="none" strokeWidth={1.5} />
        <path
          strokeLinecap="round"
          d="M1 13h2v2H1zM4 7h2v2H4zM10 7h2v2h-2zM13 1h2v2h-2z"
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
      <text
        style={{
          lineHeight: 1.25,
        }}
        x={0.536}
        y={12.164}
        fontWeight={400}
        fontSize={12}
        fontFamily="sans-serif"
        letterSpacing={0}
        wordSpacing={0}
      >
        <tspan
          x={0.536}
          y={12.164}
          style={{
            InkscapeFontSpecification: "'Ubuntu Condensed, '",
          }}
          fontFamily="Ubuntu Condensed"
        >
          {"STL"}
        </tspan>
      </text>
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
export { Arc, Coincident, Dimension, Horizontal, Intersect, Intersect_thin, Line, Stl, Subtract, Union, Union_thin, Vertical };