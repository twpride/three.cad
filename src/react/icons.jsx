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
      <g stroke="currentColor" strokeLinecap="round">
        <path
          d="M7.75 2.35a13 13 0 016.5 11.281"
          fill="none"
          strokeWidth={1.5}
        />
        <path
          fill="#fff"
          d="M.75 12.631h2v2h-2zM6.75 1.35h2v2h-2zM13.25 12.631h2v2h-2z"
        />
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
        <path d="M2 14l3-6h6l3-6" fill="none" strokeWidth={1.5} />
        <path
          fill="#fff"
          strokeLinecap="round"
          d="M1 13h2v2H1zM4 7h2v2H4zM10 7h2v2h-2zM13 1h2v2h-2z"
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
export { Arc, Dimension, Intersect, Line, Subtract, Union };