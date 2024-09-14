// Basic Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.SphereGeometry(1, 64, 64);
const positionAttribute = geometry.attributes.position;
const originalPositions = positionAttribute.array.slice(); // Copie des vertex pour la suite
const vertexModifier = 0.1;

const material = new THREE.MeshStandardMaterial({ color: 0xf0f0ff });
const orb = new THREE.Mesh(geometry, material);
scene.add(orb);

camera.position.z = 3;


const redLight = new THREE.PointLight(0x18abcc, 1, 100);
redLight.position.set(5, 5, 5); // Initial position
scene.add(redLight);

const blueLight = new THREE.PointLight(0x191919, 1, 100);
blueLight.position.set(-5, -8, 5); // Position in bottom-left
scene.add(blueLight);

let time = 0;

function onMouseMove(event) {
   // Normalisation des coordonnées
   const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
   const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

   redLight.position.x = mouseX * 10;
   redLight.position.y = mouseY * 10;
}

window.addEventListener('mousemove', onMouseMove);

function animate() {
   requestAnimationFrame(animate);

   for (let i = 0; i < positionAttribute.count; i++) {
      const x = originalPositions[i * 3];     // Original x position
      const y = originalPositions[i * 3 + 1]; // Original y position
      const z = originalPositions[i * 3 + 2]; // Original z position

      const wave = Math.sin(y * 120000000 + time) * vertexModifier;

      positionAttribute.setXYZ(i, x, y + wave, z);
   }
   orb.rotation.x += 0.001;
   orb.rotation.y += 0.005;
   orb.rotation.z += 0.005;

   positionAttribute.needsUpdate = true;

   time += 0.03;

   renderer.render(scene, camera);
}

animate();



// RESPONSIVE
window.addEventListener("resize", () => {
   renderer.setSize(window.innerWidth, window.innerHeight);
   camera.aspect = window.innerWidth / window.innerHeight;
   camera.updateProjectionMatrix();
});
