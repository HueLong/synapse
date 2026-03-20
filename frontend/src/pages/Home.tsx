import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SearchOutlined, BookOutlined, QuestionCircleOutlined, CodeOutlined } from '@ant-design/icons';
import CardDetailDrawer from '../components/CardDetailDrawer';

// --- Types & Mock Data ---
type CardType = 'concept' | 'qa' | 'algorithm';

interface MockCard {
    id: number;
    type: CardType;
    title: string;
    category: string;
    status: 'due' | 'mastered' | 'new';
    difficulty?: 'Easy' | 'Medium' | 'Hard';
    content?: string;
    question?: string;
    answer?: string;
    problemDescription?: string;
    example?: string;
}

const mockStats = {
    total: 128,
    dueToday: 15,
    newCards: 8,
};

const mockCards: MockCard[] = [
    {
        id: 1,
        type: 'concept',
        title: '并发模型：CSP vs Actor',
        category: 'Go核心',
        status: 'due',
        content: 'Go 语言的并发模型主要受 ==CSP== (Communicating Sequential Processes) 启发。'
    },
    {
        id: 2,
        type: 'qa',
        title: 'Goroutine 的栈空间初始大小是多少？',
        category: 'Go底层',
        status: 'mastered',
        question: 'Goroutine 的栈空间初始大小是多少？最大可以扩容到多少？',
        answer: '通常初始大小是 2KB。在 64 位机器上最大可达 1GB，32位机器上 250MB。'
    },
    {
        id: 3,
        type: 'algorithm',
        title: 'LRU 缓存机制',
        category: '设计题',
        difficulty: 'Medium',
        status: 'new',
        problemDescription: '请你设计并实现一个满足 LRU (最近最少使用) 缓存约束的数据结构。',
        example: '输入\n["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]'
    },
    {
        id: 4,
        type: 'concept',
        title: 'Redis 缓存雪崩与穿透',
        category: '系统设计',
        status: 'due',
        content: '缓存穿透：查询一个一定不存在的数据。解决：布隆过滤器。缓存雪崩：大量 key 同一时间失效。解决：随机过期时间。'
    },
    {
        id: 5,
        type: 'algorithm',
        title: 'K 个一组翻转链表',
        category: '链表',
        difficulty: 'Hard',
        status: 'mastered',
        problemDescription: '给你链表的头节点 head ，每 k 个节点一组进行翻转，请你返回修改后的链表。',
        example: '输入：head = [1,2,3,4,5], k = 2\n输出：[2,1,4,3,5]'
    }
];

// --- Helpers ---
const getTypeDisplay = (type: CardType) => {
    switch (type) {
        case 'concept': return <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md"><BookOutlined /> 概念</span>;
        case 'qa': return <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md"><QuestionCircleOutlined /> 问答</span>;
        case 'algorithm': return <span className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md"><CodeOutlined /> 算法</span>;
        default: return null;
    }
};

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'due': return <span title="待复习" className="text-red-500 animate-pulse text-sm">🔴</span>;
        case 'mastered': return <span title="已掌握" className="text-green-500 text-sm">🟢</span>;
        case 'new': return <span title="新卡片" className="text-blue-500 text-sm">🔵</span>;
        default: return null;
    }
};

const getDifficultySpan = (diff?: string) => {
    if (!diff) return null;
    const colors = diff === 'Easy' ? 'bg-green-100 text-green-700' :
                   diff === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                   'bg-red-100 text-red-700';
    return <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-md ${colors}`}>{diff}</span>;
}

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

// --- Component ---
const Home: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [activeCard, setActiveCard] = useState<MockCard | null>(null);

    const filteredCards = mockCards.filter(c => c.title.toLowerCase().includes(searchText.toLowerCase()));

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 w-full">
            <div className="max-w-7xl mx-auto">
                {/* 1. Top Mini Dashboard */}
                <header className="mb-12 flex flex-col xl:flex-row xl:items-end justify-between gap-8 border-b border-slate-200/60 pb-8">
                    <div className="flex-1">
                        <h1 className="text-4xl font-extrabold text-slate-900 mb-6 drop-shadow-sm tracking-tight">
                            🧠 全部突触 <span className="text-2xl text-slate-400 font-medium ml-2">(All Nodes)</span>
                        </h1>
                        
                        <div className="flex flex-wrap items-center gap-4">
                            {/* Dashboard Stats */}
                            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm transition-transform hover:scale-105">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 font-black text-lg border border-slate-100">
                                    Σ
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">总突触数量 (Total)</span>
                                    <span className="text-2xl font-black text-slate-700">{mockStats.total}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-orange-100 shadow-sm ring-1 ring-orange-100/50 transition-transform hover:scale-105">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 font-black text-xl border border-orange-100">
                                    🔥
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">待复习 (Due Today)</span>
                                    <span className="text-2xl font-black text-orange-600">{mockStats.dueToday}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-emerald-100 shadow-sm transition-transform hover:scale-105">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 font-black text-xl border border-emerald-100">
                                    ✨
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">新卡片 (New)</span>
                                    <span className="text-2xl font-black text-emerald-600">{mockStats.newCards}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full xl:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                        <div className="relative group flex-1 sm:w-64">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                <SearchOutlined />
                            </span>
                            <input 
                                type="text" 
                                placeholder="搜索任意卡片..." 
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700 placeholder-slate-400 shadow-sm"
                            />
                        </div>
                        <button className="px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 animate-pulse">
                            🚀 开始今日智能复习
                        </button>
                    </div>
                </header>

                {/* 2. Grid Card Layout */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    {filteredCards.map(card => (
                        <motion.div 
                            key={card.id}
                            variants={itemVariants}
                            onClick={() => setActiveCard(card)}
                            className="group flex flex-col bg-white border border-slate-100 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:border-indigo-100"
                        >
                            <div className="flex justify-between items-start mb-4">
                                {getTypeDisplay(card.type)}
                            </div>
                            
                            <h3 className="text-xl font-extrabold text-slate-800 leading-snug mb-8 group-hover:text-indigo-600 transition-colors line-clamp-3">
                                {card.title}
                            </h3>

                            <div className="mt-auto pt-4 border-t border-slate-100/80 flex items-center justify-between">
                                <span className="px-2.5 py-1 text-xs font-bold text-slate-500 bg-slate-100 rounded-md">
                                    {card.category}
                                </span>
                                <div className="flex items-center gap-2 text-xl filter drop-shadow-sm">
                                    {getDifficultySpan(card.difficulty)}
                                    {getStatusBadge(card.status)}
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {filteredCards.length === 0 && (
                        <div className="col-span-full py-20 text-center text-slate-500 font-medium bg-white rounded-3xl border border-dashed border-slate-200">
                            没有找到匹配的知识节点 🕵️‍♂️
                        </div>
                    )}
                </motion.div>

                {/* 3. Integration with CardDetailDrawer */}
                <CardDetailDrawer 
                    isOpen={!!activeCard}
                    onClose={() => setActiveCard(null)}
                    card={activeCard}
                />
            </div>
        </div>
    );
};

export default Home;
