import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const QnAView = ({ card }: { card: any }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="flex flex-col h-full bg-slate-50/50">
            <div className="flex-1 p-8 flex flex-col items-center justify-center space-y-8 overflow-y-auto">
                {/* Question Box */}
                <div className="w-full max-w-lg bg-white p-10 rounded-3xl shadow-sm border border-slate-200 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-400" />
                    <h2 className="text-2xl font-extrabold text-slate-800 leading-relaxed">
                        {card.question || "对于二叉树的递归算法，为什么说它的空间复杂度不仅仅是 O(1)，就算没有申请额外的数组，它通常是多少？"}
                    </h2>
                </div>

                {/* Answer Box (Behind flip) */}
                <AnimatePresence mode="wait">
                    {!isFlipped ? (
                        <motion.button 
                            key="flip-btn"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -20 }}
                            onClick={() => setIsFlipped(true)}
                            className="px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold rounded-full shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all active:scale-95"
                        >
                            👀 翻转查看答案
                        </motion.button>
                    ) : (
                        <motion.div 
                            key="answer-box"
                            initial={{ opacity: 0, rotateX: 90 }}
                            animate={{ opacity: 1, rotateX: 0 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                            className="w-full max-w-lg bg-indigo-50 p-8 rounded-3xl border border-indigo-100 shadow-inner"
                        >
                            <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4 inline-block border-b-2 border-indigo-200 pb-1">参考答案</h4>
                            <div className="prose prose-indigo prose-lg text-slate-700">
                                <p>
                                    {card.answer || "哪怕没有申请额外的数据结构，递归调用本身会占用 **系统调用栈 (Call Stack)** 的空间。在最坏的情况下（比如树退化成了链表），递归深度达到 N，空间复杂度就是 O(N)。在平衡二叉树的情况下，深度为 logN，空间复杂度为 O(logN)。因此一般可以说空间复杂度是 O(h)，其中 h 是树的高度。"}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* SRS Actions */}
            <AnimatePresence>
                {isFlipped && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 bg-white border-t border-slate-200 mt-auto"
                    >
                        <p className="text-center text-sm font-bold text-slate-400 mb-5 uppercase tracking-widest">如何评价你的记忆程度？</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
                            <button className="py-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 hover:border-red-200 rounded-2xl font-bold transition-all active:scale-95">😖 忘记</button>
                            <button className="py-4 bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-100 hover:border-orange-200 rounded-2xl font-bold transition-all active:scale-95">🤔 模糊</button>
                            <button className="py-4 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 hover:border-blue-200 rounded-2xl font-bold transition-all active:scale-95">🙂 熟悉</button>
                            <button className="py-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-100 hover:border-emerald-200 rounded-2xl font-bold transition-all active:scale-95">😎 牢记</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
