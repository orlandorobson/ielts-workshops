const SVG_NS = "http://www.w3.org/2000/svg";

function svgElement(name, attributes = {}, text = "") {
  const element = document.createElementNS(SVG_NS, name);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  if (text !== "") element.textContent = text;
  return element;
}

function makeSvg(viewBox, label, className = "") {
  return svgElement("svg", { viewBox, role: "img", "aria-label": label, class: className });
}

function appendWrappedText(svg, text, x, y, options = {}) {
  const { width = 15, lineHeight = 14, className = "", anchor = "middle" } = options;
  const words = text.split(" ");
  const lines = [];
  let line = "";
  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > width && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  });
  if (line) lines.push(line);
  const node = svgElement("text", { x, y, "text-anchor": anchor, class: className });
  lines.forEach((value, index) => node.append(svgElement("tspan", { x, dy: index ? lineHeight : 0 }, value)));
  svg.append(node);
  return node;
}

function renderLine(task, compact) {
  const dataDescription = task.data.series.map((series) => `${series.label}: ${task.data.years.map((year, index) => `${year}, ${series.values[index]}%`).join("; ")}`).join(". ");
  const svg = makeSvg("0 0 760 430", `${task.title}. ${task.axisLabel}. ${dataDescription}`, "explorer-chart explorer-line-chart");
  const margin = { left: 70, right: 105, top: 38, bottom: 65 };
  const width = 760 - margin.left - margin.right;
  const height = 430 - margin.top - margin.bottom;
  const x = (index) => margin.left + (index / (task.data.years.length - 1)) * width;
  const y = (value) => margin.top + height - (value / 70) * height;
  [0, 10, 20, 30, 40, 50, 60, 70].forEach((value) => {
    svg.append(svgElement("line", { x1: margin.left, y1: y(value), x2: margin.left + width, y2: y(value), class: "explorer-grid" }));
    if (!compact) svg.append(svgElement("text", { x: margin.left - 12, y: y(value) + 4, "text-anchor": "end", class: "explorer-axis-label" }, value));
  });
  task.data.years.forEach((year, index) => {
    if (!compact) svg.append(svgElement("text", { x: x(index), y: 400, "text-anchor": "middle", class: "explorer-axis-label" }, year));
  });
  task.data.series.forEach((series, seriesIndex) => {
    const points = series.values.map((value, index) => `${x(index)},${y(value)}`).join(" ");
    svg.append(svgElement("polyline", { points, class: `explorer-line explorer-series-${seriesIndex + 1}` }));
    series.values.forEach((value, index) => {
      svg.append(svgElement("circle", { cx: x(index), cy: y(value), r: compact ? 4 : 5, class: `explorer-point explorer-series-${seriesIndex + 1}` }));
      if (!compact && (index === 0 || index === series.values.length - 1)) {
        svg.append(svgElement("text", { x: x(index), y: y(value) - 10, "text-anchor": "middle", class: "explorer-value" }, value));
      }
    });
    if (!compact) svg.append(svgElement("text", { x: margin.left + width + 14, y: y(series.values.at(-1)) + 4, class: `explorer-series-label explorer-series-${seriesIndex + 1}` }, series.label));
  });
  if (!compact) {
    svg.append(svgElement("text", { x: 22, y: 235, transform: "rotate(-90 22 235)", "text-anchor": "middle", class: "explorer-axis-title" }, task.axisLabel));
  }
  return svg;
}

