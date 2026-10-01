/**
 * LOKUPDATE RAJASTHAN - NEWS CREATIVE STUDIO
 * Canvas Elements Model (Canva-like extensible elements)
 */

class BaseElement {
  constructor(options = {}) {
    this.id = options.id || 'el_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    this.type = options.type || 'base';
    this.name = options.name || 'Element';
    this.x = options.x || 100;
    this.y = options.y || 100;
    this.width = options.width || 200;
    this.height = options.height || 100;
    this.rotation = options.rotation || 0; // in degrees
    this.opacity = options.opacity !== undefined ? options.opacity : 1;
    this.locked = !!options.locked;
    this.visible = options.visible !== undefined ? options.visible : true;
    this.zIndex = options.zIndex || 0;
  }

  // Get transformed bounding box
  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      right: this.x + this.width,
      bottom: this.y + this.height,
      centerX: this.x + this.width / 2,
      centerY: this.y + this.height / 2
    };
  }

  // Test if point (px, py) is inside element bounds (taking rotation into account)
  containsPoint(px, py) {
    if (!this.visible) return false;
    const b = this.getBounds();
    if (this.rotation === 0) {
      return px >= b.x && px <= b.right && py >= b.y && py <= b.bottom;
    }
    // Convert to local unrotated coordinate space
    const rad = -this.rotation * (Math.PI / 180);
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const dx = px - b.centerX;
    const dy = py - b.centerY;
    const localX = b.centerX + (dx * cos - dy * sin);
    const localY = b.centerY + (dx * sin + dy * cos);
    return localX >= b.x && localX <= b.right && localY >= b.y && localY <= b.bottom;
  }

  // Get 8 resize handles + 1 rotate handle
  getHandles(zoom = 1) {
    const b = this.getBounds();
    const handleSize = 10 / zoom;
    const halfH = handleSize / 2;

    const handles = {
      nw: { x: b.x - halfH, y: b.y - halfH, cursor: 'nwse-resize' },
      n:  { x: b.centerX - halfH, y: b.y - halfH, cursor: 'ns-resize' },
      ne: { x: b.right - halfH, y: b.y - halfH, cursor: 'nesw-resize' },
      e:  { x: b.right - halfH, y: b.centerY - halfH, cursor: 'ew-resize' },
      se: { x: b.right - halfH, y: b.bottom - halfH, cursor: 'nwse-resize' },
      s:  { x: b.centerX - halfH, y: b.bottom - halfH, cursor: 'ns-resize' },
      sw: { x: b.x - halfH, y: b.bottom - halfH, cursor: 'nesw-resize' },
      w:  { x: b.x - halfH, y: b.centerY - halfH, cursor: 'ew-resize' },
      rot: { x: b.centerX - halfH, y: b.y - (24 / zoom) - halfH, cursor: 'grab' }
    };
    return { handles, size: handleSize };
  }

  // Hit-test which handle was clicked
  hitTestHandle(px, py, zoom = 1) {
    const { handles, size } = this.getHandles(zoom);
    const hitSlack = size * 1.5;
    for (const [key, h] of Object.entries(handles)) {
      if (
        px >= h.x - hitSlack &&
        px <= h.x + size + hitSlack &&
        py >= h.y - hitSlack &&
        py <= h.y + size + hitSlack
      ) {
        return key;
      }
    }
    return null;
  }

  clone() {
    const json = this.toJSON();
    json.id = 'el_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    json.x += 25;
    json.y += 25;
    return ElementFactory.fromJSON(json);
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      name: this.name,
      x: Math.round(this.x),
      y: Math.round(this.y),
      width: Math.round(this.width),
      height: Math.round(this.height),
      rotation: Math.round(this.rotation),
      opacity: this.opacity,
      locked: this.locked,
      visible: this.visible,
      zIndex: this.zIndex
    };
  }

  render(ctx) {
    // Override in subclass
  }
}

/**
 * Text Element (Hindi & English Support, auto multi-line wrap, shadow, stroke)
 */
