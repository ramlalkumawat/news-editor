/**
 * LOKUPDATE RAJASTHAN - NEWS CREATIVE STUDIO
 * Interactive Canva-grade Canvas Engine
 * Manages rendering loop, transformations, 8-point resizing, snapping, history, and exports.
 */

class CanvasEngine {
  constructor(canvasElement, options = {}) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d', { alpha: false });

    // Target Canvas Dimensions (Defaults to Instagram Square 1080x1080)
    this.width = options.width || 1080;
    this.height = options.height || 1080;

    // Viewport Display Scale & Zoom
    this.zoom = 1;
    this.displayScale = 1;

    // Elements & State
    this.elements = [];
    this.selectedElement = null;
    this.backgroundColor = '#FFFFFF';
    this.backgroundImage = null;

    // Interaction State
    this.isDragging = false;
    this.isResizing = false;
    this.isRotating = false;
    this.activeHandle = null;
    this.dragStart = { x: 0, y: 0 };
    this.elementStartBounds = null;
    this.clipboardElement = null;

    // Snapping Guides
    this.snapThreshold = 8;
    this.activeGuides = { x: null, y: null };

    // History (Undo / Redo)
    this.history = [];
    this.historyIndex = -1;
    this.maxHistory = 40;
    this.isHistoryAction = false;

    // Callbacks
    this.onSelectionChange = options.onSelectionChange || null;
    this.onModified = options.onModified || null;

