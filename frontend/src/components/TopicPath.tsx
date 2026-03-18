import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface Question {
    ID: number;
    title: string;
    difficulty: number;
    sequence: number;
}

interface Topic {
    ID: number;
    name: string;
    description: string;
}

interface TopicPathProps {
    topic?: Topic;
    questions?: Question[];
}

const getDifficultyBadge = (difficulty: number) => {
    switch (difficulty) {
        case 1:
            return <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">简单</span>;
        case 2:
            return <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">中等</span>;
        case 3:
            return <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">困难</span>;
        default:
            return <span className="px-2 py-1 text-xs font-semibold bg-slate-100 text-slate-800 rounded-full">未知</span>;
    }
};

const STAGGER_DELAY = 0.15;

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: STAGGER_DELAY
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const TopicPath: React.FC<TopicPathProps> = ({ topic, questions }) => {
    const navigate = useNavigate();

    // Mock Data Fallback
    const displayTopic = topic || { ID: 1, name: "二叉树专项", description: "从零开始掌握二叉树的核心算法，层层递进！" };
    const displayQuestions = questions && questions.length > 0 ? questions : [
        { ID: 101, title: "二叉树的最大深度", difficulty: 1, sequence: 10 },
        { ID: 102, title: "翻转二叉树", difficulty: 1, sequence: 20 },
        { ID: 103, title: "对称二叉树", difficulty: 1, sequence: 30 },
        { ID: 104, title: "二叉树的层序遍历", difficulty: 2, sequence: 40 },
        { ID: 105, title: "二叉树的最近公共祖先", difficulty: 2, sequence: 50 },
    ];

    return (
        <div className="max-w-3xl mx-auto py-12 px-6">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 text-center"
            >
                <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-4">{displayTopic.name}</h1>
                <p className="text-lg text-slate-500">{displayTopic.description}</p>
            </motion.div>

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="relative border-l-4 border-indigo-100 ml-6 md:ml-12"
            >
                {displayQuestions.map((q, index) => (
                    <motion.div 
                        key={q.ID}
                        variants={itemVariants}
                        className="mb-10 ml-8 relative group"
                    >
                        {/* Timeline Node / Circle */}
                        <div className="absolute -left-[45px] top-1 w-8 h-8 rounded-full bg-white border-4 border-indigo-500 flex items-center justify-center shadow-md group-hover:scale-110 group-hover:border-violet-500 transition-all z-10">
                            <span className="text-xs font-bold text-indigo-600 group-hover:text-violet-600">{index + 1}</span>
                        </div>

                        {/* Content Card */}
                        <div 
                            onClick={() => navigate(`/question/${q.ID}`)}
                            className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-200 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    {getDifficultyBadge(q.difficulty)}
                                    <span className="text-xs font-medium text-slate-400">Step {q.sequence}</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                    {q.title}
                                </h3>
                            </div>
                            
                            <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                <PlayCircleOutlined className="text-xl" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default TopicPath;
