import React, { useState, useRef, useEffect } from "react";

const Tooltip = ({ 
  children, 
  content, 
  position = "top", 
  delay = 300 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  let timer = null;
  
  const showTooltip = () => {
    timer = setTimeout(() => {
      if (triggerRef.current && tooltipRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        const scrollX = window.scrollX || document.documentElement.scrollLeft;
        
        let top = 0;
        let left = 0;
        
        switch (position) {
          case "top":
            top = triggerRect.top + scrollY - tooltipRect.height - 10;
            left = triggerRect.left + scrollX + (triggerRect.width / 2) - (tooltipRect.width / 2);
            break;
          case "bottom":
            top = triggerRect.bottom + scrollY + 10;
            left = triggerRect.left + scrollX + (triggerRect.width / 2) - (tooltipRect.width / 2);
            break;
          case "left":
            top = triggerRect.top + scrollY + (triggerRect.height / 2) - (tooltipRect.height / 2);
            left = triggerRect.left + scrollX - tooltipRect.width - 10;
            break;
          case "right":
            top = triggerRect.top + scrollY + (triggerRect.height / 2) - (tooltipRect.height / 2);
            left = triggerRect.right + scrollX + 10;
            break;
          default:
            top = triggerRect.top + scrollY - tooltipRect.height - 10;
            left = triggerRect.left + scrollX + (triggerRect.width / 2) - (tooltipRect.width / 2);
        }
        
        setCoords({ top, left });
        setIsVisible(true);
      }
    }, delay);
  };
  
  const hideTooltip = () => {
    clearTimeout(timer);
    setIsVisible(false);
  };
  
  useEffect(() => {
    return () => {
      clearTimeout(timer);
    };
  }, []);
  
  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-50 px-3 py-2 text-sm text-white bg-gray-800 rounded-md shadow-lg pointer-events-none"
          style={{
            top: `${coords.top}px`,
            left: `${coords.left}px`
          }}
        >
          {content}
          <div
            className={`absolute w-2 h-2 bg-gray-800 transform rotate-45 ${
              position === "top" ? "bottom-0 -mb-1 left-1/2 -ml-1" :
              position === "bottom" ? "top-0 -mt-1 left-1/2 -ml-1" :
              position === "left" ? "right-0 -mr-1 top-1/2 -mt-1" :
              "left-0 -ml-1 top-1/2 -mt-1"
            }`}
          />
        </div>
      )}
    </>
  );
};

export default Tooltip;