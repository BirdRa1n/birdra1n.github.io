// components/AnimatedBackground.tsx
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface Particle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
}

const AnimatedBackground: React.FC = () => {
    const [particles, setParticles] = useState<Particle[]>([]);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [numberOfParticles, setNumberOfParticles] = useState(20);

    // Detect color mode and sync with 'dark' class
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const updateMode = () => {
            const isDark = mediaQuery.matches || document.documentElement.classList.contains('dark');
            setIsDarkMode(isDark);
        };

        updateMode(); // Initial check
        mediaQuery.addEventListener('change', updateMode);
        const observer = new MutationObserver(updateMode);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        return () => {
            mediaQuery.removeEventListener('change', updateMode);
            observer.disconnect();
        };
    }, []);

    // Konami code
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    const [konamiIndex, setKonamiIndex] = useState(0);
    const handleKeyDown = (event: KeyboardEvent) => {
        if (konamiCode[konamiIndex] === event.key) {
            setKonamiIndex((prev) => prev + 1);
            if (konamiIndex === konamiCode.length - 1) {
                const newNumberOfParticles = Number(prompt('Number of particles:', numberOfParticles.toString()));
                if (!isNaN(newNumberOfParticles)) {
                    setNumberOfParticles(newNumberOfParticles);
                }
                setKonamiIndex(0); // Reset konamiIndex to allow reuse
            }
        } else {
            setKonamiIndex(0);
        }
    };
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [konamiIndex]);

    // Initialize particles
    useEffect(() => {
        const updateParticles = () => {
            const width = containerRef.current?.offsetWidth || window.innerWidth;
            const height = containerRef.current?.offsetHeight || window.innerHeight;
            const newParticles: Particle[] = Array.from({ length: numberOfParticles }, (_, i) => ({
                id: i,
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
            }));
            setParticles(newParticles);
        };

        updateParticles();
        window.addEventListener('resize', updateParticles);
        return () => window.removeEventListener('resize', updateParticles);
    }, [numberOfParticles]); // Add numberOfParticles as a dependency

    // Animate particles with requestAnimationFrame
    useEffect(() => {
        let animationFrameId: number;
        const animate = () => {
            setParticles((prev) =>
                prev.map((p) => {
                    const width = containerRef.current?.offsetWidth || window.innerWidth;
                    const height = containerRef.current?.offsetHeight || window.innerHeight;
                    let newX = p.x + p.vx;
                    let newY = p.y + p.vy;

                    // Bounce off edges
                    if (newX < 0 || newX > width) p.vx *= -1;
                    if (newY < 0 || newY > height) p.vy *= -1;
                    newX = Math.max(0, Math.min(newX, width));
                    newY = Math.max(0, Math.min(newY, height));

                    return { ...p, x: newX, y: newY };
                })
            );
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    // Calculate connections
    const connections: { id: string; x1: number; y1: number; x2: number; y2: number; distance: number }[] = [];
    particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
            const distance = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
            if (distance < 150) {
                connections.push({
                    id: `${p1.id}-${p2.id}`,
                    x1: p1.x,
                    y1: p1.y,
                    x2: p2.x,
                    y2: p2.y,
                    distance,
                });
            }
        });
    });

    // Determine colors based on mode
    const particleColor = isDarkMode ? '#ffffff' : '#1f2937'; // White in dark mode, gray-800 in light mode
    const lineColor = isDarkMode ? 'rgba(255, 255, 255, ' : 'rgba(55, 65, 81, '; // White or gray-700

    return (
        <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <svg className="absolute w-full h-full" style={{ pointerEvents: 'none' }}>
                {connections.map((conn) => (
                    <motion.path
                        key={conn.id}
                        d={`M${conn.x1},${conn.y1} L${conn.x2},${conn.y2}`}
                        stroke={`${lineColor}${1 - conn.distance / 150})`}
                        strokeWidth={1}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                    />
                ))}
            </svg>
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute w-2 h-2 rounded-full"
                    style={{ backgroundColor: particleColor, x: particle.x, y: particle.y }}
                    animate={{ x: particle.x, y: particle.y }}
                    transition={{ duration: 0.016, ease: 'linear' }}
                />
            ))}
        </div>
    );
};

export default AnimatedBackground;