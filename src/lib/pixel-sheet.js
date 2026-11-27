// @ts-nocheck — vendored from the riso style library (references/library/pixel-sheet),
// the page only needs the grid variant: one ink wash behind the skills chips.
/* riso grain sheet — one fine ink grain printed behind a whole grid of chips,
   each cell a window cut in it. Replaces the 5px pixel ramp: blocks that size
   read as mosaic tiles and merge at a glance; 1px dots read as paper grain.

   <div class="pix-grid" id="grid">
     <button class="chip">cameras</button>
     <button class="chip" aria-pressed="true">dof</button>
     <button class="chip" disabled>readback</button>
   </div>
   <script src="pixel-sheet.js"></script>
   <script>risoSheet(document.getElementById('grid'));</script>

   Paints into a canvas it injects as <canvas class="pix-sheet">. Every dot is a
   stable hash of its own coordinates, so a repaint never shimmers. Follows
   [data-print="night"] and the system scheme on its own; knobs are read from the
   grid, so a section can set its own grain: --pix-density (ceiling, default .14),
   --pix-grain (dot size in px, default 1), --pix-mode (grain | wash, default
   grain), --pix-fade (how far wash thins to the bottom-right, default .6), and
   --A (the ink).
   Both modes fade towards the bottom-right, keeping the direction the pixel ramp
   had without ever going dark enough to fight the chip text. Grain at 1px reads
   as paper; against 10px monospace labels it still competes with the letters, so
   small text takes wash.
   Selected and disabled cells are left out of the mask: they print solid, or not
   at all. */
(() => {
  const rgb = (h) => {
    h = (h || '').trim().replace('#', '');
    if (h.length === 3) h = [...h].map((c) => c + c).join('');
    if (h.length !== 6) return [50, 85, 164];
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  };

  /* целочисленный хеш: одна точка — один и тот же цвет при любой перерисовке */
  const noise = (x, y) => {
    let h = (x * 374761393 + y * 668265263) | 0;
    h = (h ^ (h >> 13)) * 1274126177;
    h = (h ^ (h >> 16)) >>> 0;
    return (h & 0xffffff) / 0x1000000;
  };

  window.risoSheet = function (grid, opts = {}) {
    const cellSel = opts.cells || '.tag, .chip';
    const solid = opts.solid || ((el) => el.disabled || el.getAttribute('aria-pressed') === 'true');

    let cv = grid.querySelector(':scope > canvas.pix-sheet');
    if (!cv) {
      cv = document.createElement('canvas');
      cv.className = 'pix-sheet';
      cv.setAttribute('aria-hidden', 'true');
      grid.prepend(cv);
    }
    const off = document.createElement('canvas');

    /* один путь на все чипы: им режутся и зерно, и плашка */
    function maskCells(ctx, dpr, iw, ih) {
      const box = grid.getBoundingClientRect();
      let cells = 0;
      grid.querySelectorAll(cellSel).forEach((el) => {
        if (solid(el)) return;
        const r = el.getBoundingClientRect();
        const w = r.width * dpr;
        const h = r.height * dpr;
        if (w <= 0 || h <= 0) return;
        cells++;
        const x = (r.left - box.left) * dpr;
        const y = (r.top - box.top) * dpr;
        if (ctx.roundRect) ctx.roundRect(x, y, w, h, h / 2);
        else ctx.rect(x, y, w, h);
      });
      return cells > 0;
    }

    function paint() {
      /* ручки живут на сетке, а не на корне: секция задаёт своё зерно */
      const cs = getComputedStyle(grid);
      const ink = rgb(cs.getPropertyValue('--A'));
      const [ir, ig, ib] = ink;
      const maxD = parseFloat(cs.getPropertyValue('--pix-density')) || 0.14;
      const grainCss = Math.max(1, parseFloat(cs.getPropertyValue('--pix-grain')) || 1);
      const mode = (cs.getPropertyValue('--pix-mode') || '').trim() || 'grain';
      const fade = parseFloat(cs.getPropertyValue('--pix-fade')) || 0.6;

      const box = grid.getBoundingClientRect();
      const W = Math.max(1, Math.round(box.width));
      const H = Math.max(1, Math.round(box.height));
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const iw = Math.round(W * dpr);
      const ih = Math.round(H * dpr);
      const step = Math.max(1, Math.round(grainCss * dpr));

      cv.width = iw;
      cv.height = ih;
      cv.style.width = W + 'px';
      cv.style.height = H + 'px';
      const ctx = cv.getContext('2d');
      ctx.clearRect(0, 0, iw, ih);

      if (mode === 'wash') {
        /* одна плавная плашка: без растра, поэтому буквы под ней не рябят */
        ctx.save();
        ctx.beginPath();
        if (maskCells(ctx, dpr, iw, ih)) {
          const grad = ctx.createLinearGradient(0, 0, iw, ih);
          grad.addColorStop(0, `rgba(${ir}, ${ig}, ${ib}, ${maxD})`);
          grad.addColorStop(1, `rgba(${ir}, ${ig}, ${ib}, ${maxD * (1 - fade)})`);
          ctx.clip();
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, iw, ih);
        }
        ctx.restore();
        return;
      }

      /* зерно — в отдельный буфер: putImageData не считается с clip */
      off.width = iw;
      off.height = ih;
      const octx = off.getContext('2d');
      const img = octx.createImageData(iw, ih);
      const d = img.data;
      for (let y = 0; y < ih; y += step) {
        for (let x = 0; x < iw; x += step) {
          const t = (x / iw) * 0.65 + (y / ih) * 0.35;      /* 0 — левый верхний угол */
          if (noise(x, y) >= maxD * (1 - 0.5 * t)) continue;
          for (let dy = 0; dy < step && y + dy < ih; dy++) {
            for (let dx = 0; dx < step && x + dx < iw; dx++) {
              const k = ((y + dy) * iw + (x + dx)) * 4;
              d[k] = ir;
              d[k + 1] = ig;
              d[k + 2] = ib;
              d[k + 3] = 255;
            }
          }
        }
      }
      octx.putImageData(img, 0, 0);

      /* и вырезаем по чипам */
      ctx.save();
      ctx.beginPath();
      if (maskCells(ctx, dpr, iw, ih)) {
        ctx.clip();
        ctx.drawImage(off, 0, 0);
      }
      ctx.restore();
    }

    new ResizeObserver(paint).observe(grid);
    new MutationObserver(paint).observe(grid, {
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-pressed', 'disabled', 'hidden']
    });
    if (document.fonts) document.fonts.ready.then(paint);   /* chip widths depend on the font */

    /* тема переключается на странице, а не на сетке: следим за корнем */
    new MutationObserver(paint).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-print', 'class', 'style']
    });
    matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', paint);

    paint();
    return paint;
  };
})();

export const risoSheet = window.risoSheet;
