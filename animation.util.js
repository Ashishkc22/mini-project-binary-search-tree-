function genrateAnimationData(pathCoordinateString) {
  const data = pathCoordinateString.split("L").map((s, index) => {
    return index === 0 ? s.replace("M", "").trim() : s.trim();
  });
  console.log("pathTringData ---", data);

  const animationData = [];
  let prex;
  let prey;
  let begin = 0;
  for (let index = 0; index < data.length; index++) {
    let x1, y1, x2, y2;
    if (index === 0) {
      [x1, y1] = data[index].split(" ");
      [x2, y2] = data[index + 1].split(" ");
      prex = x2;
      prey = y2;
    } else {
      x1 = prex;
      y1 = prey;
      [x2, y2] = data[index + 1 == data.length ? 0 : index + 1].split(" ");
      prex = x2;
      prey = y2;
    }
    animationData.push(
      {
        attributeName: "cx",
        from: x1,
        to: x2,
        fill: "freeze",
        begin,
        dur: 2,
      },
      { attributeName: "cy", from: y1, to: y2, fill: "freeze", begin, dur: 2 }
    );
    begin += 3;
  }
  return { animationData, duration: begin + 2 };
}

function addAnimations({ svgId, pathCoordinateString }) {
  // SVG namespace
  const svgNS = "http://www.w3.org/2000/svg";

  // Define the animation data
  const { animationData, duration } =
    genrateAnimationData(pathCoordinateString);

  // Append animations to the specified circle
  const circle = $(`#animation-circle-${svgId}`); // Get the circle element
  let totalDuration = 0; // Initialize total duration to calculate the timing of animations

  animationData.forEach((animation, index) => {
    const animateElem = document.createElementNS(svgNS, "animate");

    // if (index % 2 === 0) {
    //   // For the movement animations
    //   animateElem.setAttribute("begin", `${totalDuration}s`);
    //   animateElem.setAttribute("dur", "2s");
    //   totalDuration += 2; // Increment the total duration after the movement
    // }

    // Set the fixed attributes
    for (const [key, value] of Object.entries(animation)) {
      animateElem.setAttribute(key, value);
    }

    // Set fixed values for attributeName, from, and to
    for (const [key, value] of Object.entries(animation)) {
      if (key !== "repeatCount") {
        animateElem.setAttribute(key, value);
      } else {
        animateElem.setAttribute(key, value);
      }
    }

    circle.append(animateElem);
  });
  return duration;
}

async function removeAndReAddAnimations({ svgId, pathCoordinateString }) {
  //   const circle = $(`#animation-circle-${svgId}`).get(0); // Get the circle element
  //   console.log("animation restart firstAnimateElement", circle);
  //   const animations = circle.getElementsByTagName("animate");
  //   console.log("animation restart");
  //   // Remove existing animations
  //   while (animations.length > 0) {
  //     circle.removeChild(animations[0]);
  //   }
  //   $(`#animation-circle-${svgId}`).remove();
  //   await new Promise((res) => setTimeout(res, 1000));
  //   addAnimationCircle({ svgId });
  //   // Re-add the animations
  //   addAnimations({ svgId, pathCoordinateString }); // Reuse the function you defined earlier
  console.log("removing");

  var $original = $(`#${svgId}`);
  var $clone = $original.clone();

  // Remove the original element from the DOM
  $original.remove();

  // Reinsert the cloned element into the DOM to restart the animation
  $(`#${svgId}-container`).append($clone);
}

function addAnimationCircle({ svgId, svgNS = "http://www.w3.org/2000/svg" }) {
  // create a circle for animation
  const circle = $(document.createElementNS(svgNS, "circle"))
    .attr("cx", 150)
    .attr("cy", 130)
    .attr("r", 25) // Set the radius
    .attr("fill", "none")
    .attr("stroke", "green")
    .attr("stroke-width", 4)
    .attr("id", `animation-circle-${svgId}`);
  $(`#${svgId}`).append(circle);
}

export default {
  addAnimations,
  removeAndReAddAnimations,
  addAnimationCircle,
};
