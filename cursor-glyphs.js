(function () {
    const MAX_GLYPHS = 36;
    const SPAWN_DISTANCE = 10;

    function initCursorGlyphs() {
        const finePointer = window.matchMedia('(pointer: fine)').matches;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!finePointer || reduceMotion) return;

        const dot = document.createElement('div');
        dot.className = 'cursor-dot';
        dot.setAttribute('aria-hidden', 'true');
        document.body.appendChild(dot);

        let lastX = 0;
        let lastY = 0;
        let spawnedX = 0;
        let spawnedY = 0;
        let hasPoint = false;
        let alive = 0;

        const onDark = (x, y) => {
            const imageCursor = document.getElementById('custom-cursor');
            if (imageCursor && imageCursor.classList.contains('active')) return false;

            const hit = document.elementFromPoint(x, y);
            if (!hit) return false;

            let node = hit;
            while (node && node !== document.documentElement) {
                const tag = node.tagName;
                if (tag === 'IMG' || tag === 'VIDEO' || tag === 'CANVAS' || tag === 'SVG' || tag === 'PICTURE') {
                    return false;
                }
                if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return false;

                const style = getComputedStyle(node);
                if (style.backgroundImage && style.backgroundImage !== 'none') return false;

                const parsed = style.backgroundColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
                if (parsed) {
                    const alpha = parsed[4] === undefined ? 1 : parseFloat(parsed[4]);
                    if (alpha > 0.35) {
                        const r = Number(parsed[1]);
                        const g = Number(parsed[2]);
                        const b = Number(parsed[3]);
                        const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
                        return luminance < 0.16;
                    }
                }
                node = node.parentElement;
            }
            return false;
        };

        const spawn = (x, y, vx, vy) => {
            if (alive >= MAX_GLYPHS) return;
            const glyph = document.createElement('span');
            glyph.className = 'cursor-glyph';
            glyph.setAttribute('aria-hidden', 'true');

            const jitter = 14;
            const px = x - vx * 18 + (Math.random() - 0.5) * jitter;
            const py = y - vy * 18 + (Math.random() - 0.5) * jitter;
            glyph.style.left = px + 'px';
            glyph.style.top = py + 'px';
            document.body.appendChild(glyph);
            alive += 1;

            const driftX = -vx * 16 + (Math.random() - 0.5) * 12;
            const driftY = -vy * 16 + (Math.random() - 0.5) * 12;
            const animation = glyph.animate(
                [
                    { opacity: 0.9, transform: 'translate(-50%, -50%)' },
                    { opacity: 0, transform: 'translate(calc(-50% + ' + driftX + 'px), calc(-50% + ' + driftY + 'px))' }
                ],
                { duration: 1400, easing: 'ease-out', fill: 'forwards' }
            );
            animation.onfinish = () => {
                glyph.remove();
                alive -= 1;
            };
        };

        const hide = () => {
            dot.classList.remove('is-on');
            document.documentElement.classList.remove('cursor-glyphs-on');
        };

        document.addEventListener('mousemove', (event) => {
            const x = event.clientX;
            const y = event.clientY;
            dot.style.left = x + 'px';
            dot.style.top = y + 'px';

            const dark = onDark(x, y);
            dot.classList.toggle('is-on', dark);
            document.documentElement.classList.toggle('cursor-glyphs-on', dark);
            if (!dark) {
                hasPoint = true;
                lastX = x;
                lastY = y;
                return;
            }

            if (!hasPoint) {
                hasPoint = true;
                lastX = spawnedX = x;
                lastY = spawnedY = y;
                return;
            }

            const dx = x - lastX;
            const dy = y - lastY;
            const dist = Math.hypot(x - spawnedX, y - spawnedY);
            if (dist >= SPAWN_DISTANCE) {
                const travel = Math.hypot(dx, dy) || 1;
                spawn(x, y, dx / travel, dy / travel);
                spawnedX = x;
                spawnedY = y;
            }
            lastX = x;
            lastY = y;
        });

        document.addEventListener('mouseleave', hide);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCursorGlyphs);
    } else {
        initCursorGlyphs();
    }
})();
