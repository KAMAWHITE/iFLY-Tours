"use client";
import React, { useEffect, useRef } from "react";

const Loading = ({ fullScreen = true, size = 200, text = "" }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");

        const velocity2 = 5;
        const radius = 5;
        const boundaryX = size;
        const boundaryY = size;
        const numberOfPoints = 30;
        let points = [];
        let animationFrameId;

        const createPoint = () => {
            let point = {}, vx2, vy2;
            point.x = Math.random() * boundaryX;
            point.y = Math.random() * boundaryY;
            // random vx 
            point.vx = (Math.floor(Math.random() * 2) * 2 - 1) * Math.random();
            vx2 = Math.pow(point.vx, 2);
            // vy^2 = velocity^2 - vx^2
            vy2 = Math.max(0, velocity2 - vx2);
            point.vy = Math.sqrt(vy2) * (Math.random() * 2 - 1);
            return point;
        };

        const resetVelocity = (point, axis, dir) => {
            let vx2, vy2;
            if (axis === "x") {
                point.vx = dir * Math.random();
                vx2 = Math.pow(point.vx, 2);
                // vy^2 = velocity^2 - vx^2
                vy2 = Math.max(0, velocity2 - vx2);
                point.vy = Math.sqrt(vy2) * (Math.random() * 2 - 1);
            } else {
                point.vy = dir * Math.random();
                vy2 = Math.pow(point.vy, 2);
                // vy^2 = velocity^2 - vx^2
                vx2 = Math.max(0, velocity2 - vy2);
                point.vx = Math.sqrt(vx2) * (Math.random() * 2 - 1);
            }
        };

        const drawCircle = (x, y) => {
            context.beginPath();
            context.arc(x, y, radius, 0, 2 * Math.PI, false);
            context.fillStyle = "#97badc"; // User's color
            context.fill();
        };

        const drawLine = (x1, y1, x2, y2) => {
            context.beginPath();
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.strokeStyle = "#8ab2d8"; // User's color
            context.lineWidth = 1;
            context.stroke();
        };

        // Initialize points
        for (let i = 0; i < numberOfPoints; i++) {
            points.push(createPoint());
        }

        // Create buddies
        for (let i = 0; i < points.length; i++) {
            points[i].buddy = i === 0 ? points[points.length - 1] : points[i - 1];
        }

        const draw = () => {
            for (let i = 0; i < points.length; i++) {
                let point = points[i];
                point.x += point.vx;
                point.y += point.vy;

                drawCircle(point.x, point.y);
                drawLine(point.x, point.y, point.buddy.x, point.buddy.y);

                // check for edge
                if (point.x < radius) {
                    resetVelocity(point, "x", 1);
                } else if (point.x > boundaryX - radius) {
                    resetVelocity(point, "x", -1);
                } else if (point.y < radius) {
                    resetVelocity(point, "y", 1);
                } else if (point.y > boundaryY - radius) {
                    resetVelocity(point, "y", -1);
                }
            }
        };

        const animate = () => {
            context.clearRect(0, 0, boundaryX, boundaryY);
            draw();
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [size]);

    const wrapperStyles = fullScreen
        ? "fixed inset-0 z-[9999] bg-[#102131] flex flex-col items-center justify-center gap-6"
        : "flex flex-col items-center justify-center p-8 gap-4";

    return (
        <div className={wrapperStyles}>
            <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[#97badc]/10 blur-2xl animate-pulse" />
                <canvas
                    ref={canvasRef}
                    width={size}
                    height={size}
                    className="relative rotate-45 transform-gpu"
                    style={{ width: size, height: size }}
                />
            </div>
        </div>
    );
};

export default Loading;

