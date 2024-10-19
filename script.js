import svgUtil from "./svg.util.js";
import animationUtil from "./animation.util.js";
const inOrderDescription = `In-order traversal is one of the depth-first traversal methods for binary trees, particularly useful for Binary Search Trees (BSTs). In this traversal method, the nodes are visited in a specific order that results in the nodes being processed in ascending order of their values.
Characteristics of In-Order Traversal
Traversal Order:

In-order traversal follows this order:
Visit the left subtree.
Visit the current node (the root).
Visit the right subtree.
This results in a sorted sequence of values when applied to a BST.
Recursive and Iterative Approaches:

In-order traversal can be implemented both recursively and iteratively.`;

const postOrderDescription = `Post-order traversal is one of the depth-first traversal methods used in binary trees. In this traversal method, the nodes are visited in a specific order that processes the left and right subtrees before the root node.

Characteristics of Post-Order Traversal
Traversal Order:

Post-order traversal follows this order:
Visit the left subtree.
Visit the right subtree.
Visit the current node (the root).
This order is particularly useful for certain operations where child nodes must be processed before the parent node, such as deleting a tree.
Recursive and Iterative Approaches:

Similar to in-order traversal, post-order can be implemented both recursively and iteratively.`;

const preOrderDescription = `
Pre-Order Tree Traversal
Pre-order traversal is one of the common methods for traversing binary trees. In this traversal method, the nodes are visited in a specific order that processes the current node (the root) before its child nodes.

Characteristics of Pre-Order Traversal
Traversal Order:

Pre-order traversal follows this order:
Visit the current node (the root).
Visit the left subtree.
Visit the right subtree.
This order is useful for tasks such as creating a copy of the tree or generating a prefix expression from an expression tree.
Recursive and Iterative Approaches:

Pre-order traversal can be implemented both recursively and iteratively.`;

class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class BinaryTree {
  constructor() {
    this.root = null;
    this.level = 0;
  }

  // Insert a new node into the BST
  insert(data) {
    const newNode = new Node(data);
    if (this.root === null) {
      this.root = newNode; // If the tree is empty, set the root to the new node
    } else {
      this.insertNode(this.root, newNode); // Otherwise, call the recursive helper function
    }
  }

  // Helper function to insert a node in the tree
  insertNode(node, newNode) {
    if (newNode.data < node.data) {
      // If newNode data is less than the current node's data, go to the left subtree
      if (node.left === null) {
        node.left = newNode; // Insert the new node here if the left child is null
      } else {
        this.insertNode(node.left, newNode); // Recursively call on the left child
      }
    } else {
      // If newNode data is greater than or equal to the current node's data, go to the right subtree
      if (node.right === null) {
        node.right = newNode; // Insert the new node here if the right child is null
      } else {
        this.insertNode(node.right, newNode); // Recursively call on the right child
      }
    }
  }

  // Inorder Traversal: Left, Root, Right
  inorderTraversal(node, result = []) {
    if (node !== null) {
      this.inorderTraversal(node.left, result); // Traverse the left subtree
      result.push(node.data); // Visit the root node
      this.inorderTraversal(node.right, result); // Traverse the right subtree
    }
    return result;
  }

  // Preorder Traversal: Root, Left, Right
  preorderTraversal(node, result = []) {
    if (node !== null) {
      result.push(node.data); // Visit the root node
      this.preorderTraversal(node.left, result); // Traverse the left subtree
      this.preorderTraversal(node.right, result); // Traverse the right subtree
    }
    return result;
  }