function renderBar(task, compact) {
  const dataDescription = task.data.categories.map((category, index) => `${category}: ${task.data.series.map((series) => `${series.label}, ${series.values[index]}`).join("; ")}`).join(". ");
  const svg = makeSvg("0 0 820 460", `${task.title}. ${task.axisLabel}. ${dataDescription}`, "explorer-chart explorer-bar-chart");
  const margin = { left: 62, right: 25, top: 72, bottom: 92 };
  const width = 820 - margin.left - margin.right;
  const height = 460 - margin.top - margin.bottom;
  const max = 70;
  const y = (value) => margin.top + height - (value / max) * height;
  [0, 10, 20, 30, 40, 50, 60, 70].forEach((value) => {
    svg.append(svgElement("line", { x1: margin.left, y1: y(value), x2: margin.left + width, y2: y(value), class: "explorer-grid" }));
    if (!compact) svg.append(svgElement("text", { x: margin.left - 10, y: y(value) + 4, "text-anchor": "end", class: "explorer-axis-label" }, value));
  });
  const groupWidth = width / task.data.categories.length;
  const barWidth = Math.min(24, groupWidth / 4);
  task.data.categories.forEach((category, categoryIndex) => {
    task.data.series.forEach((series, seriesIndex) => {
      const value = series.values[categoryIndex];
      const barHeight = (value / max) * height;
      const left = margin.left + categoryIndex * groupWidth + groupWidth / 2 - (task.data.series.length * barWidth) / 2 + seriesIndex * barWidth;
      svg.append(svgElement("rect", { x: left, y: y(value), width: barWidth - 2, height: barHeight, class: `explorer-bar explorer-series-${seriesIndex + 1}` }));
      if (!compact) svg.append(svgElement("text", { x: left + (barWidth - 2) / 2, y: y(value) - 6, "text-anchor": "middle", class: "explorer-value" }, value));
    });
    if (!compact) appendWrappedText(svg, category, margin.left + categoryIndex * groupWidth + groupWidth / 2, 392, { width: 12, lineHeight: 13, className: "explorer-axis-label" });
  });
  if (!compact) {
    task.data.series.forEach((series, index) => {
      const legendX = 210 + index * 155;
      svg.append(svgElement("rect", { x: legendX, y: 25, width: 16, height: 16, class: `explorer-series-${index + 1}` }));
      svg.append(svgElement("text", { x: legendX + 23, y: 38, class: "explorer-legend-label" }, series.label));
    });
    svg.append(svgElement("text", { x: 20, y: 245, transform: "rotate(-90 20 245)", "text-anchor": "middle", class: "explorer-axis-title" }, task.axisLabel));
  }
  return svg;
}

function polarPoint(cx, cy, radius, angle) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return [cx + radius * Math.cos(radians), cy + radius * Math.sin(radians)];
}

function piePath(cx, cy, radius, startAngle, endAngle) {
  const [startX, startY] = polarPoint(cx, cy, radius, endAngle);
  const [endX, endY] = polarPoint(cx, cy, radius, startAngle);
  return `M ${cx} ${cy} L ${startX} ${startY} A ${radius} ${radius} 0 ${endAngle - startAngle > 180 ? 1 : 0} 0 ${endX} ${endY} Z`;
}

function renderPie(task, compact) {
  const dataDescription = task.data.periods.map((period) => `${period.label}: ${task.data.categories.map((category, index) => `${category}, ${period.values[index]}%`).join("; ")}`).join(". ");
  const svg = makeSvg("0 0 820 470", `${task.title}. ${dataDescription}`, "explorer-chart explorer-pie-chart");
  const centres = compact ? [[220, 210], [600, 210]] : [[190, 195], [520, 195]];
  const radius = compact ? 125 : 118;
  task.data.periods.forEach((period, periodIndex) => {
    let angle = 0;
    period.values.forEach((value, categoryIndex) => {
      const nextAngle = angle + value * 3.6;
      svg.append(svgElement("path", { d: piePath(centres[periodIndex][0], centres[periodIndex][1], radius, angle, nextAngle), class: `explorer-slice explorer-slice-${categoryIndex + 1}` }));
      if (!compact) {
        const [labelX, labelY] = polarPoint(centres[periodIndex][0], centres[periodIndex][1], radius * 0.68, angle + (nextAngle - angle) / 2);
        svg.append(svgElement("text", { x: labelX, y: labelY, "text-anchor": "middle", class: "explorer-pie-value" }, `${categoryIndex + 1} · ${value}%`));
      }
      angle = nextAngle;
    });
    if (!compact) svg.append(svgElement("text", { x: centres[periodIndex][0], y: 350, "text-anchor": "middle", class: "explorer-period-label" }, period.label));
  });
  if (!compact) {
    task.data.categories.forEach((category, index) => {
      const x = 670;
      const y = 85 + index * 42;
      svg.append(svgElement("rect", { x, y: y - 13, width: 16, height: 16, class: `explorer-slice-${index + 1}` }));
      svg.append(svgElement("text", { x: x + 24, y, class: "explorer-legend-label" }, `${index + 1}. ${category}`));
    });
  }
  return svg;
}

