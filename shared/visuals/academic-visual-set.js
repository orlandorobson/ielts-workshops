import { renderAcademicChart } from "./academic-prototype-chart.js";

const SVG_NS = "http://www.w3.org/2000/svg";

function svgElement(name, attributes = {}, text = "") {
  const element = document.createElementNS(SVG_NS, name);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  if (text) element.textContent = text;
  return element;
}

function baseSvg(visual, compact) {
  const svg = svgElement("svg", {
    viewBox: "0 0 360 220",
    role: "img",
    "aria-label": visual.description,
    class: compact ? "visual-svg compact" : "visual-svg",
  });
  return svg;
}

function renderLine(visual, compact) {
  const svg = baseSvg(visual, compact);
  const x = (index) => 34 + index * 57;
  const y = (value) => 190 - value * 2.35;
  [20, 40, 60].forEach((value) => svg.append(svgElement("line", { x1: 28, y1: y(value), x2: 334, y2: y(value), class: "visual-grid" })));
  visual.data.series.forEach((series, seriesIndex) => {
    const points = series.values.map((value, index) => `${x(index)},${y(value)}`).join(" ");
    svg.append(svgElement("polyline", { points, class: `visual-series visual-series-${seriesIndex + 1}` }));
  });
  if (!compact) {
    visual.data.years.forEach((year, index) => svg.append(svgElement("text", { x: x(index), y: 210, "text-anchor": "middle" }, year)));
    visual.data.series.forEach((series, index) => svg.append(svgElement("text", { x: 285, y: 30 + index * 18, class: `visual-label visual-label-${index + 1}` }, series.label)));
  }
  return svg;
}

