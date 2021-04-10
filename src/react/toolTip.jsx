import React, { useEffect, useRef, useState } from 'react';

export const ToolTip = () => {
  /**
   * Fires when new element is mouseovered, checks if it has a tooltip attribute
   * If it does, updates and unhides tooltip element after a preset timeout.
   * The timout is reset if user moves off of the tooltipped element
   * 
   * Unfortunately, new mouseover fires for svg children, which clears the
   * tooltip state. We add hacky lines labelled svg workaround to bubbleup / ignore
   * svg children mouseovers. We use prevTooltip ref check if new svg
   * child mouseover is novel. If it's not, we ignore the event
   */

  const [text, setText] = useState(null)

  const ref = useRef()

  const activated = useRef(false)
  const timeout = useRef(null)

  const prevTooltip = useRef(null)                        // svg workaround

  useEffect(() => {

    const svgChildren = ['path', 'g', 'rect', 'circle'];  // svg workaround

    document.addEventListener('mouseover', (e) => {
      let node = e.target;

      while (svgChildren.includes(node.nodeName)) {       // svg workaround
        node = node.parentElement                         // svg workaround
      }                                                   // svg workaround

      const tooltip = node.getAttribute("tooltip")

      if (tooltip == prevTooltip.current) return          // svg workaround
      prevTooltip.current = tooltip                       // svg workaround

      clearTimeout(timeout.current)
      if (tooltip) {
        let { left, top, width, height } = node.getBoundingClientRect()
        left = left + width / 2 - getTextWidth(tooltip) / 2 - 4 // 4 is padding
        top = top + height + 6 // 6 is arrow height/width
        setText(tooltip)
        if (activated.current) {
          ref.current.setAttribute('style', `left:${left}px; top:${top}px; visibility:visible`)
        } else {
          timeout.current = setTimeout(() => {
            ref.current.setAttribute('style', `left:${left}px; top:${top}px; visibility:visible`)
            activated.current = true
          }, 1000);
        }
      } else {
        ref.current.setAttribute('style', `visibility:hidden`)
        activated.current = false
      }
    })
  }, [])


  return <div className="tooltip" ref={ref}>
    {text}
    <div className="arrow"></div>
  </div>

}


function getTextWidth(text, font = "16px sans-serif") {
  // https://stackoverflow.com/a/21015393
  // re-use canvas object for better performance
  let canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
  let context = canvas.getContext("2d");
  context.font = font;
  let metrics = context.measureText(text);
  return metrics.width;
}