function renderTable(task, compact) {
  if (compact) {
    const svg = makeSvg("0 0 600 330", task.title, "explorer-chart explorer-table-preview");
    for (let row = 0; row < 5; row += 1) {
      for (let column = 0; column < 5; column += 1) {
        svg.append(svgElement("rect", { x: 12 + column * 115, y: 12 + row * 61, width: 110, height: 56, class: row === 0 ? "explorer-table-head" : "explorer-table-cell" }));
      }
    }
    return svg;
  }
  const wrapper = document.createElement("div");
  wrapper.className = "explorer-table-wrap";
  const table = document.createElement("table");
  table.className = "explorer-data-table";
  const caption = document.createElement("caption");
  caption.textContent = task.title;
  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  task.data.columns.forEach((column) => {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = column;
    headRow.append(th);
  });
  thead.append(headRow);
  const tbody = document.createElement("tbody");
  task.data.rows.forEach((values) => {
    const row = document.createElement("tr");
    values.forEach((value, index) => {
      const cell = document.createElement(index === 0 ? "th" : "td");
      if (index === 0) cell.scope = "row";
      cell.textContent = value;
      row.append(cell);
    });
    tbody.append(row);
  });
  table.append(caption, thead, tbody);
  const note = document.createElement("p");
  note.className = "explorer-table-note";
  note.textContent = task.data.note;
  wrapper.append(table, note);
  return wrapper;
}

function mapLabel(svg, text, x, y, className = "map-text") {
  appendWrappedText(svg, text, x, y, { width: 13, lineHeight: 12, className });
}

function renderMapPeriod(year, compact) {
  const description = year === 2005
    ? "Housing and a market are west of the wadi; a single road leads from the northwest to a small fishing harbour east of the wadi; open land is extensive; the beach lies along the south coast."
    : "Housing and roads extend on both sides of the wadi; a bridge connects the sides; the market is larger; a hotel, cafés, car park and promenade appear near the waterfront; the fishing harbour is larger; the beach and wadi remain."
  const svg = makeSvg("0 0 360 300", `Map of the Al Noor waterfront in ${year}. North is inland and south is the Arabian Sea. ${description}`, "explorer-map-svg");
  svg.append(svgElement("rect", { x: 0, y: 0, width: 360, height: 245, class: "map-land" }));
  svg.append(svgElement("path", { d: "M0 228 C75 211 135 235 205 220 C265 207 315 222 360 210 L360 300 L0 300 Z", class: "map-sea" }));
  svg.append(svgElement("path", { d: "M210 0 C198 52 225 90 207 140 C192 181 216 205 205 224", class: "map-wadi" }));
  svg.append(svgElement("text", { x: 332, y: 283, "text-anchor": "end", class: "map-water-label" }, "Arabian Sea"));
  svg.append(svgElement("text", { x: 18, y: 22, class: "map-north" }, "N ↑"));
  svg.append(svgElement("text", { x: 238, y: 72, class: "map-water-label" }, "Wadi"));
  svg.append(svgElement("text", { x: 65, y: 247, class: "map-water-label" }, "Beach"));
  const roadClass = year === 2005 ? "map-road map-road-basic" : "map-road";
  svg.append(svgElement("path", { d: "M0 46 L92 88 L156 126 L208 149 L292 190", class: roadClass }));
  if (year === 2005) {
    [[55, 60], [83, 70], [110, 83], [74, 100]].forEach(([x, y]) => svg.append(svgElement("rect", { x, y, width: 24, height: 15, class: "map-house" })));
    svg.append(svgElement("rect", { x: 94, y: 120, width: 38, height: 23, class: "map-market" }));
    svg.append(svgElement("path", { d: "M276 205 L335 205 L342 235 L272 235 Z", class: "map-harbour" }));
    mapLabel(svg, "Housing", 78, 45);
    mapLabel(svg, "Market", 113, 157);
    mapLabel(svg, "Small fishing harbour", 303, 184);
    mapLabel(svg, "Open land", 286, 108);
    mapLabel(svg, "Open land", 85, 190);
  } else {
    [[38, 52], [66, 60], [94, 72], [51, 91], [118, 48], [148, 63], [235, 48], [265, 62], [294, 77], [245, 93], [278, 107]].forEach(([x, y]) => svg.append(svgElement("rect", { x, y, width: 22, height: 14, class: "map-house" })));
    svg.append(svgElement("path", { d: "M214 70 L290 132 L318 179", class: "map-road" }));
    svg.append(svgElement("path", { d: "M112 117 L165 165 L255 174", class: "map-road" }));
    svg.append(svgElement("line", { x1: 184, y1: 142, x2: 230, y2: 157, class: "map-bridge" }));
    svg.append(svgElement("circle", { cx: 286, cy: 151, r: 16, class: "map-roundabout" }));
    svg.append(svgElement("rect", { x: 91, y: 121, width: 51, height: 30, class: "map-market" }));
    svg.append(svgElement("rect", { x: 70, y: 177, width: 48, height: 28, class: "map-hotel" }));
    svg.append(svgElement("rect", { x: 130, y: 184, width: 42, height: 21, class: "map-cafe" }));
    svg.append(svgElement("rect", { x: 235, y: 177, width: 42, height: 29, class: "map-parking" }));
    svg.append(svgElement("path", { d: "M274 201 L347 201 L352 238 L267 238 Z", class: "map-harbour" }));
    svg.append(svgElement("path", { d: "M35 217 C95 207 151 225 195 213", class: "map-promenade" }));
    mapLabel(svg, "Housing", 103, 34);
    mapLabel(svg, "Housing", 276, 33);
    mapLabel(svg, "Market", 116, 141);
    mapLabel(svg, "Hotel", 94, 195);
    mapLabel(svg, "Cafés", 151, 198);
    mapLabel(svg, "Car park", 256, 195);
    mapLabel(svg, "Fishing harbour", 310, 215);
    mapLabel(svg, "Promenade", 92, 215);
    mapLabel(svg, "Bridge", 217, 133);
  }
  if (!compact) svg.append(svgElement("text", { x: 180, y: 22, "text-anchor": "middle", class: "map-year" }, year));
  return svg;
}

