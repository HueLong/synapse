import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';

import { MdPreview } from 'md-editor-rt';
import 'md-editor-rt/lib/preview.css';

export const ConceptView = ({ card }: { card: any }) => {
    const [isFeynmanMode, setIsFeynmanMode] = useState(false);

    // Provide a simple click-to-reveal global listener for <mark> tags inside preview
    React.useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName.toLowerCase() === 'mark') {
                target.classList.add('revealed');
            }
        };
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    const handleMastered = () => {
        console.log("标记为已掌握", card.id);
        setIsFeynmanMode(false);
    };

    return (
        <div className="flex flex-col h-full bg-white relative">
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <style>{`
                    .concept-md-preview mark {
                        background-color: #e2e8f0;
                        color: transparent;
                        filter: blur(4px);
                        transition: all 0.3s;
                        cursor: pointer;
                        border-radius: 4px;
                        padding: 0 4px;
                        user-select: none;
                    }
                    .concept-md-preview mark:hover {
                        filter: blur(2px);
                    }
                    .concept-md-preview mark.revealed {
                        background-color: #fef08a;
                        color: #713f12;
                        filter: none;
                    }
                `}</style>
                <div className="concept-md-preview">
                    <MdPreview modelValue={card.content || card.answer || "暂无内容"} editorId={`concept-${card.id}`} />
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
