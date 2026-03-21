import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SearchOutlined, BookOutlined, QuestionCircleOutlined, CodeOutlined } from '@ant-design/icons';
import CardDetailDrawer from '../components/CardDetailDrawer';
import request from '../utils/request';
import { useParams } from 'react-router-dom';

// --- Types ---
type CardType = 'concept' | 'qa' | 'algorithm';

interface FullCard {
    id: number;
    type: CardType;
    title: string;
    category: string;
    status: string;
    difficulty?: string;
    content?: string;
    question?: string;
    answer?: string;
    problemDescription?: string;
    example?: string;
}

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
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

// --- Component ---
const Home: React.FC = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const [searchText, setSearchText] = useState('');
    const [activeCard, setActiveCard] = useState<FullCard | null>(null);
    const [stats, setStats] = useState({ total: 0, dueToday: 0, newCards: 0 });
    const [cards, setCards] = useState<FullCard[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async (showLoading = true) => {
        if (showLoading) setLoading(true);
        try {
            const [statsRes, cardsRes] = await Promise.all([
                request.get('/stats'),
                request.post('/cards', { 
                    page: 1, 
                    page_size: 100,
                    category_id: categoryId ? Number(categoryId) : 0
                })
            ]);

            if (statsRes && (statsRes as any).code === 200) {
                const data = (statsRes as any).data;
                setStats({
                    total: data.total || 0,
                    dueToday: data.dueToday || 0,
                    newCards: data.newCards || 0,
                });
            }

            if (cardsRes && (cardsRes as any).code === 200) {
                const list = (cardsRes as any).data.list || [];
                const mapped = list.map((c: any) => ({
                    id: c.id,
                    type: c.card_type,
                    title: c.title,
                    category: c.category || '未分类',
                    difficulty: ["Easy", "Medium", "Hard"][c.difficulty - 1] || 'Medium',
                    status: c.status || 'new',
                }));
                setCards(mapped);
            }
        } catch (error) {
            console.error("Failed to fetch home data", error);
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [categoryId]);

    const handleCardClick = async (card: FullCard) => {
        try {
            const res: any = await request.post('/card/detail', { id: card.id });
            if (res.code === 200) {
                setActiveCard({
                    ...card,
                    content: res.data.content,
                    answer: res.data.answer,
                    question: res.data.content,
                    problemDescription: res.data.content
                });
            } else {
                // If detail fetch fails, just open with basic info
                setActiveCard(card);
            }
        } catch (e) {
            console.error(e);
            setActiveCard(card);
        }
    };

    const filteredCards = cards.filter(c => c.title.toLowerCase().includes(searchText.toLowerCase()));

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
                                    <span className="text-2xl font-black text-slate-700">{loading ? '-' : stats.total}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-orange-100 shadow-sm ring-1 ring-orange-100/50 transition-transform hover:scale-105">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 font-black text-xl border border-orange-100">
                                    🔥
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">待复习 (Due Today)</span>
                                    <span className="text-2xl font-black text-orange-600">{loading ? '-' : stats.dueToday}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-emerald-100 shadow-sm transition-transform hover:scale-105">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 font-black text-xl border border-emerald-100">
                                    ✨
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">新卡片 (New)</span>
                                    <span className="text-2xl font-black text-emerald-600">{loading ? '-' : stats.newCards}</span>
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
                {loading ? (
                    <div className="py-20 flex justify-center items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
                    </div>
                ) : filteredCards.length > 0 ? (
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
                                onClick={() => handleCardClick(card)}
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
                    </motion.div>
                ) : (
                    <div className="py-20 text-center text-slate-500 font-medium bg-white rounded-3xl border border-dashed border-slate-200">
                        没有找到匹配的知识节点 🕵️‍♂️
                    </div>
                )}

                {/* 3. Integration with CardDetailDrawer */}
                <CardDetailDrawer 
                    isOpen={!!activeCard}
                    onClose={() => {
                        setActiveCard(null);
                        fetchData(false); // Refresh silently to prevent screen flush
                    }}
                    card={activeCard}
                />
            </div>
        </div>
    );
};

export default Home;