function renderMaps(task, compact) {
  const wrapper = document.createElement("div");
  wrapper.className = "explorer-map-pair";
  [2005, 2025].forEach((year) => {
    const figure = document.createElement("figure");
    figure.append(renderMapPeriod(year, compact));
    if (!compact) {
      const caption = document.createElement("figcaption");
      caption.textContent = year;
      figure.append(caption);
    }
    wrapper.append(figure);
  });
  return wrapper;
}

function processBox(svg, x, y, text, className = "process-box") {
  svg.append(svgElement("rect", { x, y, width: 110, height: 48, rx: 4, class: className }));
  appendWrappedText(svg, text, x + 55, y + 21, { width: 16, lineHeight: 13, className: "process-label" });
}

function processSmallBox(svg, x, y, text, className) {
  svg.append(svgElement("rect", { x, y, width: 100, height: 32, rx: 4, class: className }));
  appendWrappedText(svg, text, x + 50, y + 13, { width: 17, lineHeight: 11, className: "process-small-label" });
}

function arrow(svg, x1, y1, x2, y2, className = "process-arrow-line") {
  svg.append(svgElement("line", { x1, y1, x2, y2, class: className, "marker-end": "url(#process-arrowhead)" }));
}

function renderProcess(task, compact) {
  const svg = makeSvg("0 0 520 610", `${task.title}. Roasted beans are ground, extracted with cold filtered water, steeped, filtered twice, mixed with water, checked and chilled. Empty bottles are washed and sterilised separately. Both streams enter filling, followed by sealing, labelling, crates, refrigerated storage and distribution.`, "explorer-process-svg");
  const defs = svgElement("defs");
  const marker = svgElement("marker", { id: "process-arrowhead", viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 6, markerHeight: 6, orient: "auto-start-reverse" });
  marker.append(svgElement("path", { d: "M 0 0 L 10 5 L 0 10 z", class: "process-arrow-head" }));
  defs.append(marker);
  svg.append(defs);
  const boxes = [
    [15, 25, "Roasted beans"], [150, 25, "Grinder"], [285, 25, "Extraction tank"],
    [285, 105, "Steep 16 hours at 5°C"], [150, 105, "Coarse filter"], [15, 105, "Fine filter"],
    [15, 205, "Cold-brew concentrate"], [150, 205, "Mixing tank"], [285, 205, "Strength check"],
    [285, 285, "Chill to 5°C"], [150, 365, "Filling"], [285, 365, "Sealing"],
    [285, 445, "Labelling"], [150, 445, "Crates"], [15, 445, "Refrigerated storage at 5°C"],
    [15, 545, "Distribution to cafés and shops"],
  ];
  boxes.forEach(([x, y, text]) => processBox(svg, x, y, text));
  processBox(svg, 15, 285, "Empty bottles", "process-box process-secondary");
  processBox(svg, 15, 365, "Wash and sterilise", "process-box process-secondary");
  processSmallBox(svg, 150, 165, "Used grounds removed", "process-output");
  processSmallBox(svg, 285, 165, "Filtered water", "process-input");
  processSmallBox(svg, 405, 25, "Cold filtered water", "process-input");
  [[125,49,150,49],[260,49,285,49],[340,73,340,105],[285,129,260,129],[150,129,125,129],[70,153,70,205],[125,229,150,229],[260,229,285,229],[340,253,340,285],[285,309,205,365],[260,389,285,389],[340,413,340,445],[285,469,260,469],[150,469,125,469],[70,493,70,545],[70,333,70,365],[125,389,150,389]].forEach((points) => arrow(svg, ...points));
  arrow(svg, 70, 153, 205, 165, "process-arrow-line process-branch");
  arrow(svg, 285, 181, 260, 229, "process-arrow-line process-input-line");
  arrow(svg, 405, 41, 395, 49, "process-arrow-line process-input-line");
  return svg;
}

