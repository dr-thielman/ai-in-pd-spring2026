// HTML overlay for live metrics + Run button — top-right of the canvas.

export class Overlay {
  constructor() {
    this.el = document.createElement('div');
    Object.assign(this.el.style, {
      position: 'fixed',
      top: '14px',
      right: '14px',
      padding: '10px 14px',
      background: 'rgba(20, 20, 28, 0.78)',
      color: '#e8e8ec',
      fontFamily: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
      fontSize: '12.5px',
      lineHeight: '1.55',
      borderRadius: '6px',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      zIndex: '10',
      minWidth: '230px',
      pointerEvents: 'none',  // overlay is pass-through; only button is interactive
      whiteSpace: 'pre',
    });
    document.body.appendChild(this.el);

    // Metrics text lives in its own node so the button isn't clobbered each frame
    this.textEl = document.createElement('div');
    this.el.appendChild(this.textEl);

    // Run button — pointer-events:auto lets it receive clicks despite parent:none
    this.btn = document.createElement('button');
    this.btn.textContent = 'Run';
    Object.assign(this.btn.style, {
      display:      'block',
      marginTop:    '8px',
      width:        '100%',
      padding:      '5px 0',
      background:   '#1e5c1e',
      color:        '#e8e8ec',
      border:       '1px solid rgba(255,255,255,0.18)',
      borderRadius: '4px',
      fontFamily:   'inherit',
      fontSize:     '12px',
      cursor:       'pointer',
      pointerEvents: 'auto',
      whiteSpace:   'normal',
    });
    this.btn.onmouseenter = () => { this.btn.style.background = '#267326'; };
    this.btn.onmouseleave = () => { this.btn.style.background = '#1e5c1e'; };
    this.btn.onclick = () => {
      if (window.controller) {
        window.controller.reset();
        window.controller.start();
      }
    };
    this.el.appendChild(this.btn);
  }

  update(values, status) {
    const f = (v, d = 3) => v.toFixed(d);
    this.textEl.textContent =
      `Stack height:    ${f(values.stackHeight).padStart(6)} m\n` +
      `Centroid drift:  ${f(values.centroidDrift).padStart(6)} m\n` +
      `Max ω (last 1s): ${f(values.maxAngVel).padStart(6)} rad/s\n` +
      `Status:          ${status || 'IDLE'}`;
  }
}
