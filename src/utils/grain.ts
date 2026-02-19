/**
 * Apply grain texture to an element using CSS Paint API (Houdini)
 * Falls back to SVG filter for unsupported browsers
 *
 * @param element - The HTML element to apply grain texture to
 * @param lightColor - RGB color for light mode (default: gray "190, 190, 190")
 * @param darkColor - RGB color for dark mode (default: black "0, 0, 0")
 */
export function applyGrainTexture(
  element: HTMLElement,
  lightColor: string = "190, 190, 190",
  darkColor: string = "0, 0, 0",
) {
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const grainColor = isDark ? darkColor : lightColor;

  if ("paintWorklet" in CSS) {
    CSS.paintWorklet.addModule(
      "data:text/javascript," +
        encodeURIComponent(`
                class GrainPainter {
                    static get inputProperties() {
                        return ['--grain-color'];
                    }

                    paint(ctx, geom, properties) {
                        const density = 0.5;
                        const width = geom.width;
                        const height = geom.height;
                        const grainColor = properties.get('--grain-color').toString().trim() || '0, 0, 0';

                        for (let i = 0; i < width * height * density; i++) {
                            const x = Math.random() * width;
                            const y = Math.random() * height;
                            const opacity = Math.random() * 0.15;

                            ctx.fillStyle = \`rgba(\${grainColor}, \${opacity})\`;
                            ctx.fillRect(x, y, 1, 1);
                        }
                    }
                }

                registerPaint('grain', GrainPainter);
            `),
    );

    element.style.setProperty("--grain-color", grainColor);
    element.style.backgroundImage = "paint(grain)";

    // Update grain color when color scheme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", (e) => {
      const newGrainColor = e.matches ? darkColor : lightColor;
      element.style.setProperty("--grain-color", newGrainColor);
    });
  } else {
    // Fallback: CSS-only grain texture using SVG
    const applyFallback = (colorScheme: string) => {
      const opacity = colorScheme === "dark" ? "0.08" : "0.05";
      element.style.backgroundImage = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='${opacity}'/%3E%3C/svg%3E")`;
    };

    applyFallback(isDark ? "dark" : "light");

    // Update SVG when color scheme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", (e) => {
      applyFallback(e.matches ? "dark" : "light");
    });
  }
}
