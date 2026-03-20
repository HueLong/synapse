import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';

// 解析包含 ==关键内容== 的文本
const renderClozeText = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(==.*?==)/g);
    return parts.map((part, index) => {
        if (part.startsWith('==') && part.endsWith('==')) {
            const content = part.slice(2, -2);
            return <ClozeSpan key={index} content={content} />;
        }
        // 使用 span 包装普通文字
        return <span key={index}>{part}</span>;
    });
};

const ClozeSpan = ({ content }: { content: string }) => {
    const [revealed, setRevealed] = useState(false);
    return (
        <span 
            className={`
                cursor-pointer transition-all duration-300 px-1.5 py-0.5 mx-1 rounded-md
                ${revealed 
                    ? 'bg-yellow-200 text-yellow-900 filter-none' 
                    : 'bg-slate-200 text-transparent blur-[4px] hover:blur-none hover:bg-slate-300'
                }
            `}
            onClick={() => setRevealed(true)}
            title="点击揭晓"
        >
            {content}
        </span>
    );
};

export const ConceptView = ({ card }: { card: any }) => {
    const [isFeynmanMode, setIsFeynmanMode] = useState(false);

    const handleMastered = () => {
        console.log("标记为已掌握", card.id);
        setIsFeynmanMode(false);
    };

    return (
        <div className="flex flex-col h-full bg-white relative">
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
                <div className="prose prose-slate prose-lg max-w-none leading-loose text-slate-700 font-medium">
                    <p>
                        {renderClozeText(card.content || "二叉树的很多算法都是基于递归模型的。在这个模型中，最重要的就是理解 ==前序遍历==、==中序遍历== 和 ==后序遍历== 的本质区别。其实，无论是哪种遍历，代码都会到达每个节点 ==三次==，而所谓的前中后序，仅仅是我们选择在哪一次到达节点时执行我们的 ==核心逻辑== 而已。")}
                    </p>
                </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 mt-auto">
                <button 
                    onClick={() => setIsFeynmanMode(true)}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                    <CheckCircleOutlined /> ✨ 标记为已掌握
                </button>
            </div>

            {/* Feynman Modal */}
            <AnimatePresence>
                {isFeynmanMode && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.95, y: 20, opacity: 0 }}
                            className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-black text-slate-800">💡 灵魂拷问</h3>
                                    <button onClick={() => setIsFeynmanMode(false)} className="text-slate-400 hover:text-slate-600 transition-colors w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
                                        <CloseOutlined />
                                    </button>
                                </div>
                                <p className="text-slate-600 mb-6 font-medium bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    在标记为掌握前，请确认你已做到以下三点：
                                </p>
                                <ul className="space-y-5 mb-8">
                                    <li className="flex gap-4 text-slate-700 items-start">
                                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm mt-0.5">1</span>
                                        <span className="leading-relaxed">我能不看屏幕，口述出它的核心原理与执行流程。</span>
                                    </li>
                                    <li className="flex gap-4 text-slate-700 items-start">
                                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm mt-0.5">2</span>
                                        <span className="leading-relaxed">我清楚它主要解决了什么痛点。</span>
                                    </li>
                                    <li className="flex gap-4 text-slate-700 items-start">
                                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm mt-0.5">3</span>
                                        <span className="leading-relaxed">我知道它的局限性、缺点或不适用的场景。</span>
                                    </li>
                                </ul>
                                
                                <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
                                    <button 
                                        onClick={() => setIsFeynmanMode(false)}
                                        className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-colors"
                                    >
                                        心虚，我再看看
                                    </button>
                                    <button 
                                        onClick={handleMastered}
                                        className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition-all active:scale-95"
                                    >
                                        确认已掌握
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
