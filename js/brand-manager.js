/**
 * LOKUPDATE RAJASTHAN - NEWS CREATIVE STUDIO
 * Brand Kit & Identity Manager
 */

class BrandManager {
  constructor() {
    this.settings = window.appStorage.getBrandSettings();
    this.initUI();
  }

  initUI() {
    this.bindSettingsForm();
    this.updateBrandDisplays();
  }

  getSettings() {
    return this.settings;
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    window.appStorage.saveBrandSettings(this.settings);
    this.updateBrandDisplays();
    this.syncLogoWithCanvas();
  }

  updateBrandDisplays() {
    // Update logo preview in Brand Settings view
    const logoPrev = document.getElementById('settingsLogoPreview');
    if (logoPrev) {
      logoPrev.src = this.settings.logoUrl || 'assets/lokupdate-logo-transparent.png';
    }

    // Update color swatches
    const navyHex = document.getElementById('brandNavyHex');
    const yellowHex = document.getElementById('brandYellowHex');
    if (navyHex) navyHex.textContent = this.settings.colors.navy;
    if (yellowHex) yellowHex.textContent = this.settings.colors.yellow;

    // Update form values if present
    const pageNameInput = document.getElementById('brandPageNameInput');
    const handleInput = document.getElementById('brandHandleInput');
    const taglineInput = document.getElementById('brandTaglineInput');
    const toggleLogo = document.getElementById('brandToggleLogo');
    const toggleFooter = document.getElementById('brandToggleFooter');

    if (pageNameInput) pageNameInput.value = this.settings.pageName;
    if (handleInput) handleInput.value = this.settings.handle;
    if (taglineInput) taglineInput.value = this.settings.footerTagline;
    if (toggleLogo) toggleLogo.checked = this.settings.enableLogo !== false;
    if (toggleFooter) toggleFooter.checked = this.settings.enableFooter !== false;
  }

  bindSettingsForm() {
    // Logo Upload Input
    const logoFileInput = document.getElementById('brandLogoFileInput');
    if (logoFileInput) {
      logoFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
          const dataUrl = evt.target.result;
          this.updateSettings({ logoUrl: dataUrl, logoOriginalUrl: dataUrl });
          if (window.showToast) window.showToast('नया लोगो सफलतापूर्वक अपडेट किया गया!', 'success');
        };
        reader.readAsDataURL(file);
      });
    }

    // Reset Logo to Default Uploaded Logo
    const resetLogoBtn = document.getElementById('btnResetDefaultLogo');
    if (resetLogoBtn) {
      resetLogoBtn.addEventListener('click', () => {
        this.updateSettings({
          logoUrl: 'assets/lokupdate-logo-transparent.png',
          logoOriginalUrl: 'assets/lokupdate-logo.png'
        });
        if (window.showToast) window.showToast('ऑफिशियल लोकअपडेट लोगो रीसेट किया गया!', 'info');
      });
    }

    // Color Pickers
    const navyColorPicker = document.getElementById('pickerBrandNavy');
    const yellowColorPicker = document.getElementById('pickerBrandYellow');

    if (navyColorPicker) {
      navyColorPicker.value = this.settings.colors.navy;
      navyColorPicker.addEventListener('input', (e) => {
        this.settings.colors.navy = e.target.value;
        this.updateSettings(this.settings);
      });
    }

    if (yellowColorPicker) {
      yellowColorPicker.value = this.settings.colors.yellow;
      yellowColorPicker.addEventListener('input', (e) => {
        this.settings.colors.yellow = e.target.value;
        this.updateSettings(this.settings);
      });
    }

    // Text inputs
    const saveBtn = document.getElementById('btnSaveBrandSettings');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const pageName = document.getElementById('brandPageNameInput')?.value || 'LokUpdate Rajasthan';
        const handle = document.getElementById('brandHandleInput')?.value || '@lokupdaterajasthan';
        const tagline = document.getElementById('brandTaglineInput')?.value || '';
        const enableLogo = document.getElementById('brandToggleLogo')?.checked !== false;
        const enableFooter = document.getElementById('brandToggleFooter')?.checked !== false;

        this.updateSettings({
          pageName,
          handle,
          footerTagline: tagline,
          enableLogo,
          enableFooter
        });

        if (window.showToast) window.showToast('ब्रांड सेटिंग्स सहेज ली गई हैं!', 'success');
      });
    }
  }

  // Sync canvas logo element with current brand logo
  syncLogoWithCanvas() {
    if (!window.activeCanvasEngine) return;
    const engine = window.activeCanvasEngine;

    const logoElements = engine.elements.filter(el => el.isLogo);
    for (const logoEl of logoElements) {
      logoEl.visible = this.settings.enableLogo;
      if (this.settings.logoUrl) {
        logoEl.loadImage(this.settings.logoUrl);
      }
    }
    engine.render();
  }

  // Insert official logo element directly into canvas
  insertLogoIntoCanvas() {
    if (!window.activeCanvasEngine) return;
    const engine = window.activeCanvasEngine;

    const logoEl = new ImageElement({
      name: 'LokUpdate Brand Logo',
      src: this.settings.logoUrl || 'assets/lokupdate-logo-transparent.png',
      x: 50,
      y: 30,
      width: 210,
      height: 90,
      fitMode: 'contain',
      isLogo: true
    });

    engine.addElement(logoEl);
    if (window.showToast) window.showToast('ब्रांड लोगो कैनवास पर जोड़ा गया!', 'success');
  }
}

window.BrandManager = BrandManager;
