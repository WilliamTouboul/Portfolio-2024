// Setup du Canvas, 
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);

// Création du renderer, alpha true pour qu'il n'y ai pas de fond.
const renderer = new THREE.WebGLRenderer({ alpha: true });
// Set size à la taille de la fenêtre
renderer.setSize(window.innerWidth, window.innerHeight);
// Création du canvas dans le body.
document.body.appendChild(renderer.domElement);

// Création d'une sphère. Set des positions et création d'un array des vertex pour la suite.
const geometry = new THREE.SphereGeometry(1, 64, 64);
const positionAttribute = geometry.attributes.position;
const originalPositions = positionAttribute.array.slice(); // Copie des vertex pour la suite
const vertexModifier = 0.1;

// Création du mesh de la sphère, sphère blanche pour faciliter la gestion des lumières après.
const material = new THREE.MeshStandardMaterial({ color: 0xf0f0ff });
const orb = new THREE.Mesh(geometry, material);
scene.add(orb);

camera.position.z = 3;

/* Création de 4 lumières.
   - 1 bleu en haut à droite, 2 noirs en bas à gauche pour cramer la couleur.
   - Une blanche, derrière, pour rajouter un "halo" à la sphère.
*/
const firstLight = new THREE.PointLight(0x18abcc, 1.2, 100);
firstLight.position.set(5, 5, 5);
scene.add(firstLight);

const secondLight = new THREE.PointLight(0x191919, 1, 100);
secondLight.position.set(-5, -8, 5);
scene.add(secondLight);

const thirdLight = new THREE.PointLight(0x191919, 1, 100);
thirdLight.position.set(-5, -8, 5);
scene.add(thirdLight);

const fourthLight = new THREE.PointLight(0xffffff, 1, 100);
fourthLight.position.set(-40, 5, -50);
scene.add(fourthLight);

// Variables pour stocker les mouvements de la souris
let targetX = 0;
let targetY = 0;

// Function pour gérer le mouvement de la souris et bouger la lumière et la sphère légèrement dans la même direction
function onMouseMove(event) {
   const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
   const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

   // Mise à jour des positions de la lumière
   firstLight.position.x = mouseX * 10;
   firstLight.position.y = mouseY * 10;

   // Mise à jour des cibles de position de la sphère pour un mouvement léger
   targetX = mouseX * 0.05;
   targetY = mouseY * 0.05;
}

window.addEventListener('mousemove', onMouseMove);

// Variable de temps pour faciliter les animations
let time = 0;

// Fonction animate. Boucle sur les vertex de la sphère, et modifie la position en fonction du temps et de la position de base.
function animate() {
   requestAnimationFrame(animate);

   for (let i = 0; i < positionAttribute.count; i++) {
      const x = originalPositions[i * 3];
      const y = originalPositions[i * 3 + 1];
      const z = originalPositions[i * 3 + 2];

      const wave = Math.sin(y * 120000000 + time) * vertexModifier;
      positionAttribute.setXYZ(i, x, y + wave, z);
   }

   // Ajoute du mouvement en fonction de la souris pour la sphère
   orb.position.x += (targetX - orb.position.x) * 0.2;
   orb.position.y += (targetY - orb.position.y) * 0.2;

   // En plus de modifier les vertex, on fait tourner la sphère
   orb.rotation.x += 0.001;
   orb.rotation.y += 0.005;
   orb.rotation.z += 0.005;

   positionAttribute.needsUpdate = true;

   // Incrémentation de la variable de temps pour les animations
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
