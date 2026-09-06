const SVG_NS = "http://www.w3.org/2000/svg";

function svgElement(name, attributes = {}) {
  const element = document.createElementNS(SVG_NS, name);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}

export function renderAcademicChart(container, dataset) {
  container.replaceChildren();

  const figure = document.createElement("figure");
  figure.className = "task-chart";

  const heading = document.createElement("h3");
  heading.className = "chart-heading";
  heading.textContent = dataset.title;
  figure.append(heading);

  const width = 760;
  const height = 440;
  const margin = { top: 28, right: 92, bottom: 58, left: 62 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const maximum = 70;
  const x = (index) => margin.left + (plotWidth * index) / (dataset.years.length - 1);
  const y = (value) => margin.top + plotHeight - (value / maximum) * plotHeight;

  const svg = svgElement("svg", {
    viewBox: `0 0 ${width} ${height}`,
    role: "img",
    "aria-labelledby": "chart-title chart-description",
  });
  const title = svgElement("title", { id: "chart-title" });
  title.textContent = dataset.title;
  const description = svgElement("desc", { id: "chart-description" });
  description.textContent = `${dataset.description} Values are measured in ${dataset.unit}. A data table follows the chart.`;
  svg.append(title, description);

  for (let value = 0; value <= maximum; value += 10) {
    const gridLine = svgElement("line", {
      x1: margin.left,
      y1: y(value),
      x2: width - margin.right,
      y2: y(value),
      class: "chart-grid",
    });
    const label = svgElement("text", {
      x: margin.left - 12,
      y: y(value) + 5,
      "text-anchor": "end",
      class: "chart-axis-label",
    });
    label.textContent = String(value);
    svg.append(gridLine, label);
  }

  dataset.years.forEach((year, index) => {
    const label = svgElement("text", {
      x: x(index),
      y: height - 25,
      "text-anchor": "middle",
      class: "chart-axis-label",
    });
    label.textContent = String(year);
    svg.append(label);
  });

  const yTitle = svgElement("text", {
    x: 18,
    y: margin.top + plotHeight / 2,
    transform: `rotate(-90 18 ${margin.top + plotHeight / 2})`,
    "text-anchor": "middle",
    class: "chart-axis-title",
  });
  yTitle.textContent = "Journeys (thousands)";
  svg.append(yTitle);

  dataset.series.forEach((series) => {
    const group = svgElement("g", { class: `chart-series series-${series.id}` });
    const points = series.values.map((value, index) => `${x(index)},${y(value)}`).join(" ");
    group.append(svgElement("polyline", { points, class: "chart-line" }));

    series.values.forEach((value, index) => {
      const marker = svgElement(series.id === "car" ? "rect" : series.id === "bus" ? "circle" : "path", {
        class: "chart-marker",
        "aria-label": `${series.label}, ${dataset.years[index]}: ${value} thousand journeys`,
      });
      if (series.id === "car") {
        marker.setAttribute("x", x(index) - 5);
        marker.setAttribute("y", y(value) - 5);
        marker.setAttribute("width", 10);
        marker.setAttribute("height", 10);
      } else if (series.id === "bus") {
        marker.setAttribute("cx", x(index));
        marker.setAttribute("cy", y(value));
        marker.setAttribute("r", 5);
      } else {
        marker.setAttribute("d", `M ${x(index)} ${y(value) - 6} L ${x(index) + 6} ${y(value) + 5} L ${x(index) - 6} ${y(value) + 5} Z`);
      }
      group.append(marker);
    });

    const endLabel = svgElement("text", {
      x: x(series.values.length - 1) + 12,
      y: y(series.values.at(-1)) + 5,
      class: "chart-series-label",
    });
    endLabel.textContent = series.label;
    group.append(endLabel);
    svg.append(group);
  });

  figure.append(svg);

  const details = document.createElement("details");
  details.className = "data-table-disclosure";
  const summary = document.createElement("summary");
  summary.textContent = "View data as a table";
  const table = document.createElement("table");
  const caption = document.createElement("caption");
  caption.textContent = `${dataset.title}. Values in ${dataset.unit}.`;
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  ["Year", ...dataset.series.map((series) => series.label)].forEach((value) => {
    const cell = document.createElement("th");
    cell.scope = "col";
    cell.textContent = value;
    headerRow.append(cell);
  });
  thead.append(headerRow);
  const tbody = document.createElement("tbody");
  dataset.years.forEach((year, index) => {
    const row = document.createElement("tr");
    const yearCell = document.createElement("th");
    yearCell.scope = "row";
    yearCell.textContent = year;
    row.append(yearCell);
    dataset.series.forEach((series) => {
      const cell = document.createElement("td");
      cell.textContent = series.values[index];
      row.append(cell);
    });
    tbody.append(row);
  });
  table.append(caption, thead, tbody);
  details.append(summary, table);
  figure.append(details);
  container.append(figure);
}
