import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseOutlined, BookOutlined, QuestionCircleOutlined, CodeOutlined } from '@ant-design/icons';
import { ConceptView } from './ConceptView';
import { QnAView } from './QnAView';
import { AlgoView } from './AlgoView';

interface CardDetailDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    card: any;
}

const CardDetailDrawer: React.FC<CardDetailDrawerProps> = ({ isOpen, onClose, card }) => {
    
    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; }
    }, [isOpen]);

    if (!card) return null;

    const renderHeaderIcon = () => {
        switch(card.type) {
            case 'concept': return <BookOutlined className="text-emerald-500" />;
            case 'qa': return <QuestionCircleOutlined className="text-amber-500" />;
            case 'algorithm': return <CodeOutlined className="text-blue-500" />;
            default: return <BookOutlined />;
        }
    };

    const renderContent = () => {
        switch(card.type) {
            case 'concept': return <ConceptView card={card} />;
            case 'qa': return <QnAView card={card} />;
            case 'algorithm': return <AlgoView card={card} />;
            default: return <div className="p-8 text-slate-500 font-medium">未知卡片类型或无内容</div>;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm transition-opacity"
                    />

                    {/* Drawer (Slide Over) */}
                    <motion.div 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 250 }}
                        className="fixed top-0 right-0 bottom-0 z-[101] w-full max-w-2xl bg-white shadow-2xl flex flex-col border-l border-slate-200"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-white z-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-50 rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-xl">
                                    {renderHeaderIcon()}
                                </div>
                                <h2 className="text-2xl font-extrabold text-slate-800 line-clamp-1 pr-4">
                                    {card.title}
                                </h2>
                            </div>
                            <button 
                                onClick={onClose}
                                className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors bg-white border border-slate-100 shadow-sm"
                            >
                                <CloseOutlined className="text-lg" />
                            </button>
                        </div>

                        {/* Scrolling Content Area */}
                        <div className="flex-1 overflow-hidden relative bg-slate-50">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={card.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="h-full w-full"
                                >
                                    {renderContent()}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CardDetailDrawer;
