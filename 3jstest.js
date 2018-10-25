
// Base code taken and modified from:
// https://aerotwist.com/tutorials/getting-started-with-three-js/

// Set the scene size.
const WIDTH = 400;
const HEIGHT = 400;

// Set some camera attributes.
const VIEW_ANGLE = 45;
const ASPECT = WIDTH / HEIGHT;
const NEAR = 0.1;
const FAR = 10000;

// Get the DOM element to attach to
const container =
    document.querySelector('#container');

// Create a WebGL renderer, camera
// and a scene
const renderer = new THREE.WebGLRenderer();
const camera =
    new THREE.PerspectiveCamera(
        VIEW_ANGLE,
        ASPECT,
        NEAR,
        FAR
    );

const scene = new THREE.Scene();

// Add the camera to the scene.
scene.add(camera);

// Start the renderer.
renderer.setSize(WIDTH, HEIGHT);

// Attach the renderer-supplied
// DOM element.
container.appendChild(renderer.domElement);

// Set up the sphere vars
const RADIUS = 50;
const SEGMENTS = 16;
const RINGS = 16;

// create the sphere's material
const sphereMaterial =
  new THREE.MeshPhongMaterial(
    {
      color: 0xCC0000
    });

var sphereGeometry = new THREE.SphereGeometry(
  RADIUS,
  SEGMENTS,
  RINGS
);

// Create a new mesh with
// sphere geometry - we will cover
// the sphereMaterial next!
const sphere = new THREE.Mesh(

  sphereGeometry,

  sphereMaterial);

// Move the Sphere back in Z so we
// can see it.
sphere.position.z = -300;

// Finally, add the sphere to the scene.
scene.add(sphere);

// create a point light
const pointLight =
  new THREE.PointLight(0xFFFFFF);

// set its position
pointLight.position.x = 10;
pointLight.position.y = 50;
pointLight.position.z = 130;

// add to the scene
scene.add(pointLight);

// Schedule the first frame.
requestAnimationFrame(update);





function update () {
    // Draw!
    renderer.render(scene, camera);
  
    // Schedule the next frame.
    requestAnimationFrame(update);
  }