class TextElement extends BaseElement {
  constructor(options = {}) {
    super(options);
    this.type = 'text';
    this.name = options.name || 'Text Box';
    this.text = options.text || 'ख़बर का शीर्षक यहाँ लिखें';
    this.fontFamily = options.fontFamily || 'Noto Sans Devanagari';
    this.fontSize = options.fontSize || 38;
    this.fontWeight = options.fontWeight || '700'; // 400, 600, 700, 800, 900
    this.lineHeight = options.lineHeight || 1.3;
    this.letterSpacing = options.letterSpacing || 0;
    this.color = options.color || '#FFFFFF';
    this.textAlign = options.textAlign || 'left'; // left, center, right
    this.backgroundColor = options.backgroundColor || 'transparent'; // text background pill
    this.backgroundPadding = options.backgroundPadding || 8;
    this.borderRadius = options.borderRadius || 6;
    this.strokeColor = options.strokeColor || 'transparent';
    this.strokeWidth = options.strokeWidth || 0;
    this.shadowColor = options.shadowColor || 'transparent';
    this.shadowBlur = options.shadowBlur || 0;
    this.shadowOffsetX = options.shadowOffsetX || 0;
    this.shadowOffsetY = options.shadowOffsetY || 2;
    this.isHeadline = !!options.isHeadline;
    this.isCategory = !!options.isCategory;
    this.width = options.width || 480;
    this.autoHeight = options.autoHeight !== false;
  }

  // Calculate wrapped lines and height
  measureLines(ctx) {
    ctx.save();
    ctx.font = `${this.fontWeight} ${this.fontSize}px "${this.fontFamily}", sans-serif`;

    const rawLines = (this.text || '').split('\n');
    const computedLines = [];
    const maxW = Math.max(80, this.width - (this.backgroundColor !== 'transparent' ? this.backgroundPadding * 2 : 0));

    for (const rawLine of rawLines) {
      if (!rawLine.trim()) {
        computedLines.push('');
        continue;
      }

      // Word wrapping
      const words = rawLine.split(' ');
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + ' ' + words[i];
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxW) {
          computedLines.push(currentLine);
          currentLine = words[i];
        } else {
          currentLine = testLine;
        }
      }
      computedLines.push(currentLine);
    }

    ctx.restore();

    const lineH = this.fontSize * this.lineHeight;
    const computedHeight = Math.max(40, (computedLines.length * lineH) + (this.backgroundColor !== 'transparent' ? this.backgroundPadding * 2 : 0));
    if (this.autoHeight) {
      this.height = computedHeight;
    }
    return computedLines;
  }

  render(ctx) {
    if (!this.visible) return;

    ctx.save();
    ctx.globalAlpha = this.opacity;

    // Apply rotation
    if (this.rotation !== 0) {
      const cx = this.x + this.width / 2;
      const cy = this.y + this.height / 2;
      ctx.translate(cx, cy);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.translate(-cx, -cy);
    }

    const lines = this.measureLines(ctx);
    const lineH = this.fontSize * this.lineHeight;

    // Background pill/card if set
    if (this.backgroundColor && this.backgroundColor !== 'transparent') {
      ctx.fillStyle = this.backgroundColor;
      if (this.borderRadius > 0 && ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, this.borderRadius);
        ctx.fill();
      } else {
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    }

    ctx.font = `${this.fontWeight} ${this.fontSize}px "${this.fontFamily}", sans-serif`;
    ctx.fillStyle = this.color;
    ctx.textBaseline = 'top';

    // Shadows
    if (this.shadowColor && this.shadowColor !== 'transparent' && this.shadowBlur > 0) {
      ctx.shadowColor = this.shadowColor;
      ctx.shadowBlur = this.shadowBlur;
      ctx.shadowOffsetX = this.shadowOffsetX;
      ctx.shadowOffsetY = this.shadowOffsetY;
    }

    let startY = this.y + (this.backgroundColor !== 'transparent' ? this.backgroundPadding : 0);
    const padX = this.backgroundColor !== 'transparent' ? this.backgroundPadding : 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let lineX = this.x + padX;

      if (this.textAlign === 'center') {
        const lineMetrics = ctx.measureText(line);
        lineX = this.x + (this.width - lineMetrics.width) / 2;
      } else if (this.textAlign === 'right') {
        const lineMetrics = ctx.measureText(line);
        lineX = this.x + this.width - lineMetrics.width - padX;
      }

      // Stroke
      if (this.strokeColor && this.strokeColor !== 'transparent' && this.strokeWidth > 0) {
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.strokeWidth;
        ctx.strokeText(line, lineX, startY + (i * lineH));
      }

      ctx.fillText(line, lineX, startY + (i * lineH));
    }

    ctx.restore();
  }

  toJSON() {
    return {
      ...super.toJSON(),
      text: this.text,
      fontFamily: this.fontFamily,
      fontSize: this.fontSize,
      fontWeight: this.fontWeight,
      lineHeight: this.lineHeight,
      letterSpacing: this.letterSpacing,
      color: this.color,
      textAlign: this.textAlign,
      backgroundColor: this.backgroundColor,
      backgroundPadding: this.backgroundPadding,
      borderRadius: this.borderRadius,
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
      shadowColor: this.shadowColor,
      shadowBlur: this.shadowBlur,
      shadowOffsetX: this.shadowOffsetX,
      shadowOffsetY: this.shadowOffsetY,
      isHeadline: this.isHeadline,
      isCategory: this.isCategory
    };
  }
}

