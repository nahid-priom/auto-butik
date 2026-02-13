/**
 * Renders Kustom Checkout (KCO) HTML snippet into a container and executes
 * any <script> tags (innerHTML alone does not run scripts). Client-only.
 * Do not iframe-wrap or strip scripts; use as required by Kustom docs.
 */
export function renderKcoSnippet(container: HTMLElement, snippet: string): void {
    container.innerHTML = snippet;

    const scripts = container.querySelectorAll('script');
    scripts.forEach((oldScript) => {
        const newScript = document.createElement('script');
        if (oldScript.type) {
            newScript.type = oldScript.type;
        }
        if (oldScript.src) {
            newScript.src = oldScript.src;
        } else if (oldScript.textContent) {
            newScript.textContent = oldScript.textContent;
        }
        oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
}
