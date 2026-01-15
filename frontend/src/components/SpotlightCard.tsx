import React from 'react';
import { Tag, Space } from 'antd';
import { ClockCircleOutlined, EyeOutlined, DatabaseOutlined } from '@ant-design/icons';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

interface SpotlightCardProps {
    id: number;
    title: string;
    difficulty: number;
    category: string;
    views?: number;
    updatedAt: string;
    nextReviewAt?: string;
    onClick?: () => void;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({
    title,
    difficulty,
    category,
    views = 0,
    updatedAt,
    nextReviewAt,
    onClick,
}) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    const getDifficultyInfo = (d: number) => {
        if (d === 1) return { color: 'bg-emerald-500', text: '简单', tag: 'success' };
        if (d === 2) return { color: 'bg-amber-500', text: '中等', tag: 'warning' };
        return { color: 'bg-rose-500', text: '困难', tag: 'error' };
    };

    const diff = getDifficultyInfo(difficulty);

    const getReviewStatus = () => {
        if (!nextReviewAt) return null;
        const now = new Date();
        const reviewDate = new Date(nextReviewAt);
        const diffMs = reviewDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        if (diffMs < 0) {
            return { text: '⚠️ 已过期', color: 'text-rose-500 bg-rose-50 border-rose-100' };
        }
        if (diffDays <= 1) {
            return { text: '⏰ 待复习', color: 'text-amber-500 bg-amber-50 border-amber-100' };
        }
        return { text: `${diffDays}天后复习`, color: 'text-indigo-400 bg-indigo-50 border-indigo-100' };
    };

    const reviewStatus = getReviewStatus();

    // blur fade-in variants
    const cardVariants = {
        hidden: { opacity: 0, filter: 'blur(8px)', scale: 0.96 },
        show: {
            opacity: 1,
            filter: 'blur(0px)',
            scale: 1,
            transition: { duration: 0.4 }
        }
    };

    return (
        <motion.div
            layout
            variants={cardVariants}
            // define variants but let parent control 'initial' and 'animate' (or use default propagation)
            // Parent has initial="hidden" animate="show" which propagates to these keys.
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            className="group relative h-full bg-white rounded-2xl overflow-hidden border border-slate-200 cursor-pointer transition-all hover:shadow-lg group-hover:border-indigo-500/50"
            style={{
                borderRadius: '1rem',
            }}
        >
            {/* Spotlight Layer: Intense & Smaller */}
            <motion.div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-10"
                style={{
                    background: useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, rgba(99, 102, 241, 0.25), transparent 80%)`
                }}
            />

            {/* Left Difficulty Strip */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${diff.color} z-20`} />

            {/* Background Watermark - Subtle */}
            <div className="absolute -bottom-6 -right-6 text-slate-800 rotate-[-12deg] z-10 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12 opacity-[0.03]">
                <DatabaseOutlined style={{ fontSize: '100px' }} />
            </div>

            {/* Content Container */}
            <div className="relative z-30 p-5 pl-8 flex flex-col h-full bg-transparent">
                {/* Top Badge */}
                <div className="mb-3 flex justify-between items-start">
                    <span className="bg-slate-100/80 text-slate-600 rounded-full px-2.5 py-0.5 text-xs font-bold border border-slate-100">
                        {category}
                    </span>
                    {reviewStatus && (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${reviewStatus.color}`}>
                            {reviewStatus.text}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-800 mb-6 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">
                    {title}
                </h3>

                {/* Bottom Metadata */}
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                        <ClockCircleOutlined />
                        <span>{updatedAt}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
                        <div className="flex items-center gap-1">
                            <EyeOutlined />
                            <span>{views}</span>
                        </div>
                        <div className={`flex items-center gap-1 ${diff.tag === 'success' ? 'text-emerald-500' : diff.tag === 'warning' ? 'text-amber-500' : 'text-rose-500'}`}>
                            <span>{diff.text}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default SpotlightCard;