/**
 * Image Element (Multi-image, drag & drop, crop, fit modes, border, shadow)
 */
class ImageElement extends BaseElement {
  constructor(options = {}) {
    super(options);
    this.type = 'image';
    this.name = options.name || 'News Image';
    this.src = options.src || '';
    this.fitMode = options.fitMode || 'cover'; // cover, contain, fill
    this.borderRadius = options.borderRadius || 0;
    this.borderWidth = options.borderWidth || 0;
    this.borderColor = options.borderColor || '#FFFFFF';
    this.shadowBlur = options.shadowBlur || 0;
    this.shadowColor = options.shadowColor || 'transparent';
    this.shadowOffsetY = options.shadowOffsetY || 4;
    this.isLogo = !!options.isLogo;
    this.img = null;
    this.isLoaded = false;

    if (this.src) {
      this.loadImage(this.src);
    }
  }

  loadImage(src) {
    this.src = src;
    this.img = new Image();
    this.img.crossOrigin = 'anonymous';
    this.img.onload = () => {
      this.isLoaded = true;
      if (!this.width || !this.height) {
        const aspect = this.img.width / this.img.height;
        this.width = 400;
        this.height = Math.round(400 / aspect);
      }
      if (window.activeCanvasEngine) {
        window.activeCanvasEngine.requestRender();
      }
    };
    this.img.src = src;
  }

  render(ctx) {
    if (!this.visible || !this.isLoaded || !this.img) return;

    ctx.save();
    ctx.globalAlpha = this.opacity;

    // Apply rotation
    if (this.rotation !== 0) {
      const cx = this.x + this.width / 2;
      const cy = this.y + this.height / 2;
      ctx.translate(cx, cy);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.translate(-cx, -cy);
    }

    // Shadow
    if (this.shadowColor && this.shadowColor !== 'transparent' && this.shadowBlur > 0) {
      ctx.shadowColor = this.shadowColor;
      ctx.shadowBlur = this.shadowBlur;
      ctx.shadowOffsetY = this.shadowOffsetY;
    }

    // Clipping path for rounded corners
    ctx.beginPath();
    if (this.borderRadius > 0 && ctx.roundRect) {
      ctx.roundRect(this.x, this.y, this.width, this.height, this.borderRadius);
    } else {
      ctx.rect(this.x, this.y, this.width, this.height);
    }
    ctx.clip();

    // Draw Image with Fit Mode
    const nw = this.img.naturalWidth || this.img.width;
    const nh = this.img.naturalHeight || this.img.height;

    if (this.fitMode === 'cover') {
      const scale = Math.max(this.width / nw, this.height / nh);
      const sw = this.width / scale;
      const sh = this.height / scale;
      const sx = (nw - sw) / 2;
      const sy = (nh - sh) / 2;
      ctx.drawImage(this.img, sx, sy, sw, sh, this.x, this.y, this.width, this.height);
    } else if (this.fitMode === 'contain') {
      const scale = Math.min(this.width / nw, this.height / nh);
      const dw = nw * scale;
      const dh = nh * scale;
      const dx = this.x + (this.width - dw) / 2;
      const dy = this.y + (this.height - dh) / 2;
      ctx.drawImage(this.img, 0, 0, nw, nh, dx, dy, dw, dh);
    } else {
      // fill / stretch
      ctx.drawImage(this.img, 0, 0, nw, nh, this.x, this.y, this.width, this.height);
    }

    // Border
    if (this.borderWidth > 0 && this.borderColor && this.borderColor !== 'transparent') {
      ctx.strokeStyle = this.borderColor;
      ctx.lineWidth = this.borderWidth;
      ctx.stroke();
    }

    ctx.restore();
  }