function renderHorizontalBars(items, title, compact) {
  const svg = makeSvg("0 0 520 300", `${title}: ${items.map((item) => `${item.label}, ${item.value}%`).join("; ")}.`, "explorer-combined-chart");
  const max = 60;
  items.forEach((item, index) => {
    const y = 55 + index * (210 / items.length);
    const width = (item.value / max) * 285;
    svg.append(svgElement("rect", { x: 190, y: y - 17, width, height: 30, class: `explorer-series-${(index % 4) + 1}` }));
    if (!compact) {
      svg.append(svgElement("text", { x: 180, y: y + 4, "text-anchor": "end", class: "explorer-axis-label" }, item.label));
      svg.append(svgElement("text", { x: 198 + width, y: y + 4, class: "explorer-value" }, `${item.value}%`));
    }
  });
  if (!compact) svg.append(svgElement("text", { x: 260, y: 24, "text-anchor": "middle", class: "explorer-period-label" }, title));
  return svg;
}

function renderCombined(task, compact) {
  const wrapper = document.createElement("div");
  wrapper.className = "explorer-combined-visual";
  const barFigure = document.createElement("figure");
  barFigure.append(renderHorizontalBars(task.data.platforms, "Adults using each platform, 2025", compact));
  wrapper.append(barFigure);

  const overlap = task.data.overlaps;
  const vennLabel = `Reported audience overlap in 2025. Shahid and Netflix, ${overlap.shahidNetflix}%. Shahid and STC TV, ${overlap.shahidStc}%. Netflix and STC TV, ${overlap.netflixStc}%. All three, ${overlap.allThree}%. Circle areas are not proportional.`;
  const venn = makeSvg("0 0 520 340", vennLabel, "explorer-combined-chart explorer-venn-chart");
  venn.append(svgElement("text", { x: 260, y: 28, "text-anchor": "middle", class: "explorer-period-label" }, "Reported audience overlap, 2025"));
  venn.append(svgElement("circle", { cx: 205, cy: 145, r: 105, class: "venn-circle venn-shahid" }));
  venn.append(svgElement("circle", { cx: 315, cy: 145, r: 105, class: "venn-circle venn-netflix" }));
  venn.append(svgElement("circle", { cx: 260, cy: 235, r: 100, class: "venn-circle venn-stc" }));
  venn.append(svgElement("text", { x: 133, y: 102, "text-anchor": "middle", class: "venn-platform" }, "Shahid"));
  venn.append(svgElement("text", { x: 387, y: 102, "text-anchor": "middle", class: "venn-platform" }, "Netflix"));
  venn.append(svgElement("text", { x: 260, y: 307, "text-anchor": "middle", class: "venn-platform" }, "STC TV"));
  venn.append(svgElement("text", { x: 260, y: 100, "text-anchor": "middle", class: "venn-value" }, `${overlap.shahidNetflix}%`));
  venn.append(svgElement("text", { x: 198, y: 216, "text-anchor": "middle", class: "venn-value" }, `${overlap.shahidStc}%`));
  venn.append(svgElement("text", { x: 322, y: 216, "text-anchor": "middle", class: "venn-value" }, `${overlap.netflixStc}%`));
  venn.append(svgElement("text", { x: 260, y: 173, "text-anchor": "middle", class: "venn-value venn-value-all" }, `${overlap.allThree}%`));
  if (!compact) venn.append(svgElement("text", { x: 260, y: 329, "text-anchor": "middle", class: "venn-note" }, "Reported overlap labels · areas not proportional"));
  const vennFigure = document.createElement("figure");
  vennFigure.append(venn);
  wrapper.append(vennFigure);
  if (!compact) {
    const note = document.createElement("p");
    note.className = "explorer-source-note";
    note.textContent = `${task.data.overlaps.note} ${task.sourceNote}`;
    wrapper.append(note);
  }
  return wrapper;
}

const renderers = { line: renderLine, bar: renderBar, pie: renderPie, table: renderTable, maps: renderMaps, process: renderProcess, combined: renderCombined };

export function renderExplorerTaskVisual(container, task, { compact = false } = {}) {
  container.replaceChildren(renderers[task.visualKind](task, compact));
}
