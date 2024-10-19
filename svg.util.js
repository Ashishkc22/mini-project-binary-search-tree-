function createCircle({ svgNS, x, y, svgElement, text, id }) {
  // Create the circle element using jQuery with the correct namespace
  const circle = $(document.createElementNS(svgNS, "circle"))
    .attr("cx", x) // Set the x-coordinate
    .attr("cy", y) // Set the y-coordinate
    .attr("r", 22) // Set the radius
    .attr("fill", "red")
    .attr("id", id);

  const svgText = addText({
    svgNS,
    x: String(text).length >= 2 ? x - 11 : x - 7,
    y: y + 7,
    text,
  });
  $(svgElement).append(circle);
  $(svgElement).append(svgText);
}

function addText({ svgNS, text, x, y }) {
  // Create the circle element using jQuery with the correct namespace
  return $(document.createElementNS(svgNS, "text"))
    .attr("x", x) // Set the x-coordinate
    .attr("y", y) // Set the y-coordinate
    .attr("font-size", 25) // Set the font size
    .attr("fill", "white") // Set the fill color
    .text(text); // Set the text content
}

function createSVG({ svgNS, varg1, varg2, varg3, varg4, name }) {
  return $(document.createElementNS(svgNS, "svg"))
    .attr("id", name) // Set the id attribute
    .attr("width", 100) // Set the width
    .attr("height", 80)
    .attr("viewBox", `${varg1} ${varg2} ${varg3} ${varg4}`)
    .attr("preserveAspectRatio", "xMidYMin meet");
}

// Function to create a curved path connecting two nodes with flexible curvature
function createPath(svgNS, svgElement, x1, y1, x2, y2, circleRadius = 20) {
  const path = document.createElementNS(svgNS, "path");

  // Calculate the angle of the line between the two points
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  // Calculate the offset for the start and end points, taking into account the radius of the circles
  const offsetX = (deltaX / distance) * circleRadius;
  const offsetY = (deltaY / distance) * circleRadius;

  // Adjust the start and end points so the path doesn't overlap the circles
  const adjustedX1 = x1 + offsetX;
  const adjustedY1 = y1 + offsetY;
  const adjustedX2 = x2 - offsetX;
  const adjustedY2 = y2 - offsetY;

  // Create the path using the 'M' (move to) and 'L' (line to) commands for a straight line
  const d = `M${adjustedX1},${adjustedY1} L${adjustedX2},${adjustedY2}`;

  // Set the path's attributes to define the straight line
  path.setAttribute("d", d);
  path.setAttribute("stroke", "black");
  path.setAttribute("stroke-width", 2);
  path.setAttribute("fill", "transparent"); // Ensure the path is not filled

  // Append the path to the SVG element
  $(svgElement).append(path);
}

// Recursive function to create the binary tree in SVG
function drawTree({
  svgNS,
  svgElement,
  node,
  x,
  y,
  level,
  gap,
  path = "r",
  name,
  paths,
  nodeCordinates,
}) {
  if (!node) {
    return;
  }
  // Create a circle for the current node
  createCircle({
    svgNS,
    x,
    y,
    svgElement,
    text: node.data,
    id: `${name}-${path}`,
  });
  paths.push(`${node.data}-${path}`);
  nodeCordinates[node.data] = [x, y];
  // Calculate the position for the left and right children
  const childY = y + 80; // Increase y-coordinate for the next level
  const childGap = gap / 2; // Reduce horizontal spacing at each level

  // Draw left child if it exists
  if (node.left) {
    const leftX = x - gap; // Move left for the left child
    // Create a line from parent to left child
    createPath(svgNS, svgElement, x, y, leftX, childY);
    // Recursively draw the left child
    drawTree({
      svgNS,
      svgElement,
      node: node.left,
      x: leftX,
      y: childY,
      level: level + 1,
      gap: childGap,
      name,
      path: path + "0",
      paths,
      nodeCordinates,
    });
  }

  // Draw right child if it exists
  if (node.right) {
    const rightX = x + gap; // Move right for the right child
    // Create a line from parent to right child
    createPath(svgNS, svgElement, x, y, rightX, childY);
    // Recursively draw the right child
    drawTree({
      svgNS,
      svgElement,
      node: node.right,
      x: rightX,
      y: childY,
      level: level + 1,
      gap: childGap,
      name,
      path: path + "1",
      paths,
      nodeCordinates,
    });
  }
}

function createTree({
  id,
  varg1 = 0,
  varg2 = 0,
  varg3 = 0,
  varg4 = 0,
  svgNS = "http://www.w3.org/2000/svg",
  name,
  data,
  title,
  description,
}) {
  $(document).ready(function () {
    console.log("Document is ready.");
    // Your jQuery code here
  });
  return new Promise((resolve, reject) => {
    $(`#${id}`).ready(function () {
      const mainContainer = $("<div></div>")
        .attr("style", " margin-left: 5%;margin-right: 5%;")
        .attr("id", `${name}-main-container`)
        .attr("class", "content hidden");

      const gridContainer = $("<div></div>")
        .attr("style", "display:flex;justify-content: space-between;")
        .attr("id", `${name}-grid-container`);

      const treeContainer = $("<div></div>")
        .attr("style", "width:500px;height:431px;min-width: 500px")
        .attr("id", `${name}-container`);

      const titleElement = $("<h4></h4>")
        .text(title)
        .attr("style", "padding: 5px;margin:5px;font-family:cursive;");

      $(mainContainer).append(titleElement);
      // Create SVG Element
      const svgElement = createSVG({
        name,
        svgNS,
        varg1,
        varg2,
        varg3,
        varg4,
      });

      const rootX = 300; // Start root node at center (adjust as needed)
      const rootY = 50; // Start root node at top
      const initialGap = 150; // Initial horizontal gap between children
      const paths = [];
      const nodeCordinates = {};

      drawTree({
        svgNS,
        svgElement,
        node: data,
        x: rootX,
        y: rootY,
        level: 0,
        gap: initialGap,
        name,
        paths,
        nodeCordinates,
      });
      //Append the SVG container to the tree container
      $(treeContainer).append(svgElement);
      // Description

      $(gridContainer).append(treeContainer);
      // $(gridContainer).append($(``));
      const descriptionElement = $(
        `<div><p style='font-size: 20px'>${description}</p>
        </div>`
      );
      // <button id="${name}-restart-button" class='restart-button' >Restart Animation</button>

      $(gridContainer).append(descriptionElement);
      $(mainContainer).append(gridContainer);
      //Append the  tree container to the main container
      $(`#${id}`).append(mainContainer);
      console.log("SVG created successfully", nodeCordinates);
      resolve({ paths, nodeCordinates });
    });
  });
}

export default {
  createTree,
};
