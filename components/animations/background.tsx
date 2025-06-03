// components/AnimatedBackground.tsx
import { useEffect, useRef, useState } from 'react';

interface Particle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
}

const AnimatedBackground: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [numberOfParticles, setNumberOfParticles] = useState<number>(20); // Default to 20
    const particlesRef = useRef<Particle[]>([]);

    // Detect color mode
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const updateMode = () => {
            const isDark = mediaQuery.matches || document.documentElement.classList.contains('dark');
            setIsDarkMode(isDark);
        };

        updateMode();
        mediaQuery.addEventListener('change', updateMode);
        const observer = new MutationObserver(updateMode);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        return () => {
            mediaQuery.removeEventListener('change', updateMode);
            observer.disconnect();
        };
    }, []);

    // Set initial particle count based on device type
    useEffect(() => {
        // Only run on client side
        if (typeof window !== 'undefined') {
            const isMobile = window.innerWidth <= 768;
            setNumberOfParticles(isMobile ? 20 : 120);
        }
    }, []);

    // Konami code
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    const [konamiIndex, setKonamiIndex] = useState(0);
    const handleKeyDown = (event: KeyboardEvent) => {
        if (konamiCode[konamiIndex] === event.key) {
            setKonamiIndex((prev) => prev + 1);
            if (konamiIndex === konamiCode.length - 1) {
                const input = prompt('Number of particles:', numberOfParticles.toString());
                const newNumberOfParticles = Number(input);
                if (!isNaN(newNumberOfParticles) && newNumberOfParticles > 0) {
                    setNumberOfParticles(newNumberOfParticles);
                }
                setKonamiIndex(0);
            }
        } else {
            setKonamiIndex(0);
        }
    };
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [konamiIndex]);

    // Initialize particles
    useEffect(() => {
        const updateParticles = () => {
            const width = containerRef.current?.offsetWidth || (typeof window !== 'undefined' ? window.innerWidth : 1024);
            const height = containerRef.current?.offsetHeight || (typeof window !== 'undefined' ? window.innerHeight : 768);
            particlesRef.current = Array.from({ length: numberOfParticles }, (_, i) => ({
                id: i,
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
            }));
        };

        updateParticles();
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', updateParticles);
            return () => window.removeEventListener('resize', updateParticles);
        }
    }, [numberOfParticles]);

    // Update default particle count on resize
    useEffect(() => {
        const handleResize = () => {
            if (typeof window !== 'undefined') {
                const isMobile = window.innerWidth <= 768;
                setNumberOfParticles((prev) => {
                    if (prev === 20 || prev === 120) {
                        return isMobile ? 20 : 120;
                    }
                    return prev;
                });
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    // Animate particles with canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = containerRef.current?.offsetWidth || (typeof window !== 'undefined' ? window.innerWidth : 1024);
        const height = containerRef.current?.offsetHeight || (typeof window !== 'undefined' ? window.innerHeight : 768);
        canvas.width = width;
        canvas.height = height;

        let animationFrameId: number;
        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Update particle positions
            particlesRef.current = particlesRef.current.map((p) => {
                let newX = p.x + p.vx;
                let newY = p.y + p.vy;

                // Bounce off edges
                if (newX < 0 || newX > width) p.vx *= -1;
                if (newY < 0 || newY > height) p.vy *= -1;
                newX = Math.max(0, Math.min(newX, width));
                newY = Math.max(0, Math.min(newY, height));

                return { ...p, x: newX, y: newY };
            });

            // Draw connections
            const particleColor = isDarkMode ? '#ffffff' : '#1f2937';
            const lineColor = isDarkMode ? 'rgba(255, 255, 255, ' : 'rgba(55, 65, 81, ';
            particlesRef.current.forEach((p1, i) => {
                particlesRef.current.slice(i + 1).forEach((p2) => {
                    const distance = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `${lineColor}${1 - distance / 150})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                });
            });

            // Draw particles
            ctx.fillStyle = particleColor;
            particlesRef.current.forEach((p) => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(animationFrameId);
    }, [isDarkMode, numberOfParticles]);

    return (
        <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <canvas ref={canvasRef} className="absolute w-full h-full" />
        </div>
    );
};

export default AnimatedBackground;