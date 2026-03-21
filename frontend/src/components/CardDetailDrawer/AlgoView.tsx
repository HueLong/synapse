import React from 'react';
import { motion } from 'framer-motion';
import { MdPreview } from 'md-editor-rt';
import 'md-editor-rt/lib/preview.css';

export const AlgoView = ({ card }: { card: any }) => {
    return (
        <div className="flex flex-col h-full bg-white">
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
                
                {/* Meta Header */}
                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                        <span className={`px-4 py-1.5 text-sm font-bold uppercase tracking-wider rounded-xl shadow-sm ${
                            card.difficulty === 'Easy' ? 'bg-green-100 text-green-700 border border-green-200' :
                            card.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                            card.difficulty === 'Hard' ? 'bg-red-100 text-red-700 border border-red-200' :
                            'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                            {card.difficulty || 'Medium'}
                        </span>
                        <span className="text-slate-400 font-bold text-sm tracking-wide">LeetCode / 核心算法</span>
                    </div>
                </div>

                {/* Problem Description */}
                <div className="border-b border-slate-100 pb-2 mb-2">
                    <h3 className="text-xl font-bold text-slate-800 px-4">题目描述</h3>
                </div>
                <div className="w-full">
                    <MdPreview modelValue={card.problemDescription || card.content || "暂无题目描述"} editorId={`algo-desc-${card.id}`} />
                </div>
                
                {/* Examples */}
                {(card.example || card.answer) && (
                    <div className="mt-8">
                        <div className="border-b border-slate-100 pb-2 mb-2">
                            <h3 className="text-xl font-bold text-slate-800 px-4">示例与解答</h3>
                        </div>
                        <div className="bg-slate-900 rounded-2xl p-6 shadow-md border-t-4 border-blue-500 overflow-x-auto w-full mt-4">
                            <MdPreview theme="dark" modelValue={card.example || card.answer || ""} editorId={`algo-ans-${card.id}`} />
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 mt-auto">
                <button 
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all active:scale-95 flex items-center justify-center gap-3 text-lg tracking-wide"
                >
                    <span className="text-2xl">✅</span> 挑战成功，加入复习池
                </button>
            </div>
        </div>
    );
};