    // Initialize
    this.initCanvasSize();
    this.bindEvents();
    this.recordState();
  }

  initCanvasSize() {
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.updateViewportScale();
    this.render();
  }

  setDimensions(w, h) {
    this.width = Math.max(300, parseInt(w));
    this.height = Math.max(300, parseInt(h));
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.updateViewportScale();
    this.recordState();
    this.render();
    if (this.onModified) this.onModified();
  }

  updateViewportScale() {
    const parent = this.canvas.parentElement;
    if (!parent) return;

    const availableW = parent.clientWidth - 80;
    const availableH = parent.clientHeight - 80;

    const fitScale = Math.min(availableW / this.width, availableH / this.height);
    this.displayScale = fitScale * this.zoom;

    // Apply CSS transform to the canvas artboard wrapper
    const wrapper = this.canvas.parentElement;
    wrapper.style.width = `${this.width}px`;
    wrapper.style.height = `${this.height}px`;
    wrapper.style.transform = `scale(${this.displayScale})`;

    // Notify dimensions
    const badge = document.getElementById('canvasDimensionText');
    if (badge) {
      badge.textContent = `${this.width} × ${this.height} px`;
    }
  }

  setZoom(val) {
    this.zoom = Math.max(0.15, Math.min(2.5, val));
    this.updateViewportScale();
    const zoomText = document.getElementById('zoomPercentageText');
    if (zoomText) {
      zoomText.textContent = `${Math.round(this.zoom * 100)}%`;
    }
  }

  // --- ELEMENT MANAGEMENT ---
  addElement(element) {
    element.zIndex = this.elements.length;
    this.elements.push(element);
    this.selectElement(element);
    this.recordState();
    this.render();
    if (this.onModified) this.onModified();
    return element;
  }

  removeElement(element) {
    const idx = this.elements.indexOf(element);
    if (idx !== -1) {
      this.elements.splice(idx, 1);
      if (this.selectedElement === element) {
        this.selectElement(null);
      }
      this.recordState();
      this.render();
      if (this.onModified) this.onModified();
    }
  }

  selectElement(element) {
    this.selectedElement = element;
    this.render();
    if (this.onSelectionChange) {
      this.onSelectionChange(this.selectedElement);
    }
  }

  clearElements() {
    this.elements = [];
    this.selectedElement = null;
    this.render();
    if (this.onSelectionChange) this.onSelectionChange(null);
  }

  // --- LAYER CONTROLS ---
  bringToFront() {
    if (!this.selectedElement) return;
    const idx = this.elements.indexOf(this.selectedElement);
    if (idx < this.elements.length - 1) {
      this.elements.splice(idx, 1);
      this.elements.push(this.selectedElement);
      this.recordState();
      this.render();
      if (this.onModified) this.onModified();
    }
  }

  sendToBack() {
    if (!this.selectedElement) return;
    const idx = this.elements.indexOf(this.selectedElement);
    if (idx > 0) {
      this.elements.splice(idx, 1);
      this.elements.unshift(this.selectedElement);
      this.recordState();
      this.render();
      if (this.onModified) this.onModified();
    }
  }

  bringForward() {
    if (!this.selectedElement) return;
    const idx = this.elements.indexOf(this.selectedElement);
    if (idx < this.elements.length - 1) {
      const temp = this.elements[idx + 1];
      this.elements[idx + 1] = this.selectedElement;
      this.elements[idx] = temp;
      this.recordState();
      this.render();
      if (this.onModified) this.onModified();
    }
  }

  sendBackward() {
    if (!this.selectedElement) return;
    const idx = this.elements.indexOf(this.selectedElement);
    if (idx > 0) {
      const temp = this.elements[idx - 1];
      this.elements[idx - 1] = this.selectedElement;
      this.elements[idx] = temp;
      this.recordState();
      this.render();
      if (this.onModified) this.onModified();
    }
  }

  duplicateSelected() {
    if (!this.selectedElement) return;
    const copy = this.selectedElement.clone();
    this.addElement(copy);
  }

  deleteSelected() {
    if (!this.selectedElement) return;
    this.removeElement(this.selectedElement);
  }

  // --- ALIGNMENT ---
  alignSelected(alignment) {
    if (!this.selectedElement) return;
    const el = this.selectedElement;
    switch (alignment) {
      case 'left':
        el.x = 40;
        break;
      case 'center':
        el.x = (this.width - el.width) / 2;
        break;
      case 'right':
        el.x = this.width - el.width - 40;
        break;
      case 'top':
        el.y = 40;
        break;
      case 'middle':
        el.y = (this.height - el.height) / 2;
        break;
      case 'bottom':
        el.y = this.height - el.height - 40;
        break;
    }
    this.recordState();
    this.render();
    if (this.onModified) this.onModified();
  }

  // --- MOUSE COORDINATE TRANSFORMATION ---
  getCanvasPoint(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  // --- EVENT BINDINGS ---
  bindEvents() {
    this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    window.addEventListener('mouseup', (e) => this.handleMouseUp(e));

    // Touch Support
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        this.handleMouseDown({ clientX: touch.clientX, clientY: touch.clientY, button: 0 });
      }
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && (this.isDragging || this.isResizing || this.isRotating)) {
        const touch = e.touches[0];
        this.handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
        e.preventDefault();
      }
    }, { passive: false });

    window.addEventListener('touchend', (e) => {
      this.handleMouseUp(e);
    });

    // Window resize
    window.addEventListener('resize', () => {
      this.updateViewportScale();
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));
  }

  handleMouseDown(e) {
    if (e.button !== 0) return; // Only left mouse button

    const pt = this.getCanvasPoint(e);

    // 1. Check if clicking on a resize or rotate handle of selected element
    if (this.selectedElement && !this.selectedElement.locked) {
      const handle = this.selectedElement.hitTestHandle(pt.x, pt.y, this.zoom);
      if (handle) {
        if (handle === 'rot') {
          this.isRotating = true;
        } else {
          this.isResizing = true;
          this.activeHandle = handle;
        }
        this.dragStart = pt;
        this.elementStartBounds = { ...this.selectedElement.getBounds(), rotation: this.selectedElement.rotation };
        return;
      }
    }

    // 2. Hit test top-most element
    let hit = null;
    for (let i = this.elements.length - 1; i >= 0; i--) {
      if (this.elements[i].containsPoint(pt.x, pt.y)) {
        hit = this.elements[i];
        break;
      }
    }

    if (hit) {
      this.selectElement(hit);
      if (!hit.locked) {
        this.isDragging = true;
        this.dragStart = pt;
        this.elementStartBounds = { x: hit.x, y: hit.y, width: hit.width, height: hit.height };
      }
    } else {
      this.selectElement(null);
    }
  }

  handleMouseMove(e) {
    const pt = this.getCanvasPoint(e);

    // Update cursor when hovering over handles
    if (!this.isDragging && !this.isResizing && !this.isRotating && this.selectedElement && !this.selectedElement.locked) {
      const handle = this.selectedElement.hitTestHandle(pt.x, pt.y, this.zoom);
      if (handle) {
        const { handles } = this.selectedElement.getHandles(this.zoom);
        this.canvas.style.cursor = handles[handle] ? handles[handle].cursor : 'default';
        return;
      } else if (this.selectedElement.containsPoint(pt.x, pt.y)) {
        this.canvas.style.cursor = 'move';
        return;
      } else {
        this.canvas.style.cursor = 'default';
      }
    }

    // A. Dragging Element
    if (this.isDragging && this.selectedElement && !this.selectedElement.locked) {
      const dx = pt.x - this.dragStart.x;
      const dy = pt.y - this.dragStart.y;

      let targetX = this.elementStartBounds.x + dx;
      let targetY = this.elementStartBounds.y + dy;

      // Snapping Guides
      this.activeGuides = { x: null, y: null };
      const centerX = targetX + this.selectedElement.width / 2;
      const centerY = targetY + this.selectedElement.height / 2;

      // Snap to canvas center X
      if (Math.abs(centerX - this.width / 2) < this.snapThreshold) {
        targetX = this.width / 2 - this.selectedElement.width / 2;
        this.activeGuides.x = this.width / 2;
      }
      // Snap to canvas center Y
      if (Math.abs(centerY - this.height / 2) < this.snapThreshold) {
        targetY = this.height / 2 - this.selectedElement.height / 2;
        this.activeGuides.y = this.height / 2;
      }

      this.selectedElement.x = Math.round(targetX);
      this.selectedElement.y = Math.round(targetY);
      this.render();
      return;
    }

    // B. Resizing Element
    if (this.isResizing && this.selectedElement && !this.selectedElement.locked) {
      const dx = pt.x - this.dragStart.x;
      const dy = pt.y - this.dragStart.y;
      const b = this.elementStartBounds;
      const handle = this.activeHandle;
      const minSize = 24;

      if (handle.includes('e')) {
        this.selectedElement.width = Math.max(minSize, Math.round(b.width + dx));
      }
      if (handle.includes('s')) {
        this.selectedElement.height = Math.max(minSize, Math.round(b.height + dy));
      }
      if (handle.includes('w')) {
        const newW = Math.max(minSize, Math.round(b.width - dx));
        this.selectedElement.x = Math.round(b.x + (b.width - newW));
        this.selectedElement.width = newW;
      }
      if (handle.includes('n')) {
        const newH = Math.max(minSize, Math.round(b.height - dy));
        this.selectedElement.y = Math.round(b.y + (b.height - newH));
        this.selectedElement.height = newH;
      }

      this.render();
      return;
    }

    // C. Rotating Element
    if (this.isRotating && this.selectedElement && !this.selectedElement.locked) {
      const cx = this.elementStartBounds.centerX;
      const cy = this.elementStartBounds.centerY;
      const rad = Math.atan2(pt.y - cy, pt.x - cx);
      let deg = Math.round((rad * 180) / Math.PI) + 90;
      if (deg < 0) deg += 360;

      // Snap to 0, 90, 180, 270 degrees
      if (Math.abs(deg % 90) < 4 || Math.abs(deg % 90) > 86) {
        deg = Math.round(deg / 90) * 90;
      }

      this.selectedElement.rotation = deg % 360;
      this.render();
    }
  }

  handleMouseUp() {
    let wasAction = this.isDragging || this.isResizing || this.isRotating;
    this.isDragging = false;
    this.isResizing = false;
    this.isRotating = false;
    this.activeHandle = null;
    this.activeGuides = { x: null, y: null };
    this.canvas.style.cursor = 'default';

    if (wasAction) {
      this.recordState();
      this.render();
      if (this.onModified) this.onModified();
    }
  }

  handleKeyDown(e) {
    // If user is typing in an input field or textarea, do not intercept keyboard commands
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
      return;
    }

    // Delete / Backspace
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (this.selectedElement && !this.selectedElement.locked) {
        e.preventDefault();
        this.deleteSelected();
      }
    }

    // Undo (Ctrl+Z) / Redo (Ctrl+Y or Ctrl+Shift+Z)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      if (e.shiftKey) this.redo();
      else this.undo();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      this.redo();
    }

    // Duplicate (Ctrl+D)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
      e.preventDefault();
      this.duplicateSelected();
    }

    // Copy (Ctrl+C)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
      if (this.selectedElement) {
        this.clipboardElement = this.selectedElement.clone();
      }
    }

    // Paste (Ctrl+V)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
      if (this.clipboardElement) {
        const pasted = this.clipboardElement.clone();
        this.addElement(pasted);
      }
    }

    // Deselect (Escape)
    if (e.key === 'Escape') {
      this.selectElement(null);
    }

    // Nudge with Arrow Keys
    if (this.selectedElement && !this.selectedElement.locked && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
      const step = e.shiftKey ? 10 : 1;
      if (e.key === 'ArrowUp') this.selectedElement.y -= step;
      if (e.key === 'ArrowDown') this.selectedElement.y += step;
      if (e.key === 'ArrowLeft') this.selectedElement.x -= step;
      if (e.key === 'ArrowRight') this.selectedElement.x += step;
      this.render();
      if (this.onModified) this.onModified();
    }
  }

  // --- RENDERING LOOP ---
  render(isExport = false) {
    const ctx = this.ctx;

    // Clear Canvas
    ctx.clearRect(0, 0, this.width, this.height);

    // Draw Background
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0, 0, this.width, this.height);

    // Render All Elements in z-index order
    for (const el of this.elements) {
      el.render(ctx);
    }

    // Draw Selection Overlay & Snapping Guides (Skip during export)
    if (!isExport) {
      this.renderSnappingGuides(ctx);
      if (this.selectedElement) {
        this.renderSelectionBox(ctx, this.selectedElement);
      }
    }
  }

  requestRender() {
    this.render();
  }

  renderSelectionBox(ctx, el) {
    ctx.save();

    // Selection Border
    const b = el.getBounds();
    ctx.strokeStyle = '#17237F';
    ctx.lineWidth = 2 / this.zoom;
    ctx.setLineDash([4 / this.zoom, 4 / this.zoom]);

    if (el.rotation !== 0) {
      ctx.translate(b.centerX, b.centerY);
      ctx.rotate((el.rotation * Math.PI) / 180);
      ctx.strokeRect(-el.width / 2, -el.height / 2, el.width, el.height);
      ctx.restore();
      return;
    }

    ctx.strokeRect(b.x, b.y, b.width, b.height);
    ctx.setLineDash([]);

    // Draw 8 Resize Handles + Rotate Handle
    if (!el.locked) {
      const { handles, size } = el.getHandles(this.zoom);

      for (const [key, h] of Object.entries(handles)) {
        if (key === 'rot') {
          // Connect rotate handle with line
          ctx.beginPath();
          ctx.strokeStyle = '#17237F';
          ctx.lineWidth = 1.5 / this.zoom;
          ctx.moveTo(b.centerX, b.y);
          ctx.lineTo(b.centerX, h.y + size / 2);
          ctx.stroke();

          // Circle for rotate handle
          ctx.fillStyle = '#FFC400';
          ctx.beginPath();
          ctx.arc(h.x + size / 2, h.y + size / 2, size / 1.5, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
        } else {
          // Square for resize handles
          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = '#17237F';
          ctx.lineWidth = 1.5 / this.zoom;
          ctx.fillRect(h.x, h.y, size, size);
          ctx.strokeRect(h.x, h.y, size, size);
        }
      }
    }

    ctx.restore();
  }

  renderSnappingGuides(ctx) {
    if (this.activeGuides.x !== null) {
      ctx.save();
      ctx.strokeStyle = '#2563EB';
      ctx.lineWidth = 1.5 / this.zoom;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(this.activeGuides.x, 0);
      ctx.lineTo(this.activeGuides.x, this.height);
      ctx.stroke();
      ctx.restore();
    }
    if (this.activeGuides.y !== null) {
      ctx.save();
      ctx.strokeStyle = '#2563EB';
      ctx.lineWidth = 1.5 / this.zoom;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, this.activeGuides.y);
      ctx.lineTo(this.width, this.activeGuides.y);
      ctx.stroke();
      ctx.restore();
    }
  }

  // --- HISTORY (UNDO / REDO) ---
  recordState() {
    if (this.isHistoryAction) return;

    // Discard redo history ahead of index
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }

    const state = {
      width: this.width,
      height: this.height,
      backgroundColor: this.backgroundColor,
      elements: this.elements.map(el => el.toJSON())
    };

    this.history.push(JSON.stringify(state));
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    } else {
      this.historyIndex++;
    }

    this.updateHistoryButtons();
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.restoreState(this.history[this.historyIndex]);
    }
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.restoreState(this.history[this.historyIndex]);
    }
  }

  restoreState(stateJson) {
    this.isHistoryAction = true;
    try {
      const state = JSON.parse(stateJson);
      this.width = state.width;
      this.height = state.height;
      this.backgroundColor = state.backgroundColor;
      this.canvas.width = this.width;
      this.canvas.height = this.height;

      this.elements = state.elements.map(item => ElementFactory.fromJSON(item));
      this.selectElement(null);
      this.updateViewportScale();
      this.render();
      if (this.onModified) this.onModified();
    } catch (e) {
      console.error('History restore error:', e);
    } finally {
      this.isHistoryAction = false;
      this.updateHistoryButtons();
    }
  }

  updateHistoryButtons() {
    const undoBtn = document.getElementById('btnUndo');
    const redoBtn = document.getElementById('btnRedo');
    if (undoBtn) undoBtn.disabled = this.historyIndex <= 0;
    if (redoBtn) redoBtn.disabled = this.historyIndex >= this.history.length - 1;
  }

  // --- SERIALIZATION & EXPORT ---
  toJSON() {
    return {
      version: '1.0',
      width: this.width,
      height: this.height,
      backgroundColor: this.backgroundColor,
      elements: this.elements.map(el => el.toJSON())
    };
  }

  fromJSON(data) {
    this.width = data.width || 1080;
    this.height = data.height || 1080;
    this.backgroundColor = data.backgroundColor || '#FFFFFF';
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.elements = (data.elements || []).map(item => ElementFactory.fromJSON(item));
    this.selectElement(null);
    this.updateViewportScale();
    this.recordState();
    this.render();
    if (this.onModified) this.onModified();
  }

  // Render clean export without selection box or handles
  async exportImage(format = 'png', quality = 0.95) {
    // Re-render canvas cleanly
    this.render(true);

    const mimeType = format.toLowerCase() === 'jpg' || format.toLowerCase() === 'jpeg'
      ? 'image/jpeg'
      : 'image/png';

    const dataUrl = this.canvas.toDataURL(mimeType, quality);

    // Restore interactive overlay
    this.render(false);
    return dataUrl;
  }

  // Generate lightweight thumbnail for design library
  async generateThumbnail(maxDim = 320) {
    const offCanvas = document.createElement('canvas');
    const aspect = this.width / this.height;
    if (aspect >= 1) {
      offCanvas.width = maxDim;
      offCanvas.height = Math.round(maxDim / aspect);
    } else {
      offCanvas.height = maxDim;
      offCanvas.width = Math.round(maxDim * aspect);
    }
    const offCtx = offCanvas.getContext('2d');
    offCtx.drawImage(this.canvas, 0, 0, offCanvas.width, offCanvas.height);
    return offCanvas.toDataURL('image/jpeg', 0.82);
  }
}

window.CanvasEngine = CanvasEngine;
