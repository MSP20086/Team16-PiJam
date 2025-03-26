import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";

const WordCloudComponent = ({ wordData }) => {
  const [words, setWords] = useState([]);
  const svgRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    // Convert object to array format
    const dataArray = Object.entries(wordData || {}).map(([text, value]) => ({
      text,
      value
    }));

    if (!dataArray || dataArray.length === 0) return;

    const validWordData = dataArray
      .map(d => ({ text: d.text, value: +d.value }))
      .filter(d => !isNaN(d.value));

    if (validWordData.length === 0) return;

    const minSize = 20, maxSize = 100;
    const values = validWordData.map(d => d.value);
    const domainMin = Math.min(...values);
    const domainMax = Math.max(...values);

    const scale = d3.scaleLinear()
      .domain([domainMin, domainMax])
      .range([minSize, maxSize]);

    const formattedWords = validWordData.map(d => ({
      text: d.text,
      size: scale(d.value)
    }));

    const layout = cloud()
      .size([600, 400])
      .words(formattedWords)
      .padding(5)
      .font("sans-serif")
      .rotate(() => (Math.random() > 0.5 ? 0 : 90))
      .fontSize(d => d.size)
      .on("end", (words) => {
        if (isMounted) setWords(words);
      });

    layout.start();

    return () => { isMounted = false; };
  }, [wordData]);

  return (
    <div>
      <h1>Word Cloud Visualization</h1>
      <svg ref={svgRef} width={600} height={400}>
        <g transform="translate(300,200)">
          {words.map((d, i) => (
            <text
              key={`${d.text}-${i}`}
              fontSize={d.size}
              fontFamily="sans-serif"
              fill={d3.schemeCategory10[i % 10]}
              textAnchor="middle"
              transform={`translate(${d.x}, ${d.y}) rotate(${d.rotate})`}
            >
              {d.text}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
};

export default WordCloudComponent;