  toJSON() {
    return {
      ...super.toJSON(),
      src: this.src,
      fitMode: this.fitMode,
      borderRadius: this.borderRadius,
      borderWidth: this.borderWidth,
      borderColor: this.borderColor,
      shadowBlur: this.shadowBlur,
      shadowColor: this.shadowColor,
      shadowOffsetY: this.shadowOffsetY,
      isLogo: this.isLogo
    };
  }
}

/**
 * Shape Element (Rectangles, Pills, Ribbons, Gradient Overlays, Dividers, Circles)
 */
class ShapeElement extends BaseElement {
  constructor(options = {}) {
    super(options);
    this.type = 'shape';
    this.name = options.name || 'Shape';
    this.shapeType = options.shapeType || 'rect'; // rect, pill, circle, gradient_overlay, divider, ribbon
    this.fillColor = options.fillColor || '#17237F';
    this.strokeColor = options.strokeColor || 'transparent';
    this.strokeWidth = options.strokeWidth || 0;
    this.borderRadius = options.borderRadius || 0;
    this.gradient = options.gradient || null; // { type: 'linear', stops: [{offset: 0, color: '#000'}, {offset: 1, color: '#fff'}] }
    this.shadowBlur = options.shadowBlur || 0;
    this.shadowColor = options.shadowColor || 'transparent';
    this.shadowOffsetY = options.shadowOffsetY || 4;
  }

  render(ctx) {
    if (!this.visible) return;

    ctx.save();
    ctx.globalAlpha = this.opacity;

    // Apply rotation
    if (this.rotation !== 0) {
      const cx = this.x + this.width / 2;
      const cy = this.y + this.height / 2;
      ctx.translate(cx, cy);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.translate(-cx, -cy);
    }

    if (this.shadowColor && this.shadowColor !== 'transparent' && this.shadowBlur > 0) {
      ctx.shadowColor = this.shadowColor;
      ctx.shadowBlur = this.shadowBlur;
      ctx.shadowOffsetY = this.shadowOffsetY;
    }

    // Determine Fill Style (Solid or Gradient)
    if (this.gradient && this.gradient.stops && this.gradient.stops.length > 0) {
      let grad;
      if (this.gradient.direction === 'horizontal') {
        grad = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y);
      } else {
        grad = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
      }
      for (const stop of this.gradient.stops) {
        grad.addColorStop(stop.offset, stop.color);
      }
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = this.fillColor;
    }

    ctx.strokeStyle = this.strokeColor;
    ctx.lineWidth = this.strokeWidth;

