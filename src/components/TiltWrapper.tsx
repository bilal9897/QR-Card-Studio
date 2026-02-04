
import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils'; // Assuming you have a utils file

interface TiltWrapperProps {
    children: React.ReactNode;
    className?: string;
    intensity?: number; // How strong the tilt it (1-20 recommended)
    perspective?: number; // 3D depth (500-2000)
}

export default function TiltWrapper({
    children,
    className,
    intensity = 15,
    perspective = 1000
}: TiltWrapperProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate center
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate distance from center (-1 to 1)
        const rotateY = ((x - centerX) / centerX) * intensity;
        const rotateX = ((centerY - y) / centerY) * intensity; // Inverted Y for natural tilt

        setRotation({ x: rotateX, y: rotateY });
    };

    const handleMouseEnter = () => setIsHovered(true);

    const handleMouseLeave = () => {
        setIsHovered(false);
        setRotation({ x: 0, y: 0 }); // Reset position
    };

    return (
        <div
            ref={ref}
            className={cn("relative transition-transform ease-out duration-200", className)}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective: `${perspective}px`,
                transformStyle: 'preserve-3d',
            }}
        >
            <div
                className="transition-all duration-200 ease-out"
                style={{
                    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${isHovered ? 1.05 : 1})`,
                    boxShadow: isHovered
                        ? '0 20px 40px rgba(0,0,0,0.2)'
                        : '0 10px 20px rgba(0,0,0,0.1)',
                }}
            >
                {children}

                {/* Gloss/Reflection Effect */}
                <div
                    className="absolute inset-0 pointer-events-none rounded-inherit z-50 transition-opacity duration-300"
                    style={{
                        opacity: isHovered ? 1 : 0,
                        background: `linear-gradient(
                    ${135 + rotation.y * 2}deg, 
                    rgba(255,255,255,0.4) 0%, 
                    rgba(255,255,255,0) 40%, 
                    rgba(255,255,255,0) 100%
                )`,
                        borderRadius: 'inherit' // Ensures it follows parent border radius
                    }}
                />
            </div>
        </div>
    );
}
