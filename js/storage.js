/**
 * LOKUPDATE RAJASTHAN - NEWS CREATIVE STUDIO
 * Storage Module (IndexedDB + LocalStorage)
 * Handles persistence for brand settings, saved designs, custom templates, and export history.
 */

const DB_NAME = 'LokUpdateRajasthanNewsDB';
const DB_VERSION = 1;

const STORES = {
  DESIGNS: 'saved_designs',
  TEMPLATES: 'custom_templates',
  EXPORTS: 'export_history',
  ASSETS: 'uploaded_assets',
  SETTINGS: 'app_settings'
};

class StorageManager {
  constructor() {
    this.db = null;
    this.dbReady = this.initDB();
  }

  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORES.DESIGNS)) {
          db.createObjectStore(STORES.DESIGNS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.TEMPLATES)) {
          db.createObjectStore(STORES.TEMPLATES, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.EXPORTS)) {
          const exportStore = db.createObjectStore(STORES.EXPORTS, { keyPath: 'id' });
          exportStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        if (!db.objectStoreNames.contains(STORES.ASSETS)) {
          db.createObjectStore(STORES.ASSETS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
          db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error('IndexedDB Error:', event.target.error);
        resolve(null); // Fallback to localStorage gracefully
      };
    });
  }

  // --- BRAND SETTINGS ---
  getDefaultBrandSettings() {
    return {
      logoUrl: 'assets/lokupdate-logo-transparent.png',
      logoOriginalUrl: 'assets/lokupdate-logo.png',
      logoSize: 130, // px height
      logoPosition: 'top-left', // top-left, top-right, top-center, bottom-left, bottom-right
      enableLogo: true,
      enableFooter: true,
      pageName: 'LokUpdate Rajasthan',
      hindiName: 'लोकअपडेट राजस्थान',
      handle: '@lokupdaterajasthan',
      footerTagline: 'सच की आवाज़ • प्रदेश का भरोसेमंद डिजिटल न्यूज़ नेटवर्क',
      colors: {
        navy: '#17237F',
        navyDark: '#0B1340',
        yellow: '#FFC400',
        white: '#FFFFFF',
        red: '#DC2626'
      }
    };
  }

  getBrandSettings() {
    try {
      const stored = localStorage.getItem('lokupdate_brand_settings');
      if (stored) {
        return { ...this.getDefaultBrandSettings(), ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('LocalStorage read error', e);
    }
    return this.getDefaultBrandSettings();
  }

  saveBrandSettings(settings) {
    try {
      localStorage.setItem('lokupdate_brand_settings', JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save brand settings:', e);
    }
  }

  // --- SAVED DESIGNS ---
  async getSavedDesigns() {
    await this.dbReady;
    if (!this.db) {
      const str = localStorage.getItem('lokupdate_saved_designs');
      return str ? JSON.parse(str) : [];
    }

    return new Promise((resolve) => {
      const tx = this.db.transaction(STORES.DESIGNS, 'readonly');
      const store = tx.objectStore(STORES.DESIGNS);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  }

  async saveDesign(design) {
    await this.dbReady;
    if (!design.id) {
      design.id = 'design_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    }
    design.updatedAt = new Date().toISOString();

    if (!this.db) {
      const list = await this.getSavedDesigns();
      const idx = list.findIndex(d => d.id === design.id);
      if (idx >= 0) list[idx] = design;
      else list.unshift(design);
      localStorage.setItem('lokupdate_saved_designs', JSON.stringify(list));
      return design;
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(STORES.DESIGNS, 'readwrite');
      const store = tx.objectStore(STORES.DESIGNS);
      const req = store.put(design);
      req.onsuccess = () => resolve(design);
      req.onerror = (e) => reject(e);
    });
  }

  async getDesignById(id) {
    await this.dbReady;
    if (!this.db) {
      const list = await this.getSavedDesigns();
      return list.find(d => d.id === id) || null;
    }

    return new Promise((resolve) => {
      const tx = this.db.transaction(STORES.DESIGNS, 'readonly');
      const store = tx.objectStore(STORES.DESIGNS);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  }

  async deleteDesign(id) {
    await this.dbReady;
    if (!this.db) {
      let list = await this.getSavedDesigns();
      list = list.filter(d => d.id !== id);
      localStorage.setItem('lokupdate_saved_designs', JSON.stringify(list));
      return true;
    }

    return new Promise((resolve) => {
      const tx = this.db.transaction(STORES.DESIGNS, 'readwrite');
      const store = tx.objectStore(STORES.DESIGNS);
      const req = store.delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  }

  // --- CUSTOM TEMPLATES ---
  async getCustomTemplates() {
    await this.dbReady;
    if (!this.db) {
      const str = localStorage.getItem('lokupdate_custom_templates');
      return str ? JSON.parse(str) : [];
    }

    return new Promise((resolve) => {
      const tx = this.db.transaction(STORES.TEMPLATES, 'readonly');
      const store = tx.objectStore(STORES.TEMPLATES);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  }

  async saveCustomTemplate(template) {
    await this.dbReady;
    if (!template.id) {
      template.id = 'tmpl_' + Date.now();
    }
    template.createdAt = new Date().toISOString();

    if (!this.db) {
      const list = await this.getCustomTemplates();
      list.unshift(template);
      localStorage.setItem('lokupdate_custom_templates', JSON.stringify(list));
      return template;
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(STORES.TEMPLATES, 'readwrite');
      const store = tx.objectStore(STORES.TEMPLATES);
      const req = store.put(template);
      req.onsuccess = () => resolve(template);
      req.onerror = (e) => reject(e);
    });
  }

  async deleteCustomTemplate(id) {
    await this.dbReady;
    if (!this.db) {
      let list = await this.getCustomTemplates();
      list = list.filter(t => t.id !== id);
      localStorage.setItem('lokupdate_custom_templates', JSON.stringify(list));
      return true;
    }

    return new Promise((resolve) => {
      const tx = this.db.transaction(STORES.TEMPLATES, 'readwrite');
      const store = tx.objectStore(STORES.TEMPLATES);
      const req = store.delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  }

  // --- EXPORT HISTORY ---
  async getExportHistory() {
    await this.dbReady;
    if (!this.db) {
      const str = localStorage.getItem('lokupdate_export_history');
      return str ? JSON.parse(str) : [];
    }

    return new Promise((resolve) => {
      const tx = this.db.transaction(STORES.EXPORTS, 'readonly');
      const store = tx.objectStore(STORES.EXPORTS);
      const req = store.getAll();
      req.onsuccess = () => {
        const sorted = (req.result || []).sort((a, b) => b.timestamp - a.timestamp);
        resolve(sorted);
      };
      req.onerror = () => resolve([]);
    });
  }

  async addExportLog(entry) {
    await this.dbReady;
    entry.id = 'exp_' + Date.now();
    entry.timestamp = Date.now();
    entry.dateFormatted = new Date().toLocaleString();

    if (!this.db) {
      const list = await this.getExportHistory();
      list.unshift(entry);
      if (list.length > 50) list.pop(); // keep last 50
      localStorage.setItem('lokupdate_export_history', JSON.stringify(list));
      return entry;
    }

    return new Promise((resolve) => {
      const tx = this.db.transaction(STORES.EXPORTS, 'readwrite');
      const store = tx.objectStore(STORES.EXPORTS);
      store.put(entry);
      tx.oncomplete = () => resolve(entry);
      tx.onerror = () => resolve(null);
    });
  }

  async clearExportHistory() {
    await this.dbReady;
    if (!this.db) {
      localStorage.removeItem('lokupdate_export_history');
      return true;
    }

    return new Promise((resolve) => {
      const tx = this.db.transaction(STORES.EXPORTS, 'readwrite');
      const store = tx.objectStore(STORES.EXPORTS);
      const req = store.clear();
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  }

  // --- USER UPLOADS CACHE ---
  async getUploadedAssets() {
    await this.dbReady;
    if (!this.db) {
      const str = localStorage.getItem('lokupdate_user_assets');
      return str ? JSON.parse(str) : [];
    }

    return new Promise((resolve) => {
      const tx = this.db.transaction(STORES.ASSETS, 'readonly');
      const store = tx.objectStore(STORES.ASSETS);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  }

  async saveUploadedAsset(asset) {
    await this.dbReady;
    if (!asset.id) asset.id = 'asset_' + Date.now();
    asset.uploadedAt = Date.now();

    if (!this.db) {
      const list = await this.getUploadedAssets();
      list.unshift(asset);
      localStorage.setItem('lokupdate_user_assets', JSON.stringify(list));
      return asset;
    }

    return new Promise((resolve) => {
      const tx = this.db.transaction(STORES.ASSETS, 'readwrite');
      const store = tx.objectStore(STORES.ASSETS);
      store.put(asset);
      tx.oncomplete = () => resolve(asset);
      tx.onerror = () => resolve(null);
    });
  }

  async deleteUploadedAsset(id) {
    await this.dbReady;
    if (!this.db) {
      let list = await this.getUploadedAssets();
      list = list.filter(a => a.id !== id);
      localStorage.setItem('lokupdate_user_assets', JSON.stringify(list));
      return true;
    }

    return new Promise((resolve) => {
      const tx = this.db.transaction(STORES.ASSETS, 'readwrite');
      const store = tx.objectStore(STORES.ASSETS);
      store.delete(id);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  }

  // Auto-save draft
  saveDraft(canvasData) {
    try {
      localStorage.setItem('lokupdate_current_draft', JSON.stringify({
        updatedAt: Date.now(),
        data: canvasData
      }));
    } catch (e) {
      console.warn('Draft save quota exceeded or failed:', e);
    }
  }

  loadDraft() {
    try {
      const draft = localStorage.getItem('lokupdate_current_draft');
      return draft ? JSON.parse(draft) : null;
    } catch (e) {
      return null;
    }
  }
}

window.appStorage = new StorageManager();
