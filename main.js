import * as THREE from 'three';
import { scene, camera, renderer, resizeRenderer, createLights, initOrbitControls, getOrbitControls } from './scene.js';
import { createScenery } from './entities/scenery.js';
import { createWaterfall, updateWaterfall } from './entities/waterfall.js';
import { initControls } from './systems/controls.js';
import { initGame, updateGame } from './systems/game.js';
import { initDevTools } from './systems/dev.js';
import * as TWEEN from 'tween';

// --- SCENE SETUP ---
const scenery = createScenery();
scene.add(scenery);
const waterfall = createWaterfall();
scene.add(waterfall);
createLights(scene);

// --- INITIALIZE SYSTEMS ---
initDevTools(scene);
initGame();
initControls(scene, camera);

// --- RENDERER & RESIZE ---
import { mountRenderer } from './scene.js';
mountRenderer(document.getElementById('game-container'));
window.addEventListener('resize', resizeRenderer);

// Prevent crashes from permission-related rejections
window.addEventListener('unhandledrejection', (e) => {
    const msg = (e?.reason && (e.reason.message || String(e.reason))) || '';
    if (msg.includes('Permissions check failed')) { e.preventDefault(); return; }
    console.warn('Unhandled rejection suppressed:', e.reason);
    e.preventDefault();
});
window.addEventListener('error', (e) => {
    const msg = (e?.message || '');
    if (msg.includes('Permissions check failed')) { e.preventDefault(); }
}, true);

// --- GAME LOOP ---
function animate() {
    requestAnimationFrame(animate); 
    
    const controls = getOrbitControls();
    if (controls?.enabled) {
        controls.update();
    }

    updateWaterfall(waterfall);
    updateGame();
    TWEEN.update(performance.now()); // drive tween-based animations with timestamp

    renderer.render(scene, camera);
}

// Start the animation loop
animate();