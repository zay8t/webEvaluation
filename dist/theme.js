/**
 * Theme Manager — High-Efficiency Dark/Light Mode Utility
 * Optimized for static pages to prevent FOUC and sync across tabs.
 */

(function() {
    const THEME_KEY = 'theme_preference';

    /**
     * Get the current theme from localStorage or system preference.
     */
    window.getTheme = function() {
        try {
            const stored = localStorage.getItem(THEME_KEY);
            if (stored === 'dark' || stored === 'light') return stored;
        } catch (e) {}
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    /**
     * Apply the given theme to the document root.
     */
    window.applyTheme = function(theme) {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
            root.classList.remove('light');
        } else {
            root.classList.remove('dark');
            root.classList.add('light');
        }
        // Emit event for other scripts (e.g., charts or dynamic UI)
        window.dispatchEvent(new CustomEvent('themechange', { detail: theme }));
    };

    /**
     * Toggle between light and dark mode.
     */
    window.toggleTheme = function() {
        const current = window.getTheme();
        const next = current === 'dark' ? 'light' : 'dark';
        try {
            localStorage.setItem(THEME_KEY, next);
        } catch (e) {}
        window.applyTheme(next);
        return next;
    };

    /**
     * Initialize theme as early as possible to prevent flash.
     */
    window.initTheme = function() {
        const theme = window.getTheme();
        window.applyTheme(theme);
    };

    // Run initialization immediately (this script should be in <head>)
    window.initTheme();

    // Listen for changes in other tabs (Storage Event)
    window.addEventListener('storage', (e) => {
        if (e.key === THEME_KEY) {
            window.applyTheme(e.newValue);
        }
    });

})();