function renderBar(visual, compact) {
  const svg = baseSvg(visual, compact);
  const baseline = 184;
  visual.data.categories.forEach((category, categoryIndex) => {
    visual.data.series.forEach((series, seriesIndex) => {
      const value = series.values[categoryIndex];
      const height = value * 2.65;
      svg.append(svgElement("rect", {
        x: 38 + categoryIndex * 80 + seriesIndex * 24,
        y: baseline - height,
        width: 19,
        height,
        class: `visual-bar visual-series-${seriesIndex + 1}`,
      }));
      if (!compact) svg.append(svgElement("text", { x: 47 + categoryIndex * 80 + seriesIndex * 24, y: baseline - height - 5, "text-anchor": "middle" }, value));
    });
    if (!compact) svg.append(svgElement("text", { x: 49 + categoryIndex * 80, y: 205, "text-anchor": "middle" }, category.replace(" centre", "")));
  });
  svg.append(svgElement("line", { x1: 25, y1: baseline, x2: 340, y2: baseline, class: "visual-axis" }));
  if (!compact) {
    svg.append(svgElement("text", { x: 28, y: 18, class: "visual-label visual-label-1" }, "Adults"));
    svg.append(svgElement("text", { x: 92, y: 18, class: "visual-label visual-label-2" }, "Teenagers"));
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
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 0 ${endX} ${endY} Z`;
}

function renderPie(visual, compact) {
  const svg = baseSvg(visual, compact);
  visual.data.periods.forEach((period, periodIndex) => {
    const cx = periodIndex === 0 ? 105 : 255;
    let angle = 0;
    period.values.forEach((value, index) => {
      const next = angle + value * 3.6;
      svg.append(svgElement("path", { d: piePath(cx, 106, 65, angle, next), class: `visual-slice visual-slice-${index + 1}` }));
      if (!compact) {
        const [labelX, labelY] = polarPoint(cx, 106, 42, angle + (next - angle) / 2);
        svg.append(svgElement("text", { x: labelX, y: labelY + 3, "text-anchor": "middle", class: "pie-index" }, index + 1));
      }
      angle = next;
    });
    if (!compact) svg.append(svgElement("text", { x: cx, y: 202, "text-anchor": "middle", class: "visual-period" }, period.label));
  });
  return svg;
}

function renderTableVisual(visual, compact) {
  if (compact) {
    const svg = baseSvg(visual, true);
    const columnX = [18, 210, 282];
    const rows = [visual.data.columns, ...visual.data.rows.slice(0, 3)];
    rows.forEach((values, rowIndex) => {
      const y = 36 + rowIndex * 44;
      svg.append(svgElement("rect", { x: 10, y: y - 24, width: 340, height: 40, class: rowIndex === 0 ? "table-header-row" : "table-preview-row" }));
      values.forEach((value, columnIndex) => svg.append(svgElement("text", { x: columnX[columnIndex], y, "text-anchor": columnIndex ? "middle" : "start" }, value)));
    });
    return svg;
  }
  const table = document.createElement("table");
  table.className = "visual-data-table";
  table.setAttribute("aria-label", visual.description);
  const header = document.createElement("tr");
  visual.data.columns.forEach((column) => {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = column;
    header.append(th);
  });
  const thead = document.createElement("thead");
  thead.append(header);
  const tbody = document.createElement("tbody");
  visual.data.rows.forEach((values) => {
    const row = document.createElement("tr");
    values.forEach((value, index) => {
      const cell = document.createElement(index === 0 ? "th" : "td");
      if (index === 0) cell.scope = "row";
      cell.textContent = value;
      row.append(cell);
    });
    tbody.append(row);
  });
  table.append(thead, tbody);
  return table;
}

function renderMaps(visual, compact) {
  const svg = baseSvg(visual, compact);
  visual.data.periods.forEach((period, index) => {
    const offset = index * 176;
    svg.append(svgElement("rect", { x: 8 + offset, y: 35, width: 164, height: 145, class: "map-outline" }));
    svg.append(svgElement("rect", { x: 18 + offset, y: 51, width: 60, height: 52, class: `map-zone map-zone-${index + 1}` }));
    svg.append(svgElement("rect", { x: 102 + offset, y: 51, width: 60, height: 52, class: "map-zone map-zone-3" }));
    svg.append(svgElement("rect", { x: 18 + offset, y: 126, width: 144, height: 26, class: "map-fixed" }));
    svg.append(svgElement("line", { x1: 12 + offset, y1: 171, x2: 168 + offset, y2: 171, class: "waterfront-path" }));
    svg.append(svgElement("line", { x1: 90 + offset, y1: 38, x2: 90 + offset, y2: 124, class: index ? "map-path pedestrian" : "map-path" }));
    if (!compact) {
      svg.append(svgElement("text", { x: 90 + offset, y: 24, "text-anchor": "middle", class: "visual-period" }, period.label));
      svg.append(svgElement("text", { x: 48 + offset, y: 80, "text-anchor": "middle", class: "map-label" }, period.west));
      svg.append(svgElement("text", { x: 132 + offset, y: 80, "text-anchor": "middle", class: "map-label" }, period.east));
      svg.append(svgElement("text", { x: 90 + offset, y: 144, "text-anchor": "middle" }, "Shops"));
      svg.append(svgElement("text", { x: 90 + offset, y: 166, "text-anchor": "middle" }, "Waterfront"));
    }
  });
  return svg;
}

function renderProcess(visual, compact) {
  const svg = baseSvg(visual, compact);
  visual.data.stages.forEach((stage, index) => {
    const column = index % 3;
    const row = Math.floor(index / 3);
    const visualIndex = row === 0 ? column : 2 - column;
    const x = 16 + visualIndex * 116;
    const y = 35 + row * 105;
    svg.append(svgElement("rect", { x, y, width: 96, height: 52, class: "process-stage" }));
    if (!compact) {
      const words = stage.split(" ");
      const midpoint = Math.ceil(words.length / 2);
      svg.append(svgElement("text", { x: x + 48, y: y + 23, "text-anchor": "middle" }, words.slice(0, midpoint).join(" ")));
      if (words.length > 2) svg.append(svgElement("text", { x: x + 48, y: y + 40, "text-anchor": "middle" }, words.slice(midpoint).join(" ")));
    } else {
      svg.append(svgElement("text", { x: x + 48, y: y + 33, "text-anchor": "middle" }, index + 1));
    }
    if (index < visual.data.stages.length - 1) {
      const nextColumn = (index + 1) % 3;
      const nextRow = Math.floor((index + 1) / 3);
      const nextVisualIndex = nextRow === 0 ? nextColumn : 2 - nextColumn;
      const nextX = 16 + nextVisualIndex * 116;
      const nextY = 35 + nextRow * 105;
      const sameRow = nextRow === row;
      const arrowX = sameRow ? (nextX > x ? x + 106 : x - 10) : x + 48;
      const arrowY = sameRow ? y + 31 : y + 82;
      svg.append(svgElement("text", { x: arrowX, y: arrowY, "text-anchor": "middle", class: "process-arrow" }, sameRow ? (nextX > x ? "→" : "←") : "↓"));
    }
  });
  return svg;
}

function appendInformationSummary(figure, visual, revealOverview) {
  const details = document.createElement("details");
  details.className = "visual-summary";
  const summary = document.createElement("summary");
  summary.textContent = visual.data.kind === "maps" || visual.data.kind === "process" ? "Read the information summary" : "View the underlying information";
  const description = document.createElement("p");
  description.textContent = visual.description;
  let information;
  if (visual.data.kind === "bar") {
    information = document.createElement("table");
    information.innerHTML = `<caption>${visual.data.unit}</caption><thead><tr><th scope="col">Facility</th>${visual.data.series.map((series) => `<th scope="col">${series.label}</th>`).join("")}</tr></thead><tbody>${visual.data.categories.map((category, index) => `<tr><th scope="row">${category}</th>${visual.data.series.map((series) => `<td>${series.values[index]}</td>`).join("")}</tr>`).join("")}</tbody>`;
  } else if (visual.data.kind === "pie") {
    information = document.createElement("table");
    information.innerHTML = `<caption>${visual.data.unit}</caption><thead><tr><th scope="col">Category</th>${visual.data.periods.map((period) => `<th scope="col">${period.label}</th>`).join("")}</tr></thead><tbody>${visual.data.categories.map((category, index) => `<tr><th scope="row">${index + 1}. ${category}</th>${visual.data.periods.map((period) => `<td>${period.values[index]}%</td>`).join("")}</tr>`).join("")}</tbody>`;
  } else if (visual.data.kind === "maps") {
    information = document.createElement("ul");
    visual.data.periods.forEach((period) => {
      const item = document.createElement("li");
      item.textContent = `${period.label}: west—${period.west}; east—${period.east}; centre—${period.centre}; unchanged—${period.fixed}.`;
      information.append(item);
    });
  } else if (visual.data.kind === "process") {
    information = document.createElement("ol");
    visual.data.stages.forEach((stage) => {
      const item = document.createElement("li");
      item.textContent = stage;
      information.append(item);
    });
  }
  details.append(summary, description);
  if (information) details.append(information);
  if (revealOverview) {
    const overview = document.createElement("p");
    overview.innerHTML = `<strong>One big-picture observation:</strong> ${visual.overview}`;
    details.append(overview);
  }
  figure.append(details);
}

export function renderAcademicVisual(container, visual, { compact = false, revealOverview = true } = {}) {
  container.replaceChildren();
  const neutralDescription = `${visual.label} titled ${visual.title}. Use the labels and information summary to inspect the source information.`;
  const displayVisual = revealOverview
    ? visual
    : { ...visual, description: neutralDescription, data: { ...visual.data, description: neutralDescription } };
  if (!compact && visual.id === "line") {
    renderAcademicChart(container, displayVisual.data);
    return;
  }

  const figure = document.createElement("figure");
  figure.className = compact ? "academic-visual compact" : "academic-visual";
  if (!compact) {
    const heading = document.createElement("h3");
    heading.textContent = displayVisual.title;
    figure.append(heading);
  }

  const renderers = {
    line: renderLine,
    bar: renderBar,
    pie: renderPie,
    table: renderTableVisual,
    maps: renderMaps,
    process: renderProcess,
  };
  figure.append(renderers[displayVisual.data.kind](displayVisual, compact));
  if (!compact && visual.data.kind === "pie") {
    const legend = document.createElement("ol");
    legend.className = "pie-legend";
    visual.data.categories.forEach((category) => {
      const item = document.createElement("li");
      item.textContent = category;
      legend.append(item);
    });
    figure.append(legend);
  }
  if (!compact) appendInformationSummary(figure, displayVisual, revealOverview);
  container.append(figure);
}
