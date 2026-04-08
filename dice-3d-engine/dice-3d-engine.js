(function () {
  const FACE_PIPS = {
    1: [[0.5, 0.5]],
    2: [[0.28, 0.28], [0.72, 0.72]],
    3: [[0.28, 0.28], [0.5, 0.5], [0.72, 0.72]],
    4: [[0.28, 0.28], [0.72, 0.28], [0.28, 0.72], [0.72, 0.72]],
    5: [[0.28, 0.28], [0.72, 0.28], [0.5, 0.5], [0.28, 0.72], [0.72, 0.72]],
    6: [[0.28, 0.28], [0.72, 0.28], [0.28, 0.5], [0.72, 0.5], [0.28, 0.72], [0.72, 0.72]]
  };
  const FACE_VALUES = [3, 4, 1, 6, 2, 5];
  const TOP_ROTATIONS = {
    1: null,
    2: { axis: [1, 0, 0], angle: -Math.PI / 2 },
    3: { axis: [0, 0, 1], angle: Math.PI / 2 },
    4: { axis: [0, 0, 1], angle: -Math.PI / 2 },
    5: { axis: [1, 0, 0], angle: Math.PI / 2 },
    6: { axis: [1, 0, 0], angle: Math.PI }
  };
  const EDGE_NAMES = ['left', 'right', 'top', 'bottom'];
  const OPPOSITE_EDGE = {
    left: 'right',
    right: 'left',
    top: 'bottom',
    bottom: 'top'
  };
  const FACE_NORMALS = [
    { value: 3, normal: [1, 0, 0] },
    { value: 4, normal: [-1, 0, 0] },
    { value: 1, normal: [0, 1, 0] },
    { value: 6, normal: [0, -1, 0] },
    { value: 2, normal: [0, 0, 1] },
    { value: 5, normal: [0, 0, -1] }
  ];
  const STATIC_GROUP = 1;
  const DIE_GROUP = 2;
  const BODY_SLEEPING = 2;
  const DEFAULT_DICE_APPEARANCE = {
    diceColor: '#ffffff',
    diceEdgeColor: '#8ea2af',
    diceInkColor: '#05090d',
    diceFaceMode: 'pips'
  };

  const state = {
    overlay: null,
    sceneEl: null,
    stageEl: null,
    renderer: null,
    scene: null,
    camera: null,
    world: null,
    worldWidth: 0,
    worldDepth: 0,
    floorMesh: null,
    frameId: 0,
    lastTime: 0,
    staticBodies: [],
    dynamicBodies: [],
    dice: [],
    rollStartTime: 0,
    displayStartTime: 0,
    settledNotified: false,
    cleanupStarted: false,
    settleCallback: null,
    keepRule: 'keep-all',
    rollSourceEdge: 'left',
    rollBounceEdge: 'right',
    viewportMode: 'window',
    appearance: { ...DEFAULT_DICE_APPEARANCE },
    staticMaterial: null,
    dieMaterial: null,
    textureCache: new Map(),
    fadeTimeoutId: 0,
    resizeBound: false
  };

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function lerp(start, end, amount) {
    return start + (end - start) * amount;
  }

  function easeOutCubic(value) {
    return 1 - ((1 - value) ** 3);
  }

  function easeInOutCubic(value) {
    return value < 0.5
      ? 4 * value * value * value
      : 1 - (((-2 * value) + 2) ** 3) / 2;
  }

  function magnitude(x, y, z = 0) {
    return Math.sqrt((x ** 2) + (y ** 2) + (z ** 2));
  }

  function normalizeHexColor(color, fallback) {
    const value = typeof color === 'string' ? color.trim() : '';
    return /^#[0-9a-fA-F]{6}$/.test(value) ? value.toLowerCase() : fallback;
  }

  function normalizeFaceMode(mode) {
    return mode === 'number' ? 'number' : 'pips';
  }

  function sanitizeAppearance(appearance) {
    return {
      diceColor: normalizeHexColor(appearance?.diceColor, DEFAULT_DICE_APPEARANCE.diceColor),
      diceEdgeColor: normalizeHexColor(appearance?.diceEdgeColor, DEFAULT_DICE_APPEARANCE.diceEdgeColor),
      diceInkColor: normalizeHexColor(appearance?.diceInkColor, DEFAULT_DICE_APPEARANCE.diceInkColor),
      diceFaceMode: normalizeFaceMode(appearance?.diceFaceMode)
    };
  }

  function hexToRgb(hex) {
    const normalized = normalizeHexColor(hex, '#000000');
    const value = normalized.slice(1);
    return {
      r: parseInt(value.slice(0, 2), 16),
      g: parseInt(value.slice(2, 4), 16),
      b: parseInt(value.slice(4, 6), 16)
    };
  }

  function mixColor(hex, targetHex, amount) {
    const source = hexToRgb(hex);
    const target = hexToRgb(targetHex);
    const mix = (start, end) => Math.round(start + ((end - start) * amount));
    return `rgb(${mix(source.r, target.r)}, ${mix(source.g, target.g)}, ${mix(source.b, target.b)})`;
  }

  function prefersReducedMotion() {
    return typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function hasLibraries() {
    return Boolean(window.THREE && window.CANNON);
  }

  function getViewportRect() {
    return {
      width: Math.max(1, window.innerWidth || document.documentElement.clientWidth || 1),
      height: Math.max(1, window.innerHeight || document.documentElement.clientHeight || 1)
    };
  }

  function ensureOverlayElements(overlay) {
    if (!overlay) return false;
    if (overlay.parentNode !== document.body) {
      document.body.append(overlay);
    }
    state.overlay = overlay;
    let sceneEl = overlay.querySelector('.dice-roll-scene');
    let stageEl = overlay.querySelector('.dice-roll-stage');
    if (!sceneEl) {
      sceneEl = document.createElement('div');
      sceneEl.className = 'dice-roll-scene';
      overlay.append(sceneEl);
    }
    if (!stageEl) {
      stageEl = document.createElement('div');
      stageEl.className = 'dice-roll-stage';
      sceneEl.append(stageEl);
    }
    sceneEl.style.width = `${window.innerWidth || document.documentElement.clientWidth || 1}px`;
    sceneEl.style.height = `${window.innerHeight || document.documentElement.clientHeight || 1}px`;
    stageEl.style.width = sceneEl.style.width;
    stageEl.style.height = sceneEl.style.height;
    state.sceneEl = sceneEl;
    state.stageEl = stageEl;
    return true;
  }

  function createFaceTexture(value, appearance = state.appearance) {
    const THREE = window.THREE;
    const safeAppearance = sanitizeAppearance(appearance);
    const cacheKey = `${value}:${safeAppearance.diceColor}:${safeAppearance.diceEdgeColor}:${safeAppearance.diceInkColor}:${safeAppearance.diceFaceMode}`;
    if (state.textureCache.has(cacheKey)) {
      return state.textureCache.get(cacheKey);
    }

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');

    const gradient = context.createLinearGradient(0, 0, 256, 256);
    gradient.addColorStop(0, mixColor(safeAppearance.diceColor, '#ffffff', 0.24));
    gradient.addColorStop(0.56, safeAppearance.diceColor);
    gradient.addColorStop(1, mixColor(safeAppearance.diceColor, '#000000', 0.16));
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);

    context.strokeStyle = safeAppearance.diceEdgeColor;
    context.lineWidth = 16;
    context.strokeRect(10, 10, 236, 236);

    context.strokeStyle = mixColor(safeAppearance.diceEdgeColor, '#ffffff', 0.4);
    context.lineWidth = 4;
    context.strokeRect(22, 22, 212, 212);

    if (safeAppearance.diceFaceMode === 'number') {
      context.fillStyle = safeAppearance.diceInkColor;
      context.font = '700 134px Georgia, serif';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(String(value), 128, 134);
    } else {
      const positions = FACE_PIPS[value] || [];
      positions.forEach(([x, y]) => {
        const px = x * 256;
        const py = y * 256;
        const pipGradient = context.createRadialGradient(px - 7, py - 7, 2, px, py, 22);
        pipGradient.addColorStop(0, mixColor(safeAppearance.diceInkColor, '#ffffff', 0.18));
        pipGradient.addColorStop(0.34, safeAppearance.diceInkColor);
        pipGradient.addColorStop(1, mixColor(safeAppearance.diceInkColor, '#000000', 0.28));
        context.fillStyle = pipGradient;
        context.beginPath();
        context.arc(px, py, 20, 0, Math.PI * 2);
        context.fill();
      });
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 4;
    texture.needsUpdate = true;
    state.textureCache.set(cacheKey, texture);
    return texture;
  }

  function createMaterials(appearance = state.appearance) {
    const THREE = window.THREE;
    return FACE_VALUES.map((value) => new THREE.MeshPhongMaterial({
      map: createFaceTexture(value, appearance),
      color: 0xffffff,
      shininess: 52,
      specular: 0x334250,
      transparent: true
    }));
  }

  function getTopQuaternion(value, yaw = 0) {
    const THREE = window.THREE;
    const quaternion = new THREE.Quaternion();
    const rotation = TOP_ROTATIONS[value];
    if (rotation) {
      quaternion.setFromAxisAngle(new THREE.Vector3(rotation.axis[0], rotation.axis[1], rotation.axis[2]), rotation.angle);
    }
    if (yaw) {
      const yawQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
      quaternion.premultiply(yawQuaternion);
    }
    return quaternion;
  }

  function setDiscardedAppearance(dieState, discarded) {
    dieState.materials.forEach((material) => {
      material.opacity = discarded ? 0.38 : 1;
      material.color.set(discarded ? '#d7e0e7' : '#ffffff');
    });
    dieState.edgeMaterial.opacity = discarded ? 0.03 : 0.05;
  }

  function createWorldIfNeeded() {
    const CANNON = window.CANNON;
    if (state.world) return;

    state.world = new CANNON.World();
    state.world.gravity.set(0, -22, 0);
    state.world.broadphase = new CANNON.NaiveBroadphase();
    state.world.solver.iterations = 10;
    state.world.allowSleep = true;

    state.staticMaterial = new CANNON.Material('dice-static');
    state.dieMaterial = new CANNON.Material('dice-die');
    state.world.addContactMaterial(new CANNON.ContactMaterial(state.dieMaterial, state.staticMaterial, {
      friction: 0.36,
      restitution: 0.4
    }));
    state.world.addContactMaterial(new CANNON.ContactMaterial(state.dieMaterial, state.dieMaterial, {
      friction: 0.32,
      restitution: 0.28
    }));
  }

  function getPlaneIntersectionFromNdc(camera, ndcX, ndcY) {
    const THREE = window.THREE;
    const point = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(camera);
    const origin = camera.position.clone();
    const direction = point.sub(origin).normalize();
    const safeY = Math.abs(direction.y) < 1e-6 ? -1e-6 : direction.y;
    const distance = -origin.y / safeY;
    return origin.add(direction.multiplyScalar(distance));
  }

  function getVisibleArenaSize(camera) {
    const corners = [
      getPlaneIntersectionFromNdc(camera, -1, -1),
      getPlaneIntersectionFromNdc(camera, 1, -1),
      getPlaneIntersectionFromNdc(camera, -1, 1),
      getPlaneIntersectionFromNdc(camera, 1, 1)
    ];
    const xs = corners.map((corner) => corner.x);
    const zs = corners.map((corner) => corner.z);
    const width = Math.max(...xs) - Math.min(...xs);
    const depth = Math.max(...zs) - Math.min(...zs);
    return {
      width: Math.max(12, width * 0.92),
      depth: Math.max(8, depth * 0.92)
    };
  }

  function rebuildArena() {
    const THREE = window.THREE;
    const CANNON = window.CANNON;
    const viewport = getViewportRect();

    if (state.sceneEl && state.stageEl) {
      state.sceneEl.style.width = `${viewport.width}px`;
      state.sceneEl.style.height = `${viewport.height}px`;
      state.stageEl.style.width = `${viewport.width}px`;
      state.stageEl.style.height = `${viewport.height}px`;
    }

    const roughWorldWidth = Math.max(16, viewport.width / 72);
    const roughWorldDepth = Math.max(10, viewport.height / 72);
    const roughLargestSide = Math.max(roughWorldWidth, roughWorldDepth);

    if (state.renderer) {
      state.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      state.renderer.setSize(viewport.width, viewport.height, false);
    }

    if (state.camera) {
      state.camera.aspect = viewport.width / viewport.height;
      state.camera.fov = 32;
      state.camera.position.set(0, roughLargestSide * 1.42, roughLargestSide * 0.34);
      state.camera.lookAt(0, 0, 0);
      state.camera.updateProjectionMatrix();

      const visibleArena = getVisibleArenaSize(state.camera);
      state.worldWidth = visibleArena.width;
      state.worldDepth = visibleArena.depth;
    }

    if (state.floorMesh) {
      state.floorMesh.geometry.dispose();
      state.scene.remove(state.floorMesh);
      state.floorMesh = null;
    }

    state.floorMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(state.worldWidth, state.worldDepth),
      new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.22 })
    );
    state.floorMesh.rotation.x = -Math.PI / 2;
    state.floorMesh.position.y = 0.001;
    state.floorMesh.receiveShadow = true;
    state.scene.add(state.floorMesh);

    state.staticBodies.forEach((body) => state.world.removeBody(body));
    state.staticBodies = [];

    const addStatic = (body) => {
      body.material = state.staticMaterial;
      body.collisionFilterGroup = STATIC_GROUP;
      body.collisionFilterMask = DIE_GROUP;
      state.world.addBody(body);
      state.staticBodies.push(body);
    };

    const floorBody = new CANNON.Body({ mass: 0, shape: new CANNON.Plane() });
    floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    floorBody.userData = { kind: 'floor' };
    addStatic(floorBody);

    const wallThickness = 0.4;
    const wallHeight = 4.2;
    const halfWidth = state.worldWidth / 2;
    const halfDepth = state.worldDepth / 2;
    const walls = [
      { kind: 'wall-left', position: new CANNON.Vec3(-halfWidth - wallThickness / 2, wallHeight / 2, 0), size: new CANNON.Vec3(wallThickness / 2, wallHeight / 2, halfDepth + wallThickness) },
      { kind: 'wall-right', position: new CANNON.Vec3(halfWidth + wallThickness / 2, wallHeight / 2, 0), size: new CANNON.Vec3(wallThickness / 2, wallHeight / 2, halfDepth + wallThickness) },
      { kind: 'wall-top', position: new CANNON.Vec3(0, wallHeight / 2, -halfDepth - wallThickness / 2), size: new CANNON.Vec3(halfWidth + wallThickness, wallHeight / 2, wallThickness / 2) },
      { kind: 'wall-bottom', position: new CANNON.Vec3(0, wallHeight / 2, halfDepth + wallThickness / 2), size: new CANNON.Vec3(halfWidth + wallThickness, wallHeight / 2, wallThickness / 2) }
    ];

    walls.forEach((wall) => {
      const body = new CANNON.Body({ mass: 0, shape: new CANNON.Box(wall.size) });
      body.position.copy(wall.position);
      body.userData = { kind: wall.kind };
      addStatic(body);
    });
  }

  function initScene() {
    const THREE = window.THREE;
    const viewport = getViewportRect();

    if (!state.renderer) {
      state.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      state.renderer.shadowMap.enabled = true;
      state.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      state.stageEl.append(state.renderer.domElement);
    }

    if (!state.scene) {
      state.scene = new THREE.Scene();

      const ambient = new THREE.HemisphereLight(0xf8fbff, 0x0a1216, 1.15);
      state.scene.add(ambient);

      const key = new THREE.DirectionalLight(0xffffff, 1.08);
      key.position.set(-6, 14, 7);
      key.castShadow = true;
      key.shadow.mapSize.set(512, 512);
      key.shadow.camera.near = 0.1;
      key.shadow.camera.far = 40;
      key.shadow.camera.left = -18;
      key.shadow.camera.right = 18;
      key.shadow.camera.top = 18;
      key.shadow.camera.bottom = -18;
      state.scene.add(key);

      const fill = new THREE.PointLight(0x90d5ff, 0.22, 32);
      fill.position.set(7, 6, -3);
      state.scene.add(fill);
    }

    if (!state.camera) {
      state.camera = new THREE.PerspectiveCamera(32, viewport.width / viewport.height, 0.1, 100);
    }

    createWorldIfNeeded();
    rebuildArena();
  }

  function pointOnEdge(edge, track, inset) {
    const halfWidth = state.worldWidth / 2 - inset;
    const halfDepth = state.worldDepth / 2 - inset;
    switch (edge) {
      case 'left':
        return { x: -halfWidth, z: track };
      case 'right':
        return { x: halfWidth, z: track };
      case 'top':
        return { x: track, z: -halfDepth };
      default:
        return { x: track, z: halfDepth };
    }
  }

  function buildTravelPlan(index, count, dieSize) {
    const sourceEdge = state.rollSourceEdge || 'left';
    const bounceEdge = state.rollBounceEdge || OPPOSITE_EDGE[sourceEdge] || 'right';
    const laneRatio = (index + 1) / (count + 1);
    const laneAcrossWidth = lerp(-(state.worldWidth / 2) + dieSize * 1.8, (state.worldWidth / 2) - dieSize * 1.8, laneRatio);
    const laneAcrossDepth = lerp(-(state.worldDepth / 2) + dieSize * 1.8, (state.worldDepth / 2) - dieSize * 1.8, laneRatio);
    const startTrack = sourceEdge === 'left' || sourceEdge === 'right' ? laneAcrossDepth : laneAcrossWidth;
    const bounceTrack = bounceEdge === 'left' || bounceEdge === 'right'
      ? clamp(
        startTrack + (Math.random() - 0.5) * dieSize * 0.65,
        -(state.worldDepth / 2) + dieSize * 1.1,
        (state.worldDepth / 2) - dieSize * 1.1
      )
      : clamp(
        startTrack + (Math.random() - 0.5) * dieSize * 0.65,
        -(state.worldWidth / 2) + dieSize * 1.1,
        (state.worldWidth / 2) - dieSize * 1.1
      );

    const start = pointOnEdge(sourceEdge, startTrack, dieSize * 0.35);
    const bounce = pointOnEdge(bounceEdge, bounceTrack, dieSize * 0.42);
    return {
      sourceEdge,
      bounceEdge,
      bounceWall: `wall-${bounceEdge}`,
      start,
      bounce
    };
  }

  function getTopFaceValue(quaternion) {
    const THREE = window.THREE;
    let bestValue = 1;
    let bestDot = -Infinity;
    FACE_NORMALS.forEach((face) => {
      const normal = new THREE.Vector3(face.normal[0], face.normal[1], face.normal[2]).applyQuaternion(quaternion);
      if (normal.y > bestDot) {
        bestDot = normal.y;
        bestValue = face.value;
      }
    });
    return bestValue;
  }

  function getClosestTopQuaternion(currentQuaternion, targetValue) {
    let bestQuaternion = null;
    let bestScore = -Infinity;
    [0, Math.PI / 2, Math.PI, Math.PI * 1.5].forEach((yaw) => {
      const candidate = getTopQuaternion(targetValue, yaw);
      const score = Math.abs(currentQuaternion.dot(candidate));
      if (score > bestScore) {
        bestScore = score;
        bestQuaternion = candidate;
      }
    });
    return bestQuaternion || getTopQuaternion(targetValue, 0);
  }

  function getKeptRollIndices(rollValues, keepRule = 'keep-all') {
    if (!Array.isArray(rollValues) || !rollValues.length) return [];
    if (keepRule === 'keep-all') {
      return rollValues.map((_, index) => index);
    }
    if (keepRule === 'drop-lowest') {
      const dropIndex = rollValues.reduce((best, value, index, source) => (
        best === -1 || value < source[best] ? index : best
      ), -1);
      return rollValues.map((_, index) => index).filter((index) => index !== dropIndex);
    }
    if (keepRule === 'drop-highest') {
      const dropIndex = rollValues.reduce((best, value, index, source) => (
        best === -1 || value > source[best] ? index : best
      ), -1);
      return rollValues.map((_, index) => index).filter((index) => index !== dropIndex);
    }
    if (keepRule === 'drop-two-highest') {
      const ranked = rollValues
        .map((value, index) => ({ value, index }))
        .sort((left, right) => right.value - left.value || left.index - right.index);
      const dropped = new Set(ranked.slice(0, 2).map((entry) => entry.index));
      return rollValues.map((_, index) => index).filter((index) => !dropped.has(index));
    }
    return rollValues.map((_, index) => index);
  }

  function getArenaLimits(dieSize) {
    return {
      minX: -(state.worldWidth / 2) + dieSize * 0.56,
      maxX: (state.worldWidth / 2) - dieSize * 0.56,
      minZ: -(state.worldDepth / 2) + dieSize * 0.56,
      maxZ: (state.worldDepth / 2) - dieSize * 0.56,
      minY: dieSize / 2
    };
  }

  function constrainBodyToArena(dieState) {
    const body = dieState.body;
    const limits = getArenaLimits(dieState.dieSize);
    let clamped = false;

    if (body.position.x < limits.minX) {
      body.position.x = limits.minX;
      body.velocity.x = Math.abs(body.velocity.x) * 0.55;
      clamped = true;
    } else if (body.position.x > limits.maxX) {
      body.position.x = limits.maxX;
      body.velocity.x = -Math.abs(body.velocity.x) * 0.55;
      clamped = true;
    }

    if (body.position.z < limits.minZ) {
      body.position.z = limits.minZ;
      body.velocity.z = Math.abs(body.velocity.z) * 0.55;
      clamped = true;
    } else if (body.position.z > limits.maxZ) {
      body.position.z = limits.maxZ;
      body.velocity.z = -Math.abs(body.velocity.z) * 0.55;
      clamped = true;
    }

    if (body.position.y < limits.minY) {
      body.position.y = limits.minY;
      body.velocity.y = Math.max(0, body.velocity.y);
      clamped = true;
    }

    if (clamped) {
      body.angularVelocity.x *= 0.9;
      body.angularVelocity.y *= 0.9;
      body.angularVelocity.z *= 0.9;
      body.aabbNeedsUpdate = true;
    }
  }

  function clampRestPosition(dieState) {
    const limits = getArenaLimits(dieState.dieSize);
    dieState.restPosition.x = clamp(dieState.restPosition.x, limits.minX, limits.maxX);
    dieState.restPosition.z = clamp(dieState.restPosition.z, limits.minZ, limits.maxZ);
    dieState.restPosition.y = Math.max(dieState.restPosition.y, limits.minY);
  }

  function markDieDisplayed(dieState, now) {
    dieState.phase = 'display';
    dieState.displayStart = now;
  }

  function launchDieFromPlan(dieState, reducedMotion) {
    const body = dieState.body;
    const dieSize = dieState.dieSize;
    const plan = dieState.plan;
    const startToBounceX = plan.bounce.x - plan.start.x;
    const startToBounceZ = plan.bounce.z - plan.start.z;
    const travelDistance = Math.max(0.01, magnitude(startToBounceX, startToBounceZ));
    const travelTime = reducedMotion ? 0.46 : 0.62;
    const speed = travelDistance / travelTime;
    const verticalBoost = reducedMotion ? 1.45 : 2.15;

    body.position.set(
      plan.start.x,
      dieSize * (reducedMotion ? 0.88 : 1.02) + (reducedMotion ? 0.05 : Math.random() * 0.12),
      plan.start.z
    );
    body.velocity.set(
      (startToBounceX / travelDistance) * speed,
      verticalBoost,
      (startToBounceZ / travelDistance) * speed
    );
    body.angularVelocity.set(
      (Math.random() > 0.5 ? 1 : -1) * (reducedMotion ? 2.5 : 4.2),
      (Math.random() > 0.5 ? 1 : -1) * (reducedMotion ? 3.2 : 5.3),
      (Math.random() > 0.5 ? 1 : -1) * (reducedMotion ? 2.6 : 4.4)
    );
    body.linearDamping = reducedMotion ? 0.24 : 0.16;
    body.angularDamping = reducedMotion ? 0.28 : 0.2;
    body.force.set(0, 0, 0);
    body.torque.set(0, 0, 0);
    body.sleepState = 0;
    body.timeLastSleepy = 0;
    body.allowSleep = true;
    body.aabbNeedsUpdate = true;
    body.wakeUp();
    dieState.hasBounced = false;
    dieState.bounceAt = 0;
    dieState.canSleepAt = 0;
    dieState.launchedAt = performance.now();
  }

  function beginCorrection(dieState, now, reducedMotion) {
    if (dieState.phase !== 'rolling') return;
    if (state.world && state.world.bodies.includes(dieState.body)) {
      state.world.removeBody(dieState.body);
    }
    dieState.restPosition = dieState.mesh.position.clone();
    clampRestPosition(dieState);
    dieState.correctionFromQuaternion = dieState.mesh.quaternion.clone();
    const topValue = getTopFaceValue(dieState.correctionFromQuaternion);
    dieState.finalValue = topValue;
    dieState.mesh.position.copy(dieState.restPosition);
    dieState.mesh.quaternion.copy(dieState.correctionFromQuaternion);
    markDieDisplayed(dieState, now);
  }

  function createDieState(index, count, reducedMotion) {
    const THREE = window.THREE;
    const CANNON = window.CANNON;
    const dieSize = clamp(Math.min(state.worldWidth, state.worldDepth) * 0.09, 0.95, 1.32);
    const plan = buildTravelPlan(index, count, dieSize);

    const geometry = new THREE.BoxGeometry(dieSize, dieSize, dieSize);
    const materials = createMaterials(state.appearance);
    const mesh = new THREE.Mesh(geometry, materials);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    state.scene.add(mesh);

    const edgeMaterial = new THREE.LineBasicMaterial({
      color: state.appearance.diceEdgeColor,
      transparent: true,
      opacity: 0.05
    });
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), edgeMaterial);
    mesh.add(edges);

    const shape = new CANNON.Box(new CANNON.Vec3(dieSize / 2, dieSize / 2, dieSize / 2));
    const body = new CANNON.Body({
      mass: 1,
      material: state.dieMaterial,
      shape
    });
    body.allowSleep = false;
    body.sleepSpeedLimit = reducedMotion ? 0.46 : 0.34;
    body.sleepTimeLimit = reducedMotion ? 0.18 : 0.24;
    body.collisionFilterGroup = DIE_GROUP;
    body.collisionFilterMask = STATIC_GROUP | DIE_GROUP;

    body.userData = { kind: 'die', index };
    state.world.addBody(body);
    state.dynamicBodies.push(body);

    const dieState = {
      finalValue: null,
      plan,
      dieSize,
      mesh,
      materials,
      edgeMaterial,
      body,
      phase: 'rolling',
      hasBounced: false,
      bounceAt: 0,
      canSleepAt: 0,
      launchedAt: 0,
      displayStart: 0,
      correctionStart: 0,
      correctionDuration: 0,
      correctionFromQuaternion: null,
      correctionToQuaternion: null,
      restPosition: null
    };

    setDiscardedAppearance(dieState, false);

    body.addEventListener('collide', (event) => {
      const kind = event.body && event.body.userData ? event.body.userData.kind : '';
      if (dieState.phase !== 'rolling' || !kind.startsWith('wall-')) {
        return;
      }
      if (kind === `wall-${dieState.plan.sourceEdge}`) {
        return;
      }
      if (kind === dieState.plan.bounceWall && !dieState.hasBounced) {
        dieState.hasBounced = true;
        dieState.bounceAt = performance.now();
        dieState.canSleepAt = dieState.bounceAt + (reducedMotion ? 180 : 260);
        body.linearDamping = reducedMotion ? 0.48 : 0.38;
        body.angularDamping = reducedMotion ? 0.52 : 0.42;
      }
    });

    launchDieFromPlan(dieState, reducedMotion);

    return dieState;
  }

  function syncMeshFromBody(dieState) {
    dieState.mesh.position.set(dieState.body.position.x, dieState.body.position.y, dieState.body.position.z);
    dieState.mesh.quaternion.set(
      dieState.body.quaternion.x,
      dieState.body.quaternion.y,
      dieState.body.quaternion.z,
      dieState.body.quaternion.w
    );
  }

  function disposeDie(dieState) {
    if (dieState.mesh) {
      state.scene.remove(dieState.mesh);
      if (dieState.mesh.geometry) dieState.mesh.geometry.dispose();
    }
    dieState.materials.forEach((material) => material.dispose());
    if (dieState.edgeMaterial) dieState.edgeMaterial.dispose();
  }

  function clearDynamicDice() {
    if (state.fadeTimeoutId) {
      window.clearTimeout(state.fadeTimeoutId);
      state.fadeTimeoutId = 0;
    }
    state.dynamicBodies.forEach((body) => {
      if (state.world && state.world.bodies.includes(body)) {
        state.world.removeBody(body);
      }
    });
    state.dynamicBodies = [];
    state.dice.forEach(disposeDie);
    state.dice = [];
    state.settleCallback = null;
    state.rollStartTime = 0;
    state.displayStartTime = 0;
    state.settledNotified = false;
    state.cleanupStarted = false;
  }

  function stopFrame() {
    if (state.frameId) {
      cancelAnimationFrame(state.frameId);
      state.frameId = 0;
    }
  }

  function hideOverlay() {
    if (!state.overlay) return;
    state.overlay.classList.remove('is-fading');
    state.overlay.hidden = true;
  }

  function applyDisplayedDiceState() {
    const finalValues = state.dice.map((dieState) => dieState.finalValue ?? getTopFaceValue(dieState.mesh.quaternion));
    const keptIndices = new Set(getKeptRollIndices(finalValues, state.keepRule || 'keep-all'));
    state.dice.forEach((dieState, index) => {
      setDiscardedAppearance(dieState, !keptIndices.has(index));
    });
    return finalValues;
  }

  function renderFrame(now) {
    if (!state.renderer || !state.scene || !state.camera || !state.world) return;

    const reducedMotion = prefersReducedMotion();
    const dt = Math.min(0.022, (now - state.lastTime) / 1000 || 0.016);
    state.lastTime = now;

    state.world.step(1 / 90, dt, 4);

    state.dice.forEach((dieState) => {
      if (dieState.phase === 'rolling') {
        constrainBodyToArena(dieState);
        syncMeshFromBody(dieState);
        const elapsed = now - state.rollStartTime;
        const speed = magnitude(dieState.body.velocity.x, dieState.body.velocity.y, dieState.body.velocity.z);
        const spin = magnitude(dieState.body.angularVelocity.x, dieState.body.angularVelocity.y, dieState.body.angularVelocity.z);
        const sleeping = dieState.body.sleepState === BODY_SLEEPING;
        const maxElapsed = reducedMotion ? 1600 : 2600;

        if (sleeping && (!dieState.hasBounced || now >= dieState.canSleepAt)) {
          beginCorrection(dieState, now, reducedMotion);
        } else if (elapsed > maxElapsed) {
          dieState.body.linearDamping = reducedMotion ? 0.62 : 0.54;
          dieState.body.angularDamping = reducedMotion ? 0.68 : 0.6;
          if (speed < (reducedMotion ? 0.68 : 0.56) && spin < (reducedMotion ? 1.45 : 1.2)) {
            dieState.body.sleep();
            beginCorrection(dieState, now, reducedMotion);
          }
        }
      }
    });

    const allDisplayed = state.dice.length > 0 && state.dice.every((dieState) => dieState.phase === 'display');
    if (allDisplayed && !state.settledNotified) {
      state.settledNotified = true;
      state.displayStartTime = now;
      const finalValues = applyDisplayedDiceState();
      if (typeof state.settleCallback === 'function') {
        state.settleCallback(finalValues);
      }
    }

    if (allDisplayed) {
      const holdMs = reducedMotion ? 850 : 1800;
      if ((now - state.displayStartTime) >= holdMs && !state.cleanupStarted) {
        state.cleanupStarted = true;
        state.overlay.classList.add('is-fading');
      }
      if ((now - state.displayStartTime) >= holdMs + 220) {
        cancel();
        return;
      }
    }

    state.renderer.render(state.scene, state.camera);
    state.frameId = requestAnimationFrame(renderFrame);
  }

  function handleResize() {
    if (!state.overlay || state.overlay.hidden) {
      if (state.renderer) {
        rebuildArena();
        state.renderer.render(state.scene, state.camera);
      }
      return;
    }
    cancel();
  }

  function init(options = {}) {
    if (!hasLibraries()) {
      return false;
    }

    const overlay = options.overlay || state.overlay || document.getElementById('diceRollOverlay');
    if (!ensureOverlayElements(overlay)) {
      return false;
    }

    initScene();

    if (!state.resizeBound) {
      window.addEventListener('resize', handleResize);
      state.resizeBound = true;
    }

    hideOverlay();
    state.renderer.render(state.scene, state.camera);
    return true;
  }

  function cancel() {
    stopFrame();
    clearDynamicDice();
    hideOverlay();
  }

  function roll(values, options = {}) {
    if (!Array.isArray(values) || !values.length) {
      if (typeof options.onSettle === 'function') {
        options.onSettle(values);
      }
      return false;
    }

    if (!init({ overlay: options.overlay || state.overlay })) {
      if (typeof options.onSettle === 'function') {
        options.onSettle(values);
      }
      return false;
    }

    cancel();
    rebuildArena();

    state.overlay.hidden = false;
    state.overlay.classList.remove('is-fading');
    state.settleCallback = options.onSettle || null;
    state.keepRule = options.keepRule || 'keep-all';
    state.viewportMode = options.viewportMode || 'window';
    state.appearance = sanitizeAppearance(options.appearance);
    state.rollSourceEdge = EDGE_NAMES[Math.floor(Math.random() * EDGE_NAMES.length)];
    state.rollBounceEdge = OPPOSITE_EDGE[state.rollSourceEdge];
    state.rollStartTime = performance.now();
    state.lastTime = state.rollStartTime;

    const reducedMotion = prefersReducedMotion();

    state.dice = values.map((_, index) => createDieState(index, values.length, reducedMotion));
    state.frameId = requestAnimationFrame(renderFrame);
    return true;
  }

  function destroy() {
    cancel();
    if (state.resizeBound) {
      window.removeEventListener('resize', handleResize);
      state.resizeBound = false;
    }
    state.staticBodies.forEach((body) => state.world.removeBody(body));
    state.staticBodies = [];
    if (state.floorMesh) {
      state.scene.remove(state.floorMesh);
      state.floorMesh.geometry.dispose();
      state.floorMesh = null;
    }
    state.textureCache.forEach((texture) => texture.dispose());
    state.textureCache.clear();
    if (state.renderer) {
      state.renderer.dispose();
      if (state.renderer.domElement && state.renderer.domElement.parentNode) {
        state.renderer.domElement.parentNode.removeChild(state.renderer.domElement);
      }
    }
    state.renderer = null;
    state.scene = null;
    state.camera = null;
    state.world = null;
    state.overlay = null;
    state.sceneEl = null;
    state.stageEl = null;
  }

  window.Dice3DOverlay = {
    init,
    roll,
    cancel,
    destroy
  };
})();