  // Postorder Traversal: Left, Right, Root
  postorderTraversal(node, result = []) {
    if (node !== null) {
      this.postorderTraversal(node.left, result); // Traverse the left subtree
      this.postorderTraversal(node.right, result); // Traverse the right subtree
      result.push(node.data); // Visit the root node
    }
    return result;
  }
}
var stopLoop = false;
var argMap = {};
async function createTree({ dataString }) {
  let values = dataString.split(",");

  $("#in-order-tree-main-container").remove();
  $("#pre-order-tree-main-container").remove();
  $("#post-order-tree-main-container").remove();

  if (dataString.length) {
    let tree = new BinaryTree();
    values.forEach((value) => tree.insert(value));
    // if (tree.level <= 5) {
    const inOrderPaths = await svgUtil.createTree({
      id: "svg-container",
      varg3: 600,
      varg4: 400,
      name: "in-order-tree",
      data: tree.root,
      title: "In order tree",
      description: inOrderDescription,
    });

    const preOrderPaths = await svgUtil.createTree({
      id: "svg-container",
      varg3: 600,
      varg4: 400,
      name: "pre-order-tree",
      data: tree.root,
      title: "Pre order tree",
      description: preOrderDescription,
    });

    const postOrderPaths = await svgUtil.createTree({
      id: "svg-container",
      varg3: 600,
      varg4: 400,
      name: "post-order-tree",
      data: tree.root,
      title: "Post order tree",
      description: postOrderDescription,
    });

    $(".quick-nav").show();

    initiateScrollEffect();
    console.log("inOrderPaths.nodeCordinates", inOrderPaths.nodeCordinates);
    const inOrderT = tree.inorderTraversal(tree.root);
    const preOrderT = tree.preorderTraversal(tree.root);
    const postOrderT = tree.postorderTraversal(tree.root);

    argMap = {
      "in-order-tree": {
        traversalData: inOrderT,
        nodeCordinates: inOrderPaths.nodeCordinates,
        svgId: "in-order-tree",
      },
      "pre-order-tree": {
        traversalData: preOrderT,
        nodeCordinates: preOrderPaths.nodeCordinates,
        svgId: "pre-order-tree",
      },
      "post-order-tree": {
        traversalData: postOrderT,
        nodeCordinates: postOrderPaths.nodeCordinates,
        svgId: "post-order-tree",
      },
    };

    startSvgAnimation(argMap["in-order-tree"]);
    startSvgAnimation(argMap["pre-order-tree"]);
    startSvgAnimation(argMap["post-order-tree"]);
  }
  // $(".restart-button").click(function () {
  //   console.log("restart", intervals);
  //   const name = $(this).attr("id").replace("-restart-button", "");
  //   clearInterval(intervals[name]);
  //   const pathCoordinateString = addAnimationPath(argMap[name]);
  //   animationUtil.removeAndReAddAnimations({
  //     svgId: argMap[name].name,
  //     pathCoordinateString,
  //   });
  //   console.log("restart", name);
  // });

  // } else {
  // alert("Tree level exceeded.(Max level 5)");
  // }
}

function addAnimationPath({ traversalData, nodeCordinates, svgId }) {
  let pathD;
  traversalData.forEach((e, index) => {
    const [x, y] = nodeCordinates[e];
    if (index === 0) {
      pathD = `M ${x} ${y}`;
    } else {
      pathD += ` L ${x} ${y}`;
    }
  });
  // const path = $(document.createElementNS("http://www.w3.org/2000/svg", "path"))
  //   .attr("d", pathD)
  //   .attr("stroke", "black")
  //   .attr("stroke-width", 2)
  //   .attr("fill", "transparent")
  //   .attr("id", `${svgId}-animation-path`);
  // // .hide();
  // console.log("pathD", pathD);

  // $(`#${svgId}`).append(path);
  // $(`#animePath-${svgId}`).attr("href", `#${svgId}-animation-path`);
  return pathD;
}
var intervals = {};

function startSvgAnimation({ traversalData, nodeCordinates, svgId }) {
  animationUtil.addAnimationCircle({ svgId });
  const pathCoordinateString = addAnimationPath({
    traversalData,
    nodeCordinates,
    svgId,
  });

  const totalSeconds = animationUtil.addAnimations({
    svgId,
    pathCoordinateString,
  });

  intervals[svgId] = setInterval(() => {
    animationUtil.removeAndReAddAnimations({ svgId, pathCoordinateString });
  }, totalSeconds * 1000);
}

function initiateScrollEffect() {
  $(window).on("scroll", function () {
    $(".content").each(function () {
      const elementTop = $(this).offset().top;
      const windowBottom = $(window).scrollTop() + $(window).height();

      // Check if the element is in the viewport
      if (elementTop < windowBottom) {
        $(this).fadeIn(1000).addClass("visible").removeClass("hidden");
      }
    });
  });
}

$(".number-group").click(function () {
  createTree({ dataString: $(this).attr("value") });
});

$("#clear-click").click(function () {
  createTree({ dataString: "" });
  stopLoop = true;
  $(".quick-nav").hide();
});
$(document).ready(function () {
  $(".quick-nav").hide();
  $(".intro-screen").hide();
  $(".header-container").hide();
  $(".intro-screen").fadeIn(2000, () => {
    let timeOut;
    $(document).on("keydown", function (event) {
      if (event.which === 13) {
        // '13' is the key code for Enter
        event.preventDefault(); // Prevent the default action (e.g., form submission)
        console.log("enter pressed", timeOut);
        clearTimeout(timeOut);
        $(".intro-screen").fadeOut(1000);
        $(".header-container").fadeIn(2000);
      }
    });
    timeOut = setTimeout(() => {
      $(".intro-screen").fadeOut(1000);
      $(".header-container").fadeIn(2000);
    }, 3000);
  });
});

// svgUtil.createTree({ id: "svg-container", varg3: 800, varg4: 400 });