    // Render Shape Geometries
    ctx.beginPath();
    if (this.shapeType === 'circle') {
      const rx = this.width / 2;
      const ry = this.height / 2;
      ctx.ellipse(this.x + rx, this.y + ry, rx, ry, 0, 0, 2 * Math.PI);
    } else if (this.shapeType === 'pill') {
      const r = Math.min(this.width, this.height) / 2;
      if (ctx.roundRect) {
        ctx.roundRect(this.x, this.y, this.width, this.height, r);
      } else {
        ctx.rect(this.x, this.y, this.width, this.height);
      }
    } else if (this.shapeType === 'divider') {
      ctx.moveTo(this.x, this.y + this.height / 2);
      ctx.lineTo(this.x + this.width, this.y + this.height / 2);
      ctx.stroke();
      ctx.restore();
      return;
    } else if (this.shapeType === 'ribbon') {
      // News Ribbon with angular notch
      const notch = 18;
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.width, this.y);
      ctx.lineTo(this.x + this.width - notch, this.y + this.height / 2);
      ctx.lineTo(this.x + this.width, this.y + this.height);
      ctx.lineTo(this.x, this.y + this.height);
      ctx.closePath();
    } else {
      // Standard or Rounded Rect
      if (this.borderRadius > 0 && ctx.roundRect) {
        ctx.roundRect(this.x, this.y, this.width, this.height, this.borderRadius);
      } else {
        ctx.rect(this.x, this.y, this.width, this.height);
      }
    }

    if (this.fillColor !== 'transparent' || this.gradient) {
      ctx.fill();
    }
    if (this.strokeWidth > 0 && this.strokeColor !== 'transparent') {
      ctx.stroke();
    }

    ctx.restore();
  }

  toJSON() {
    return {
      ...super.toJSON(),
      shapeType: this.shapeType,
      fillColor: this.fillColor,
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
      borderRadius: this.borderRadius,
      gradient: this.gradient,
      shadowBlur: this.shadowBlur,
      shadowColor: this.shadowColor,
      shadowOffsetY: this.shadowOffsetY
    };
  }
}

/**
 * News Badge Component (Breaking live badge, category pill with live dot)
 */
class BadgeElement extends BaseElement {
  constructor(options = {}) {
    super(options);
    this.type = 'badge';
    this.name = options.name || 'News Badge';
    this.label = options.label || 'BREAKING NEWS';
    this.hindiLabel = options.hindiLabel || 'बड़ी खबर';
    this.badgeStyle = options.badgeStyle || 'breaking'; // breaking, rajasthan, category, location
    this.fillColor = options.fillColor || '#FFC400';
    this.textColor = options.textColor || '#0B1340';
    this.fontFamily = options.fontFamily || 'Poppins';
    this.fontSize = options.fontSize || 18;
    this.showPulseDot = options.showPulseDot !== false;
    this.height = options.height || 42;
    this.width = options.width || 240;
  }

  render(ctx) {
    if (!this.visible) return;

    ctx.save();
    ctx.globalAlpha = this.opacity;

    // Apply rotation
    if (this.rotation !== 0) {
      const cx = this.x + this.width / 2;
      const cy = this.y + this.height / 2;
      ctx.translate(cx, cy);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.translate(-cx, -cy);
    }

    // Badge Background (Pill or angled block)
    ctx.fillStyle = this.fillColor;
    const r = 6;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(this.x, this.y, this.width, this.height, r);
      ctx.fill();
    } else {
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    // Live Pulse Dot
    let textStartX = this.x + 16;
    if (this.showPulseDot) {
      const dotX = this.x + 18;
      const dotY = this.y + this.height / 2;
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(dotX, dotY, 5, 0, 2 * Math.PI);
      ctx.fill();
      textStartX = dotX + 14;
    }

    // Typography
    ctx.fillStyle = this.textColor;
    ctx.font = `800 ${this.fontSize}px "${this.fontFamily}", sans-serif`;
    ctx.textBaseline = 'middle';

    const fullText = this.label + (this.hindiLabel ? ` | ${this.hindiLabel}` : '');
    ctx.fillText(fullText, textStartX, this.y + this.height / 2);

    ctx.restore();
  }

  toJSON() {
    return {
      ...super.toJSON(),
      label: this.label,
      hindiLabel: this.hindiLabel,
      badgeStyle: this.badgeStyle,
      fillColor: this.fillColor,
      textColor: this.textColor,
      fontFamily: this.fontFamily,
      fontSize: this.fontSize,
      showPulseDot: this.showPulseDot
    };
  }
}

/**
 * Factory for creating elements from JSON representations
 */
class ElementFactory {
  static fromJSON(data) {
    switch (data.type) {
      case 'text':
        return new TextElement(data);
      case 'image':
        return new ImageElement(data);
      case 'shape':
        return new ShapeElement(data);
      case 'badge':
        return new BadgeElement(data);
      default:
        return new BaseElement(data);
    }
  }
}

window.BaseElement = BaseElement;
window.TextElement = TextElement;
window.ImageElement = ImageElement;
window.ShapeElement = ShapeElement;
window.BadgeElement = BadgeElement;
window.ElementFactory = ElementFactory;
