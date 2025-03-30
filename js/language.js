/**
 * SaveAndServe Language Utilities
 * Este arquivo foi simplificado pois o site agora é apenas em português
 */

// Import storage utilities
import StorageUtils from './utils/storageUtils.js';

const LanguageUtils = {
    /**
     * Get the current language preference
     * @returns {string} The current language code (always 'pt-BR')
     */
    getCurrentLanguage: function() {
        return 'pt-BR'; // Site agora é apenas em português
    }
};

// Não é mais necessário inicializar o idioma, pois o site é apenas em português

export default LanguageUtils;
