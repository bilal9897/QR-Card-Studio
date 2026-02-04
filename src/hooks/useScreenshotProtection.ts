import { useEffect } from 'react';

/**
 * Hook to add basic screenshot protection measures
 * Note: These are deterrents only and can be bypassed
 */
export function useScreenshotProtection() {
    useEffect(() => {
        // Disable right-click context menu
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            return false;
        };

        // Disable common screenshot keyboard shortcuts
        const handleKeyDown = (e: KeyboardEvent) => {
            // Print Screen
            if (e.key === 'PrintScreen') {
                e.preventDefault();
                alert('Screenshots are disabled on this site for content protection.');
                return false;
            }

            // Ctrl+Shift+S (Firefox screenshot)
            if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                return false;
            }

            // Cmd+Shift+3/4/5 (Mac screenshots)
            if (e.metaKey && e.shiftKey && ['3', '4', '5'].includes(e.key)) {
                e.preventDefault();
                return false;
            }

            // F12 (DevTools)
            if (e.key === 'F12') {
                e.preventDefault();
                return false;
            }

            // Ctrl+Shift+I (DevTools)
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
                return false;
            }

            // Ctrl+U (View Source)
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                return false;
            }
        };

        // Detect DevTools opening
        const detectDevTools = () => {
            const threshold = 160;
            const widthThreshold = window.outerWidth - window.innerWidth > threshold;
            const heightThreshold = window.outerHeight - window.innerHeight > threshold;

            if (widthThreshold || heightThreshold) {
                document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-size:24px;color:#f5f5f0;background:#0a0a0a;">Developer tools are disabled for content protection.</div>';
            }
        };

        // Add event listeners
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        // Check for DevTools periodically
        const devToolsInterval = setInterval(detectDevTools, 1000);

        // Cleanup
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            clearInterval(devToolsInterval);
        };
    }, []);
}
