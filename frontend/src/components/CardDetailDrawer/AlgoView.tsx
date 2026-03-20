import React from 'react';
import { motion } from 'framer-motion';

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
                <div className="prose prose-slate prose-lg max-w-none">
                    <h3 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">题目描述</h3>
                    <p className="text-slate-700 leading-relaxed font-medium">
                        {card.problemDescription || "给定一个二叉树的根节点 root ，返回其节点值的层序遍历。（即逐层地，从左到右访问所有节点）。"}
                    </p>
                    
                    {/* Examples */}
                    <h3 className="text-xl font-bold text-slate-800 mt-10 mb-4 border-b border-slate-100 pb-2">输入输出示例</h3>
                    <div className="bg-slate-900 rounded-2xl p-6 shadow-md border-t-4 border-blue-500 overflow-x-auto">
                        <pre className="text-blue-100 font-mono text-sm leading-loose whitespace-pre-wrap"><code>
{card.example || `输入：root = [3,9,20,null,null,15,7]
输出：[[3],[9,20],[15,7]]

输入：root = [1]
输出：[[1]]

输入：root = []
输出：[]`}
                        </code></pre>
                    </div>
                </div>
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
