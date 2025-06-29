import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkle, ChatCircle, ArrowRight } from '@phosphor-icons/react';
import { motion, useMotionValue, useMotionTemplate, animate } from 'framer-motion';
import { User } from '../types';
import { Button } from './Button';

interface UserMessage {
  title: string;
  subtitle: string;
  ctaText: string;
}

interface HeroSectionProps {
  currentUser: User | null;
  userMessage: UserMessage;
  onStartLearning: () => void;
  onUpgrade: () => void;
  onExploreCourses: () => void;
}

const FloatingPaths = ({ position }: { position: number }) => {
  const paths = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.02,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none opacity-30">
      <svg
        className="w-full h-full text-cobalt"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.02}
            initial={{ pathLength: 0.3, opacity: 0.4 }}
            animate={{
              pathLength: 1,
              opacity: [0.2, 0.4, 0.2],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
};

const HeroSection: React.FC<HeroSectionProps> = ({
  currentUser,
  userMessage,
  onStartLearning,
  onUpgrade,
  onExploreCourses
}) => {
  const navigate = useNavigate();
  const color = useMotionValue("#3b42c4"); // cobalt color
  const words = userMessage.title.split(" ");

  useEffect(() => {
    animate(color, ["#3b42c4", "#8b5cf6", "#06b6d4", "#10b981", "#3b42c4"], {
      ease: "easeInOut",
      duration: 12,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "loop",
    });
  }, [color]);

  const backgroundGradient = useMotionTemplate`radial-gradient(circle at 50% 50%, ${color}15 0%, transparent 50%)`;
  const borderGradient = useMotionTemplate`1px solid ${color}40`;
  const boxShadow = useMotionTemplate`0 0 20px ${color}20`;

  const handleCTAClick = () => {
    if (!currentUser) {
      onStartLearning();
    } else if (currentUser.role === 'free') {
      onStartLearning();
    } else {
      onExploreCourses();
    }
  };

  return (
    <motion.section 
      style={{ backgroundImage: backgroundGradient }}
      className="relative min-h-[80vh] w-full flex items-center justify-center overflow-hidden bg-white"
    >
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 container mx-auto px-6 sm:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-20 xl:gap-24 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left space-y-8 sm:space-y-10"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
              {words.map((word, wordIndex) => (
                <span
                  key={wordIndex}
                  className="inline-block mr-3 last:mr-0"
                >
                  {word.split("").map((letter, letterIndex) => (
                    <motion.span
                      key={`${wordIndex}-${letterIndex}`}
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: wordIndex * 0.1 + letterIndex * 0.02,
                        type: "spring",
                        stiffness: 100,
                        damping: 20,
                      }}
                      className="inline-block text-black"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
              ))}
            </h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-xl sm:text-2xl lg:text-3xl max-w-3xl mx-auto lg:mx-0 leading-relaxed font-normal text-gray-700"
            >
              {userMessage.subtitle}
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center lg:justify-start pt-6 sm:pt-8"
            >
              {!currentUser ? (
                <motion.div
                  style={{
                    border: borderGradient,
                    boxShadow: boxShadow,
                  }}
                  className="rounded-[1.2rem] p-1 bg-white/50 backdrop-blur-sm"
                >
                  <Button
                    variant="accent"
                    size="lg"
                    onClick={onStartLearning}
                    className="px-10 sm:px-12 py-5 sm:py-6 text-xl sm:text-2xl font-semibold min-w-[220px] sm:min-w-[260px] shadow-lg hover:shadow-xl"
                    icon={Sparkle}
                  >
                    {userMessage.ctaText}
                  </Button>
                </motion.div>
              ) : currentUser.role === 'free' ? (
                <motion.div
                  style={{
                    border: borderGradient,
                    boxShadow: boxShadow,
                  }}
                  className="rounded-[1.2rem] p-1 bg-white/50 backdrop-blur-sm"
                >
                  <Button
                    variant="accent"
                    size="lg"
                    onClick={onStartLearning}
                    className="px-10 sm:px-12 py-5 sm:py-6 text-xl sm:text-2xl font-semibold min-w-[220px] sm:min-w-[260px] shadow-lg hover:shadow-xl"
                    icon={Sparkle}
                  >
                    {userMessage.ctaText}
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  style={{
                    border: borderGradient,
                    boxShadow: boxShadow,
                  }}
                  className="rounded-[1.2rem] p-1 bg-white/50 backdrop-blur-sm"
                >
                  <Button
                    variant="accent"
                    size="lg"
                    onClick={onExploreCourses}
                    className="px-10 sm:px-12 py-5 sm:py-6 text-xl sm:text-2xl font-semibold min-w-[220px] sm:min-w-[260px] shadow-lg hover:shadow-xl"
                    icon={Sparkle}
                  >
                    {userMessage.ctaText}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <div className="flex justify-center lg:justify-end">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.3,
                duration: 0.8,
                type: "spring",
                stiffness: 100,
                damping: 20
              }}
              className="relative max-w-sm sm:max-w-lg w-full transform hover:scale-105 transition-transform duration-500 mt-8 lg:mt-0"
            >
              <motion.div
                style={{
                  border: borderGradient,
                  boxShadow: boxShadow,
                }}
                className="rounded-[1.6rem] p-1 bg-white/50 backdrop-blur-sm"
              >
                <img 
                  src="/41b02b86-3dc4-46c7-b506-8c61fd37e4b1 copy.png"
                  alt="Interactive learning interface showing mobile app with AI tutor and course content"
                  className="w-full h-auto rounded-[1.2rem] shadow-xl"
                  loading="eager"
                />
              </motion.div>
              
              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="absolute -bottom-4 -left-4 bg-cobalt text-white px-4 py-2 rounded-full flex items-center space-x-2 shadow-lg"
              >
                <ChatCircle className="h-5 w-5" />
                <span className="font-medium">AI Powered</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default HeroSection;