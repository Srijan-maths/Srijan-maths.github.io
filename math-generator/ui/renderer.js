/**
 * KaTeX Math Renderer Wrapper
 */
const MathRenderer = {
  render(containerElement) {
    if (!containerElement) return;

    if (window.renderMathInElement) {
      window.renderMathInElement(containerElement, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false }
        ],
        throwOnError: false
      });
    }
  }
};

window.MathRenderer = MathRenderer;
