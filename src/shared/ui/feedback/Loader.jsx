import React, { useState, useEffect, useRef } from 'react';

const quotes = [
    { text: "You have power over your mind - not outside events.", author: "Marcus Aurelius" },
    { text: "We suffer more often in imagination than in reality.", author: "Seneca" },
    { text: "First say to yourself what you would be; and then do what you have to do.", author: "Epictetus" },
    { text: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius" },
    { text: "No man is free who is not master of himself.", author: "Epictetus" },
    { text: "He who fears death will never do anything worth of a man who is alive.", author: "Seneca" }
];

const MIN_LOAD_TIME = 4000;
const TRANSITION_DURATION = 800;
const QUOTE_INTERVAL = 1500;

export const Loader = ({ isLoading = true, fullScreen = true, onComplete, children }) => {
    const [quoteIndex, setQuoteIndex] = useState(0);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    const mountTime = useRef(0);
    const fadeTimeout = useRef(null);
    const removeTimeout = useRef(null);
    const quoteInterval = useRef(null);

    useEffect(() => {
        if (!isVisible) return;
        quoteInterval.current = setInterval(() => {
            setQuoteIndex((p) => (p + 1) % quotes.length);
        }, QUOTE_INTERVAL);
        return () => clearInterval(quoteInterval.current);
    }, [isVisible]);

    useEffect(() => {
        if (mountTime.current === 0) {
            mountTime.current = Date.now();
        }

        if (isLoading) return;

        const elapsed = Date.now() - mountTime.current;
        const remaining = Math.max(0, MIN_LOAD_TIME - elapsed);

        fadeTimeout.current = setTimeout(() => {
            setIsFadingOut(true);

            removeTimeout.current = setTimeout(() => {
                setIsFadingOut(false);
                setIsVisible(false);
                if (onComplete) onComplete();
            }, TRANSITION_DURATION);

        }, remaining);

        return () => {
            clearTimeout(fadeTimeout.current);
            clearTimeout(removeTimeout.current);
        };
    }, [isLoading, onComplete]);

    if (!isVisible) return children || null;

    const baseClasses = fullScreen
        ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm'
        : 'absolute inset-0 z-10 flex w-full h-full flex-col items-center justify-center bg-background/80 backdrop-blur-sm p-6';

    const animationClasses =
        `transition-opacity duration-[800ms] ease-in-out ${(!isLoading && isFadingOut) ? 'opacity-0' : 'opacity-100'}`;

    return (
        <div className={`${baseClasses} ${animationClasses}`}>
            <div className="flex flex-col items-center justify-center space-y-10 max-w-lg text-center w-full">
                <div className="flex flex-col items-center justify-center animate-pulse">
                    <div className="mb-4">
                        <img src="/pwa-192x192.svg" alt="Ataraxia Logo" className="h-16 w-auto" />
                    </div>
                    <div className="h-[1px] w-16 bg-primary/40"></div>
                </div>
                <div className="w-full px-6 min-h-[8rem] flex flex-col items-center justify-center">
                    <p
                        key={`quote-${quoteIndex}`}
                        className="text-xl text-muted-foreground italic font-medium"
                        style={{ animation: 'fadeIn 1s ease-in-out' }}
                    >
                        "{quotes[quoteIndex].text}"
                    </p>
                    <span
                        key={`author-${quoteIndex}`}
                        className="text-sm text-muted-foreground/50 mt-4 font-light tracking-[0.2em] uppercase"
                        style={{ animation: 'fadeIn 1.5s ease-in-out' }}
                    >
                        — {quotes[quoteIndex].author}
                    </span>
                </div>
            </div>
        </div>
    );
};