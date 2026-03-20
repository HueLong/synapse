import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    BookOutlined,
    QuestionCircleOutlined,
    CodeOutlined,
    PlayCircleOutlined,
    LockOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import CardDetailDrawer from './CardDetailDrawer';

// --- Types ---
type CardType = 'concept' | 'qa' | 'algorithm';

interface CardNode {
    id: number;
    type: CardType;
    title: string;
    summary?: string;
    difficulty?: 'Easy' | 'Medium' | 'Hard';
    sequence: number;
    isLocked?: boolean;
}

interface TopicInfo {
    id: number;
    title: string;
    description: string;
    mode: 'discrete' | 'path';
}

// --- Mock Data ---
const mockTopic: TopicInfo = {
    id: 1,
    title: "二叉树核心套路",
    description: "从节点遍历到序列化，深度拆解二叉树的递归哲学与迭代技巧，打通任督二脉。",
    mode: 'path'
};

const mockCards: CardNode[] = [
    {
        id: 101,
        type: "concept",
        title: "二叉树的底层递归结构",
        summary: "理解前、中、后序遍历的递归本质就是代码在节点执行的时机不同。",
        sequence: 10,
        isLocked: false,
    },
    {
        id: 102,
        type: "qa",
        title: "为什么递归遍历的空间复杂度是 O(h)？",
        summary: "很多时候容易把时间复杂度和空间复杂度搞混，快来翻开盲盒检验一下。",
        sequence: 20,
        isLocked: false,
    },
    {
        id: 103,
        type: "algorithm",
        title: "二叉树的层序遍历 (LeetCode 102)",
        difficulty: "Medium",
        sequence: 30,
        isLocked: false,
    },
    {
        id: 104,
        type: "concept",
        title: "序列化与反序列化思维",
        summary: "将二维的树结构降维打击，变成一维的字符串。",
        sequence: 40,
        isLocked: true,
    },
    {
        id: 105,
        type: "algorithm",
        title: "二叉树的最近公共祖先 (LeetCode 236)",
        difficulty: "Hard",
        sequence: 50,
        isLocked: true,
    }
];

// --- Helpers ---
const getTypeConfig = (type: CardType) => {
    switch (type) {
        case 'concept':
            return { icon: <BookOutlined />, label: '概念', color: 'bg-emerald-100 text-emerald-600', border: 'border-emerald-200 hover:border-emerald-400' };
        case 'qa':
            return { icon: <QuestionCircleOutlined />, label: '问答', color: 'bg-amber-100 text-amber-600', border: 'border-amber-200 hover:border-amber-400' };
        case 'algorithm':
            return { icon: <CodeOutlined />, label: '算法', color: 'bg-blue-100 text-blue-600', border: 'border-blue-200 hover:border-blue-400' };
    }
};

const getDifficultyBadge = (difficulty?: string) => {
    switch (difficulty) {
        case 'Easy':
            return <span className="px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-800 rounded-md">简单</span>;
        case 'Medium':
            return <span className="px-2 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-md">中等</span>;
        case 'Hard':
            return <span className="px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-800 rounded-md">困难</span>;
        default:
            return null;
    }
};

// --- Animations ---
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: -20, y: 10 },
    show: { opacity: 1, x: 0, y: 0, transition: { type: "spring", stiffness: 250, damping: 20 } }
};

// --- Component ---
const TopicPath: React.FC = () => {
    const navigate = useNavigate();
    const [activeCard, setActiveCard] = useState<CardNode | null>(null);

    return (
        <div className="min-h-screen bg-slate-50/50 py-6 px-4 sm:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 text-center"
                >
                    <div className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-indigo-600 uppercase bg-indigo-100 rounded-full">
                        路线图模式 (Path Mode)
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 tracking-tight mb-4 drop-shadow-sm">
                        {mockTopic.title}
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        {mockTopic.description}
                    </p>
                </motion.div>

                {/* Timeline */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="relative pl-8 md:pl-0"
                >
                    {/* Central Line for Desktop, Left Line for Mobile */}
                    <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-0.5 bg-slate-200 transform md:-translate-x-1/2" />

                    {mockCards.map((card, index) => {
                        const typeConfig = getTypeConfig(card.type);
                        const isEven = index % 2 === 0;

                        return (
                            <motion.div
                                key={card.id}
                                variants={itemVariants}
                                className={`relative flex items-center mb-12 w-full md:justify-between ${isEven ? 'md:flex-row-reverse' : ''}`}
                            >
                                {/* Timeline Dot */}
                                <div className="absolute left-0 md:left-1/2 w-8 h-8 rounded-full bg-white border-4 border-slate-200 transform -translate-x-1/2 shadow-sm flex items-center justify-center z-10 transition-colors duration-300">
                                    {card.isLocked ? (
                                        <LockOutlined className="text-slate-400 text-[10px]" />
                                    ) : (
                                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                                    )}
                                </div>

                                {/* Spacer for Timeline Alignment (Desktop) */}
                                <div className="hidden md:block md:w-5/12" />

                                {/* Card Content */}
                                <div className="w-full pl-6 md:pl-0 md:w-5/12">
                                    <div
                                        onClick={() => !card.isLocked && setActiveCard(card)}
                                        className={`
                                            relative bg-white p-6 rounded-2xl shadow-sm border ${typeConfig.border}
                                            transition-all duration-300
                                            ${card.isLocked ? 'opacity-60 grayscale-[0.5] cursor-not-allowed' : 'hover:shadow-lg hover:-translate-y-1 cursor-pointer'}
                                            group
                                        `}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className={`flex items-center justify-center w-6 h-6 rounded-md ${typeConfig.color}`}>
                                                    {typeConfig.icon}
                                                </div>
                                                <span className="text-xs font-bold text-slate-500">{typeConfig.label}</span>
                                            </div>
                                            {getDifficultyBadge(card.difficulty)}
                                        </div>

                                        <h3 className={`text-lg font-bold mb-2 transition-colors ${card.isLocked ? 'text-slate-600' : 'text-slate-800 group-hover:text-indigo-600'}`}>
                                            {card.title}
                                        </h3>

                                        {card.summary && (
                                            <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                                                {card.summary}
                                            </p>
                                        )}

                                        {!card.isLocked && (
                                            <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500">
                                                <PlayCircleOutlined className="text-xl" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>

            <CardDetailDrawer 
                isOpen={!!activeCard}
                onClose={() => setActiveCard(null)}
                card={activeCard}
            />
        </div>
    );
};

export default TopicPath;
