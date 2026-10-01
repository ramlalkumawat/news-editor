/**
 * LOKUPDATE RAJASTHAN - NEWS CREATIVE STUDIO
 * Main Application Orchestrator
 */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Toast Notification System
  window.showToast = function(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
    } else if (type === 'error') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
    } else if (type === 'warning') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
    } else {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFC400" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    }

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px) scale(0.95)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  };

  // 2. Initialize Canvas Engine
  const canvasElement = document.getElementById('newsCanvas');
  const canvasEngine = new CanvasEngine(canvasElement, {
    width: 1080,
    height: 1080,
    onSelectionChange: (el) => updateInspector(el),
    onModified: () => {
      // Auto-save draft debounce
      clearTimeout(window._draftTimer);
      window._draftTimer = setTimeout(() => {
        window.appStorage.saveDraft(canvasEngine.toJSON());
      }, 1500);
    }
  });
  window.activeCanvasEngine = canvasEngine;

  // 3. Initialize Sub-Managers
  const brandManager = new BrandManager();
  window.activeBrandManager = brandManager;
  const newsEditor = new NewsContentEditor();
  window.activeNewsEditor = newsEditor;

  // 4. Load Initial Template (Default Breaking News)
  const draft = window.appStorage.loadDraft();
  if (draft && draft.data && draft.data.elements && draft.data.elements.length > 0) {
    canvasEngine.fromJSON(draft.data);
  } else {
    canvasEngine.fromJSON(PREBUILT_TEMPLATES[0].data);
  }

  // 5. Navigation Router (News Editor, My Templates, Saved Designs, Brand Settings, Export History)
  const navButtons = document.querySelectorAll('.nav-item-btn');
  const views = {
    editor: document.getElementById('view-editor'),
    templates: document.getElementById('view-templates'),
    designs: document.getElementById('view-designs'),
    brand: document.getElementById('view-brand'),
    history: document.getElementById('view-history')
  };

  function switchView(viewName) {
    navButtons.forEach(btn => {
      if (btn.dataset.view === viewName) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    Object.entries(views).forEach(([name, el]) => {
      if (!el) return;
      if (name === viewName) {
        el.classList.add('active');
        if (name === 'editor') {
          el.style.display = 'flex';
          setTimeout(() => canvasEngine.updateViewportScale(), 50);
        } else {
          el.style.display = 'block';
        }
      } else {
        el.classList.remove('active');
        el.style.display = 'none';
      }
    });

    if (viewName === 'templates') renderTemplatesView();
    if (viewName === 'designs') renderSavedDesignsView();
    if (viewName === 'history') renderHistoryView();
    if (viewName === 'brand') brandManager.updateBrandDisplays();
  }

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      switchView(btn.dataset.view);
    });
  });

  // 6. Canvas Size Presets
  const sizeSelect = document.getElementById('canvasSizeSelect');
  if (sizeSelect) {
    sizeSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === 'square') {
        canvasEngine.setDimensions(1080, 1080);
      } else if (val === 'portrait') {
        canvasEngine.setDimensions(1080, 1350);
      } else if (val === 'story') {
        canvasEngine.setDimensions(1080, 1920);
      } else if (val === 'custom') {
        openCustomSizeModal();
      }
    });
  }

  // 7. Zoom Controls
  document.getElementById('btnZoomIn')?.addEventListener('click', () => {
    canvasEngine.setZoom(canvasEngine.zoom + 0.1);
  });
  document.getElementById('btnZoomOut')?.addEventListener('click', () => {
    canvasEngine.setZoom(canvasEngine.zoom - 0.1);
  });
  document.getElementById('btnZoomFit')?.addEventListener('click', () => {
    canvasEngine.setZoom(1.0);
  });

  // 8. Topbar Action Buttons
  document.getElementById('btnUndo')?.addEventListener('click', () => canvasEngine.undo());
  document.getElementById('btnRedo')?.addEventListener('click', () => canvasEngine.redo());

  // Left Drawer Tabs Switching
  const leftTabs = document.querySelectorAll('.editor-nav-tab');
  const drawerPanes = document.querySelectorAll('.drawer-tab-pane');
  const drawer = document.getElementById('editorDrawer');

  leftTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.dataset.tab;
      
      // If clicking already active tab, toggle collapse
      if (tab.classList.contains('active')) {
        drawer.classList.toggle('collapsed');
        if (drawer.classList.contains('collapsed')) {
          tab.classList.remove('active');
        }
        return;
      }

      drawer.classList.remove('collapsed');
      leftTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      drawerPanes.forEach(pane => {
        if (pane.id === `tab-${tabId}`) pane.classList.add('active');
        else pane.classList.remove('active');
      });

      document.getElementById('drawerTitleText').textContent = tab.querySelector('span').textContent;
    });
  });

  document.getElementById('btnCloseDrawer')?.addEventListener('click', () => {
    drawer.classList.add('collapsed');
    leftTabs.forEach(t => t.classList.remove('active'));
  });

  // Render Mini Templates inside Left Drawer
  function populateDrawerTemplates() {
    const list = document.getElementById('drawerTemplatesList');
    if (!list) return;
    list.innerHTML = '';

    PREBUILT_TEMPLATES.forEach(tmpl => {
      const card = document.createElement('div');
      card.className = 'template-item-mini';
      card.innerHTML = `
        <div style="background:#0E1642; padding:12px; height:120px; display:flex; flex-direction:column; justify-content:center; align-items:center; color:#FFC400; font-weight:800; text-align:center;">
          <span style="font-size:11px; background:#FFC400; color:#0B1340; padding:2px 8px; border-radius:10px; margin-bottom:6px;">${tmpl.category}</span>
          <span style="font-size:13px; color:#fff;">${tmpl.name}</span>
        </div>
        <div class="info">${tmpl.name}</div>
      `;
      card.addEventListener('click', () => {
        if (confirm(`क्या आप '${tmpl.name}' टेम्पलेट लोड करना चाहते हैं? वर्तमान कैनवास बदल जाएगा।`)) {
          canvasEngine.fromJSON(tmpl.data);
          window.showToast(`टेम्पलेट लोड किया गया: ${tmpl.name}`, 'success');
        }
      });
      list.appendChild(card);
    });
  }
  populateDrawerTemplates();

  // 9. Quick Text Add Buttons in Drawer
  document.getElementById('btnAddHeadline')?.addEventListener('click', () => {
    const el = new TextElement({
      name: 'Headline',
      text: 'मुख्य समाचार शीर्षक यहाँ टाइप करें',
      fontFamily: 'Rozha One',
      fontSize: 42,
      fontWeight: '800',
      color: canvasEngine.backgroundColor === '#FFFFFF' ? '#0B1340' : '#FFFFFF',
      x: 60,
      y: 350,
      width: canvasEngine.width - 120,
      isHeadline: true
    });
    canvasEngine.addElement(el);
  });

  document.getElementById('btnAddSubheading')?.addEventListener('click', () => {
    const el = new TextElement({
      name: 'Subheading',
      text: 'समाचार का उप-शीर्षक या विवरण यहाँ लिखें',
      fontFamily: 'Poppins',
      fontSize: 26,
      fontWeight: '600',
      color: canvasEngine.backgroundColor === '#FFFFFF' ? '#17237F' : '#FFC400',
      x: 60,
      y: 450,
      width: canvasEngine.width - 120
    });
    canvasEngine.addElement(el);
  });

  document.getElementById('btnAddBodyText')?.addEventListener('click', () => {
    const el = new TextElement({
      name: 'Body Text',
      text: '• घटना से जुड़ी पूरी जानकारी और मुख्य बिंदु यहाँ दर्ज करें।\n• प्रशासन की ओर से त्वरित कार्रवाई के निर्देश दिए गए हैं।',
      fontFamily: 'Noto Sans Devanagari',
      fontSize: 22,
      fontWeight: '500',
      lineHeight: 1.45,
      color: canvasEngine.backgroundColor === '#FFFFFF' ? '#334155' : '#E2E8F0',
      x: 60,
      y: 520,
      width: canvasEngine.width - 120
    });
    canvasEngine.addElement(el);
  });

  document.getElementById('btnAddBreakingBadge')?.addEventListener('click', () => {
    const el = new BadgeElement({
      name: 'Breaking Badge',
      label: 'BREAKING NEWS',
      hindiLabel: 'बड़ी खबर',
      x: 60,
      y: 60,
      width: 280,
      height: 48,
      fillColor: '#FFC400',
      textColor: '#0B1340',
      fontSize: 18,
      showPulseDot: true
    });
    canvasEngine.addElement(el);
  });

  // 10. Quick Shape Add Buttons in Drawer
  document.getElementById('btnAddRectShape')?.addEventListener('click', () => {
    const el = new ShapeElement({
      name: 'Rectangle',
      shapeType: 'rect',
      x: 100,
      y: 100,
      width: 300,
      height: 180,
      fillColor: '#17237F',
      borderRadius: 12
    });
    canvasEngine.addElement(el);
  });

  document.getElementById('btnAddCircleShape')?.addEventListener('click', () => {
    const el = new ShapeElement({
      name: 'Circle',
      shapeType: 'circle',
      x: 150,
      y: 150,
      width: 200,
      height: 200,
      fillColor: '#FFC400'
    });
    canvasEngine.addElement(el);
  });

  document.getElementById('btnAddPillShape')?.addEventListener('click', () => {
    const el = new ShapeElement({
      name: 'Pill Badge',
      shapeType: 'pill',
      x: 100,
      y: 200,
      width: 240,
      height: 50,
      fillColor: '#17237F',
      strokeColor: '#FFC400',
      strokeWidth: 2
    });
    canvasEngine.addElement(el);
  });

  document.getElementById('btnAddDividerLine')?.addEventListener('click', () => {
    const el = new ShapeElement({
      name: 'Divider Line',
      shapeType: 'divider',
      x: 60,
      y: 300,
      width: canvasEngine.width - 120,
      height: 4,
      strokeColor: '#FFC400',
      strokeWidth: 3
    });
    canvasEngine.addElement(el);
  });

  document.getElementById('btnAddGradientOverlay')?.addEventListener('click', () => {
    const el = new ShapeElement({
      name: 'Gradient Vignette',
      shapeType: 'rect',
      x: 0,
      y: canvasEngine.height - 450,
      width: canvasEngine.width,
      height: 450,
      gradient: {
        direction: 'vertical',
        stops: [
          { offset: 0, color: 'rgba(11, 19, 64, 0)' },
          { offset: 1, color: 'rgba(11, 19, 64, 0.95)' }
        ]
      }
    });
    canvasEngine.addElement(el);
  });

  // Add Brand Logo to Canvas Button
  document.getElementById('btnInsertBrandLogo')?.addEventListener('click', () => {
    brandManager.insertLogoIntoCanvas();
  });

  // 11. Image Uploads & Dropzone
  const uploadInput = document.getElementById('photoFileInput');
  const uploadDropzone = document.getElementById('uploadDropzone');

  if (uploadDropzone && uploadInput) {
    uploadDropzone.addEventListener('click', () => uploadInput.click());

    uploadDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadDropzone.classList.add('dragover');
    });

    uploadDropzone.addEventListener('dragleave', () => {
      uploadDropzone.classList.remove('dragover');
    });

    uploadDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadDropzone.classList.remove('dragover');
      if (e.dataTransfer.files.length > 0) {
        handleImageUpload(e.dataTransfer.files[0]);
      }
    });

    uploadInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleImageUpload(e.target.files[0]);
      }
    });
  }

  // Also support drag & drop directly on center canvas
  const canvasWrapper = document.getElementById('canvasArtboardWrapper');
  if (canvasWrapper) {
    canvasWrapper.addEventListener('dragover', (e) => e.preventDefault());
    canvasWrapper.addEventListener('drop', (e) => {
      e.preventDefault();
      if (e.dataTransfer.files.length > 0) {
        handleImageUpload(e.dataTransfer.files[0]);
      }
    });
  }

  async function handleImageUpload(file) {
    if (!file.type.startsWith('image/')) {
      window.showToast('कृपया केवल मान्य फोटो (JPG, PNG, WEBP) अपलोड करें!', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const dataUrl = evt.target.result;
      const asset = {
        name: file.name,
        src: dataUrl,
        size: file.size
      };
      await window.appStorage.saveUploadedAsset(asset);
      renderUploadsGallery();

      // If an image element is currently selected, replace its source!
      if (canvasEngine.selectedElement && canvasEngine.selectedElement.type === 'image') {
        canvasEngine.selectedElement.loadImage(dataUrl);
        window.showToast('चयनित फोटो को बदला गया!', 'success');
      } else {
        // Add new image element to canvas
        const imgEl = new ImageElement({
          name: file.name,
          src: dataUrl,
          x: 60,
          y: 160,
          width: 960,
          height: 480,
          borderRadius: 12
        });
        canvasEngine.addElement(imgEl);
        window.showToast('फोटो कैनवास पर जोड़ी गई!', 'success');
      }
    };
    reader.readAsDataURL(file);
  }

  async function renderUploadsGallery() {
    const gallery = document.getElementById('uploadsGallery');
    if (!gallery) return;

    const assets = await window.appStorage.getUploadedAssets();
    gallery.innerHTML = '';

    if (assets.length === 0) {
      gallery.innerHTML = '<div style="grid-column: span 2; text-align:center; padding:16px; color:#94A3B8; font-size:12px;">कोई फोटो अपलोड नहीं है</div>';
      return;
    }

    assets.forEach(asset => {
      const item = document.createElement('div');
      item.className = 'upload-item-thumb';
      item.innerHTML = `
        <img src="${asset.src}" alt="${asset.name}" />
        <button class="thumb-del-btn" title="Delete Photo">&times;</button>
      `;

      item.querySelector('img').addEventListener('click', () => {
        if (canvasEngine.selectedElement && canvasEngine.selectedElement.type === 'image') {
          canvasEngine.selectedElement.loadImage(asset.src);
          window.showToast('फोटो बदली गई!', 'success');
        } else {
          const imgEl = new ImageElement({
            name: asset.name,
            src: asset.src,
            x: 60,
            y: 160,
            width: 960,
            height: 480,
            borderRadius: 12
          });
          canvasEngine.addElement(imgEl);
        }
      });

      item.querySelector('.thumb-del-btn').addEventListener('click', async (e) => {
        e.stopPropagation();
        await window.appStorage.deleteUploadedAsset(asset.id);
        renderUploadsGallery();
      });

      gallery.appendChild(item);
    });
  }
  renderUploadsGallery();

  // 12. Background Color Controls
  document.querySelectorAll('.bg-color-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      const color = btn.dataset.color;
      canvasEngine.backgroundColor = color;
      canvasEngine.recordState();
      canvasEngine.render();
    });
  });

  const customBgColorPicker = document.getElementById('customBgColorPicker');
  if (customBgColorPicker) {
    customBgColorPicker.addEventListener('input', (e) => {
      canvasEngine.backgroundColor = e.target.value;
      canvasEngine.render();
    });
    customBgColorPicker.addEventListener('change', () => {
      canvasEngine.recordState();
    });
  }

  // 13. Inspector (Right Sidebar) Dynamic Binding
  function updateInspector(el) {
    const noSelection = document.getElementById('inspectorNoSelection');
    const textProps = document.getElementById('inspectorTextProperties');
    const imageProps = document.getElementById('inspectorImageProperties');
    const shapeProps = document.getElementById('inspectorShapeProperties');
    const commonProps = document.getElementById('inspectorCommonProperties');

    if (!el) {
      if (noSelection) noSelection.style.display = 'block';
      if (textProps) textProps.style.display = 'none';
      if (imageProps) imageProps.style.display = 'none';
      if (shapeProps) shapeProps.style.display = 'none';
      if (commonProps) commonProps.style.display = 'none';
      updateLayersList();
      return;
    }

    if (noSelection) noSelection.style.display = 'none';
    if (commonProps) commonProps.style.display = 'flex';

    // Position & Dimension Inputs
    const propX = document.getElementById('propX');
    const propY = document.getElementById('propY');
    const propW = document.getElementById('propW');
    const propH = document.getElementById('propH');
    const propOpacity = document.getElementById('propOpacity');
    const propOpacityVal = document.getElementById('propOpacityVal');

    if (propX) propX.value = Math.round(el.x);
    if (propY) propY.value = Math.round(el.y);
    if (propW) propW.value = Math.round(el.width);
    if (propH) propH.value = Math.round(el.height);
    if (propOpacity) propOpacity.value = Math.round(el.opacity * 100);
    if (propOpacityVal) propOpacityVal.textContent = `${Math.round(el.opacity * 100)}%`;

    // Type Specific Panels
    if (el.type === 'text') {
      if (textProps) textProps.style.display = 'flex';
      if (imageProps) imageProps.style.display = 'none';
      if (shapeProps) shapeProps.style.display = 'none';

      const propText = document.getElementById('propTextContent');
      const propFont = document.getElementById('propFontFamily');
      const propFontSize = document.getElementById('propFontSize');
      const propFontSizeVal = document.getElementById('propFontSizeVal');
      const propFontWeight = document.getElementById('propFontWeight');
      const propTextColor = document.getElementById('propTextColor');

      if (propText) propText.value = el.text;
      if (propFont) propFont.value = el.fontFamily;
      if (propFontSize) propFontSize.value = el.fontSize;
      if (propFontSizeVal) propFontSizeVal.textContent = `${el.fontSize}px`;
      if (propFontWeight) propFontWeight.value = el.fontWeight;
      if (propTextColor) propTextColor.value = el.color.startsWith('#') ? el.color : '#FFFFFF';
    } else if (el.type === 'image') {
      if (textProps) textProps.style.display = 'none';
      if (imageProps) imageProps.style.display = 'flex';
      if (shapeProps) shapeProps.style.display = 'none';

      const propFit = document.getElementById('propImageFit');
      const propRadius = document.getElementById('propImageRadius');
      const propBorder = document.getElementById('propImageBorder');

      if (propFit) propFit.value = el.fitMode;
      if (propRadius) propRadius.value = el.borderRadius;
      if (propBorder) propBorder.value = el.borderWidth;
    } else if (el.type === 'shape') {
      if (textProps) textProps.style.display = 'none';
      if (imageProps) imageProps.style.display = 'none';
      if (shapeProps) shapeProps.style.display = 'flex';

      const propFill = document.getElementById('propShapeFill');
      const propStroke = document.getElementById('propShapeStroke');
      const propShapeRadius = document.getElementById('propShapeRadius');

      if (propFill && el.fillColor.startsWith('#')) propFill.value = el.fillColor;
      if (propStroke && el.strokeColor.startsWith('#')) propStroke.value = el.strokeColor;
      if (propShapeRadius) propShapeRadius.value = el.borderRadius || 0;
    }

    updateLayersList();
  }

  // Bind Inspector Input Changes
  document.getElementById('propTextContent')?.addEventListener('input', (e) => {
    if (canvasEngine.selectedElement && canvasEngine.selectedElement.type === 'text') {
      canvasEngine.selectedElement.text = e.target.value;
      canvasEngine.render();
    }
  });

  document.getElementById('propFontFamily')?.addEventListener('change', (e) => {
    if (canvasEngine.selectedElement && canvasEngine.selectedElement.type === 'text') {
      canvasEngine.selectedElement.fontFamily = e.target.value;
      canvasEngine.recordState();
      canvasEngine.render();
    }
  });

  document.getElementById('propFontSize')?.addEventListener('input', (e) => {
    if (canvasEngine.selectedElement && canvasEngine.selectedElement.type === 'text') {
      canvasEngine.selectedElement.fontSize = parseInt(e.target.value);
      document.getElementById('propFontSizeVal').textContent = `${e.target.value}px`;
      canvasEngine.render();
    }
  });

  document.getElementById('propFontWeight')?.addEventListener('change', (e) => {
    if (canvasEngine.selectedElement && canvasEngine.selectedElement.type === 'text') {
      canvasEngine.selectedElement.fontWeight = e.target.value;
      canvasEngine.recordState();
      canvasEngine.render();
    }
  });

  document.getElementById('propTextColor')?.addEventListener('input', (e) => {
    if (canvasEngine.selectedElement && canvasEngine.selectedElement.type === 'text') {
      canvasEngine.selectedElement.color = e.target.value;
      canvasEngine.render();
    }
  });

  // Text Alignment
  document.querySelectorAll('.btn-align-text').forEach(btn => {
    btn.addEventListener('click', () => {
      if (canvasEngine.selectedElement && canvasEngine.selectedElement.type === 'text') {
        canvasEngine.selectedElement.textAlign = btn.dataset.align;
        canvasEngine.recordState();
        canvasEngine.render();
      }
    });
  });

  // Image Property Bindings
  document.getElementById('propImageFit')?.addEventListener('change', (e) => {
    if (canvasEngine.selectedElement && canvasEngine.selectedElement.type === 'image') {
      canvasEngine.selectedElement.fitMode = e.target.value;
      canvasEngine.recordState();
      canvasEngine.render();
    }
  });

  document.getElementById('propImageRadius')?.addEventListener('input', (e) => {
    if (canvasEngine.selectedElement && canvasEngine.selectedElement.type === 'image') {
      canvasEngine.selectedElement.borderRadius = parseInt(e.target.value);
      canvasEngine.render();
    }
  });

  document.getElementById('propImageBorder')?.addEventListener('input', (e) => {
    if (canvasEngine.selectedElement && canvasEngine.selectedElement.type === 'image') {
      canvasEngine.selectedElement.borderWidth = parseInt(e.target.value);
      canvasEngine.render();
    }
  });

  document.getElementById('btnReplaceImage')?.addEventListener('click', () => {
    uploadInput.click();
  });

  // Shape Property Bindings
  document.getElementById('propShapeFill')?.addEventListener('input', (e) => {
    if (canvasEngine.selectedElement && canvasEngine.selectedElement.type === 'shape') {
      canvasEngine.selectedElement.fillColor = e.target.value;
      canvasEngine.render();
    }
  });

  document.getElementById('propShapeStroke')?.addEventListener('input', (e) => {
    if (canvasEngine.selectedElement && canvasEngine.selectedElement.type === 'shape') {
      canvasEngine.selectedElement.strokeColor = e.target.value;
      canvasEngine.selectedElement.strokeWidth = 2;
      canvasEngine.render();
    }
  });

  document.getElementById('propShapeRadius')?.addEventListener('input', (e) => {
    if (canvasEngine.selectedElement && canvasEngine.selectedElement.type === 'shape') {
      canvasEngine.selectedElement.borderRadius = parseInt(e.target.value);
      canvasEngine.render();
    }
  });

  // Opacity & Common Bindings
  document.getElementById('propOpacity')?.addEventListener('input', (e) => {
    if (canvasEngine.selectedElement) {
      canvasEngine.selectedElement.opacity = parseInt(e.target.value) / 100;
      document.getElementById('propOpacityVal').textContent = `${e.target.value}%`;
      canvasEngine.render();
    }
  });

  // Alignments on Canvas
  document.querySelectorAll('.btn-canvas-align').forEach(btn => {
    btn.addEventListener('click', () => {
      canvasEngine.alignSelected(btn.dataset.align);
    });
  });

  // Layer Actions
  document.getElementById('btnLayerFront')?.addEventListener('click', () => canvasEngine.bringToFront());
  document.getElementById('btnLayerBack')?.addEventListener('click', () => canvasEngine.sendToBack());
  document.getElementById('btnLayerForward')?.addEventListener('click', () => canvasEngine.bringForward());
  document.getElementById('btnLayerBackward')?.addEventListener('click', () => canvasEngine.sendBackward());
  document.getElementById('btnDuplicateSelected')?.addEventListener('click', () => canvasEngine.duplicateSelected());
  document.getElementById('btnDeleteSelected')?.addEventListener('click', () => canvasEngine.deleteSelected());

  // Render Layer Items List in Inspector
  function updateLayersList() {
    const list = document.getElementById('inspectorLayersList');
    if (!list) return;
    list.innerHTML = '';

    // Render layers in reverse z-index (top layer first)
    const reversed = [...canvasEngine.elements].reverse();
    reversed.forEach(el => {
      const item = document.createElement('div');
      item.className = `layer-item ${canvasEngine.selectedElement === el ? 'active' : ''}`;
      
      let icon = '📄';
      if (el.type === 'text') icon = '🔤';
      else if (el.type === 'image') icon = '🖼️';
      else if (el.type === 'shape') icon = '🔷';
      else if (el.type === 'badge') icon = '🔴';

      item.innerHTML = `
        <span class="icon">${icon}</span>
        <span class="name">${el.name}</span>
        <div class="actions">
          <button class="btn-icon btn-sm" title="${el.locked ? 'Unlock' : 'Lock'}">${el.locked ? '🔒' : '🔓'}</button>
        </div>
      `;

      item.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') {
          canvasEngine.selectElement(el);
        }
      });

      item.querySelector('button').addEventListener('click', (e) => {
        e.stopPropagation();
        el.locked = !el.locked;
        canvasEngine.render();
        updateLayersList();
      });

      list.appendChild(item);
    });
  }

  // 14. Save Design to Local Designs
  document.getElementById('btnSaveDesign')?.addEventListener('click', async () => {
    const titleInput = document.getElementById('projectTitleInput');
    const title = titleInput?.value.trim() || 'LokUpdate Post';

    const thumbnail = await canvasEngine.generateThumbnail();
    const design = {
      name: title,
      aspectRatio: `${canvasEngine.width}x${canvasEngine.height}`,
      width: canvasEngine.width,
      height: canvasEngine.height,
      thumbnail: thumbnail,
      data: canvasEngine.toJSON()
    };

    await window.appStorage.saveDesign(design);
    window.showToast('डिज़ाइन सफलतापूर्वक सेव की गई!', 'success');
  });

  // Save As Custom Template
  document.getElementById('btnSaveAsTemplate')?.addEventListener('click', async () => {
    const name = prompt('नए कस्टम टेम्पलेट का नाम दर्ज करें (Template Name):', 'My Custom News Template');
    if (!name || !name.trim()) return;

    const thumbnail = await canvasEngine.generateThumbnail();
    const tmpl = {
      name: name.trim(),
      category: 'CUSTOM TEMPLATES',
      aspectRatio: `${canvasEngine.width}x${canvasEngine.height}`,
      description: 'उपयोगकर्ता द्वारा तैयार कस्टम टेम्पलेट',
      thumbnail: thumbnail,
      data: canvasEngine.toJSON()
    };

    await window.appStorage.saveCustomTemplate(tmpl);
    window.showToast(`कस्टम टेम्पलेट '${name}' सेव हो गया!`, 'success');
  });

  // 15. Export & Download Handler
  document.getElementById('btnDownloadModal')?.addEventListener('click', () => {
    openExportModal();
  });

  function openExportModal() {
    const modal = document.getElementById('exportModal');
    if (modal) modal.classList.add('active');
  }

  window.closeExportModal = function() {
    const modal = document.getElementById('exportModal');
    if (modal) modal.classList.remove('active');
  };

  document.getElementById('btnConfirmExport')?.addEventListener('click', async () => {
    const format = document.getElementById('exportFormatSelect')?.value || 'png';
    const quality = parseFloat(document.getElementById('exportQualitySelect')?.value || '1.0');
    const filenameInput = document.getElementById('exportFilenameInput');

    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const defaultName = `LokUpdate_Rajasthan_${timestamp}`;
    const filename = (filenameInput?.value.trim() || defaultName) + `.${format}`;

    window.showToast('हाई-क्वालिटी इमेज तैयार हो रही है...', 'info');

    try {
      const dataUrl = await canvasEngine.exportImage(format, quality);

      // Trigger Browser Download
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Save to Export History
      const thumbnail = await canvasEngine.generateThumbnail(240);
      await window.appStorage.addExportLog({
        filename: filename,
        format: format.toUpperCase(),
        dimensions: `${canvasEngine.width} × ${canvasEngine.height}`,
        thumbnail: thumbnail,
        downloadUrl: dataUrl
      });

      closeExportModal();
      window.showToast('पोस्ट सफलतापूर्वक डाउनलोड हो गई!', 'success');
    } catch (err) {
      console.error('Export error:', err);
      window.showToast('डाउनलोड में त्रुटि हुई, कृपया पुनः प्रयास करें!', 'error');
    }
  });

  // 16. Custom Size Modal Handler
  function openCustomSizeModal() {
    const modal = document.getElementById('customSizeModal');
    if (modal) modal.classList.add('active');
  }

  window.closeCustomSizeModal = function() {
    const modal = document.getElementById('customSizeModal');
    if (modal) modal.classList.remove('active');
  };

  document.getElementById('btnApplyCustomSize')?.addEventListener('click', () => {
    const w = parseInt(document.getElementById('customWidthInput')?.value || '1080');
    const h = parseInt(document.getElementById('customHeightInput')?.value || '1080');
    if (w < 200 || h < 200) {
      window.showToast('चौड़ाई व ऊंचाई कम से कम 200px होनी चाहिए', 'warning');
      return;
    }
    canvasEngine.setDimensions(w, h);
    closeCustomSizeModal();
    window.showToast(`कैनवास आकार ${w}×${h} सेट किया गया`, 'info');
  });

  // 17. Render Saved Designs View
  async function renderSavedDesignsView() {
    const grid = document.getElementById('savedDesignsGrid');
    if (!grid) return;

    const list = await window.appStorage.getSavedDesigns();
    grid.innerHTML = '';

    if (list.length === 0) {
      grid.innerHTML = `
        <div class="saved-designs-empty" style="grid-column: 1 / -1;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          <h3>कोई सेव की गई डिज़ाइन नहीं है</h3>
          <p>न्यूज़ एडिटर में पोस्टर तैयार करें और 'Save' बटन पर क्लिक करके यहाँ सुरक्षित करें।</p>
          <button class="btn btn-primary" onclick="window.switchViewDirect('editor')">नया पोस्टर बनाएं</button>
        </div>
      `;
      return;
    }

    list.forEach(design => {
      const card = document.createElement('div');
      card.className = 'template-card';
      card.innerHTML = `
        <div class="template-preview-box">
          <img src="${design.thumbnail}" alt="${design.name}" />
          <span class="badge badge-yellow template-badge">${design.aspectRatio || '1:1'}</span>
        </div>
        <div class="template-info">
          <div class="template-title">${design.name}</div>
          <div class="template-meta">
            <span>${new Date(design.updatedAt).toLocaleDateString()}</span>
            <span>${design.width}×${design.height}</span>
          </div>
          <div class="template-actions">
            <button class="btn btn-primary btn-sm btn-open-design" style="flex:1;">ओपन करें</button>
            <button class="btn btn-secondary btn-sm btn-dup-design" title="Duplicate">📋</button>
            <button class="btn btn-danger btn-sm btn-del-design" title="Delete">🗑️</button>
          </div>
        </div>
      `;

      card.querySelector('.btn-open-design').addEventListener('click', () => {
        canvasEngine.fromJSON(design.data);
        document.getElementById('projectTitleInput').value = design.name;
        switchView('editor');
        window.showToast(`डिज़ाइन लोड की गई: ${design.name}`, 'info');
      });

      card.querySelector('.btn-dup-design').addEventListener('click', async () => {
        const copy = { ...design, id: null, name: design.name + ' (Copy)' };
        await window.appStorage.saveDesign(copy);
        renderSavedDesignsView();
        window.showToast('डिज़ाइन कॉपी तैयार की गई', 'success');
      });

      card.querySelector('.btn-del-design').addEventListener('click', async () => {
        if (confirm(`क्या आप '${design.name}' को हटाना चाहते हैं?`)) {
          await window.appStorage.deleteDesign(design.id);
          renderSavedDesignsView();
          window.showToast('डिज़ाइन हटाई गई', 'info');
        }
      });

      grid.appendChild(card);
    });
  }

  // 18. Render Templates View (Pre-built + Custom)
  async function renderTemplatesView() {
    const grid = document.getElementById('templatesViewGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const customTemplates = await window.appStorage.getCustomTemplates();
    const allTemplates = [...PREBUILT_TEMPLATES, ...customTemplates];

    allTemplates.forEach(tmpl => {
      const card = document.createElement('div');
      card.className = 'template-card';
      
      let badgeStyle = 'badge-navy';
      if (tmpl.category === 'BREAKING NEWS') badgeStyle = 'badge-red';
      else if (tmpl.category === 'RAJASTHAN NEWS' || tmpl.category === 'JAIPUR NEWS') badgeStyle = 'badge-yellow';

      card.innerHTML = `
        <div class="template-preview-box">
          <div style="width:100%; height:100%; background: #0E1642; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px; text-align:center;">
            <img src="assets/lokupdate-logo-transparent.png" style="max-height:50px; object-fit:contain; margin-bottom:12px;" />
            <h3 style="color:#FFC400; font-family:'Rozha One', serif; font-size:18px; margin-bottom:6px;">${tmpl.name}</h3>
            <p style="color:#CBD5E1; font-size:12px;">${tmpl.description}</p>
          </div>
          <span class="badge ${badgeStyle} template-badge">${tmpl.category}</span>
        </div>
        <div class="template-info">
          <div class="template-title">${tmpl.name}</div>
          <div class="template-meta">
            <span>${tmpl.aspectRatio || '1:1'}</span>
            <span>Instagram Post</span>
          </div>
          <div class="template-actions">
            <button class="btn btn-primary btn-sm btn-use-template" style="flex:1;">इस टेम्पलेट से बनाएं</button>
            ${tmpl.id.startsWith('tmpl_') && !PREBUILT_TEMPLATES.some(p => p.id === tmpl.id) ? '<button class="btn btn-danger btn-sm btn-del-custom-tmpl">🗑️</button>' : ''}
          </div>
        </div>
      `;

      card.querySelector('.btn-use-template').addEventListener('click', () => {
        canvasEngine.fromJSON(tmpl.data);
        switchView('editor');
        window.showToast(`टेम्पलेट लोड किया गया: ${tmpl.name}`, 'success');
      });

      const delBtn = card.querySelector('.btn-del-custom-tmpl');
      if (delBtn) {
        delBtn.addEventListener('click', async () => {
          if (confirm(`क्या आप कस्टम टेम्पलेट '${tmpl.name}' हटाना चाहते हैं?`)) {
            await window.appStorage.deleteCustomTemplate(tmpl.id);
            renderTemplatesView();
            window.showToast('टेम्पलेट हटाया गया', 'info');
          }
        });
      }

      grid.appendChild(card);
    });
  }

  // 19. Render Export History View
  async function renderHistoryView() {
    const tbody = document.getElementById('exportHistoryTableBody');
    if (!tbody) return;

    const list = await window.appStorage.getExportHistory();
    tbody.innerHTML = '';

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:32px; color:#94A3B8;">अभी तक कोई डाउनलोड हिस्ट्री नहीं है।</td></tr>';
      return;
    }

    list.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><img src="${item.thumbnail}" class="history-thumb" /></td>
        <td><strong>${item.filename}</strong></td>
        <td><span class="badge badge-navy">${item.format}</span></td>
        <td>${item.dimensions}</td>
        <td>${item.dateFormatted}</td>
        <td>
          <a href="${item.downloadUrl}" download="${item.filename}" class="btn btn-secondary btn-sm">पुनः डाउनलोड</a>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  document.getElementById('btnClearExportHistory')?.addEventListener('click', async () => {
    if (confirm('क्या आप पूरी एक्सपोर्ट हिस्ट्री साफ करना चाहते हैं?')) {
      await window.appStorage.clearExportHistory();
      renderHistoryView();
      window.showToast('हिस्ट्री साफ कर दी गई है', 'info');
    }
  });

  window.switchViewDirect = switchView;
});
