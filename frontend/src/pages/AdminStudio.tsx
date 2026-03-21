import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import request from '../utils/request';
import {
    FolderOutlined,
    NodeIndexOutlined,
    FileTextOutlined,
    PlusOutlined,
    BookOutlined,
    QuestionCircleOutlined,
    CodeOutlined,
    DownOutlined,
    RightOutlined,
    ArrowLeftOutlined,
    SaveOutlined,
    CloseOutlined,
    EditOutlined,
    EyeOutlined
} from '@ant-design/icons';

// --- Types & Interfaces ---
type CardType = 'concept' | 'qa' | 'algorithm' | 'category' | 'topic';
type Difficulty = 'Easy' | 'Medium' | 'Hard';
type ViewMode = 'edit' | 'preview';

interface CardNode {
    id: string;
    title: string;
    type: CardType;
    content?: string;
    question?: string;
    answer?: string;
    difficulty?: Difficulty;
}

interface TopicNode {
    id: string;
    title: string;
    cards: CardNode[];
}

interface CategoryNode {
    id: string;
    title: string;
    topics: TopicNode[];
    cards: CardNode[];
}

// --- Helpers ---
const renderClozeText = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(==.*?==)/g);
    return parts.map((part, index) => {
        if (part.startsWith('==') && part.endsWith('==')) {
            const content = part.slice(2, -2);
            return (
                <span 
                    key={index} 
                    className="mx-1 px-1.5 py-0.5 rounded cursor-pointer transition-all duration-300 blur-[4px] bg-slate-200 text-transparent hover:blur-none hover:text-slate-800 border-b-2 border-indigo-400 font-bold"
                    title="点击揭晓"
                >
                    {content}
                </span>
            );
        }
        return <span key={index}>{part}</span>;
    });
};

const diffMaper: Record<number, Difficulty> = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };
const diffRevMaper: Record<Difficulty, number> = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };

// --- Subcomponents ---
const TreeCategory = ({ 
    category, 
    activeTopicId, 
    activeCardId, 
    onSelectTopic, 
    onSelectCard,
    onAddTopic,
    onAddTopicCard,
    onAddCategoryCard,
}: { 
    category: CategoryNode, 
    activeTopicId: string | null, 
    activeCardId: string | null,
    onSelectTopic: (id: string, catTitle: string, categoryId: string) => void,
    onSelectCard: (id: string, parentContext: string, categoryId: string, topicId: string | null) => void,
    onAddTopic: (categoryId: string, catTitle: string) => void,
    onAddTopicCard: (topicId: string, topicTitle: string, categoryId: string) => void,
    onAddCategoryCard: (categoryId: string, catTitle: string) => void,
}) => {
    const [expanded, setExpanded] = useState(true);

    return (
        <div className="mb-2">
            <div className="group flex items-center justify-between px-3 py-2 text-slate-700 font-bold hover:bg-slate-200/50 rounded-lg cursor-pointer transition-colors">
                <div className="flex items-center gap-2 flex-1 overflow-hidden" onClick={() => setExpanded(!expanded)}>
                    <span className="text-slate-400 text-[10px] w-4 text-center">
                        {expanded ? <DownOutlined /> : <RightOutlined />}
                    </span>
                    <span className="text-lg flex-shrink-0">🗂️</span>
                    <span className="truncate">{category.title}</span>
                </div>
                <div className="flex opacity-0 group-hover:opacity-100 transition-all ml-2 gap-1 bg-white shadow-sm border border-slate-200 rounded p-[2px]">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onAddCategoryCard(category.id, category.title); }} 
                        className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded text-slate-400 hover:text-blue-600 transition-all text-sm" 
                        title="新增散装卡片"
                    >
                        <FileTextOutlined />
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onAddTopic(category.id, category.title); }} 
                        className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded text-slate-400 hover:text-indigo-600 transition-all text-xs" 
                        title="新增路线图"
                    >
                        <NodeIndexOutlined />
                    </button>
                </div>
            </div>

            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-6 mt-1"
                    >
                        {category.topics.map(topic => (
                            <TreeTopic 
                                key={topic.id} 
                                topic={topic} 
                                isActive={activeTopicId === topic.id}
                                activeCardId={activeCardId}
                                categoryId={category.id}
                                categoryTitle={category.title}
                                onSelect={() => onSelectTopic(topic.id, category.title, category.id)}
                                onSelectCard={onSelectCard}
                                onAddTopicCard={onAddTopicCard}
                            />
                        ))}

                        <div className="space-y-1 mt-1 mb-2 relative before:content-[''] before:absolute before:left-3 before:top-0 before:bottom-0 before:w-px before:bg-slate-200">
                            {category.cards.map(card => (
                                <div 
                                    key={card.id}
                                    onClick={(e) => { e.stopPropagation(); onSelectCard(card.id, `🗂️ ${category.title} / 独立知识点`, category.id, null); }}
                                    className={`flex items-center gap-2 px-3 py-1.5 ml-3 rounded-lg text-sm cursor-pointer transition-colors relative z-10
                                        ${activeCardId === card.id ? 'bg-white shadow-sm ring-1 ring-blue-200/60 text-blue-800 font-bold' : 'text-slate-500 hover:bg-slate-200/50'}
                                    `}
                                >
                                    <FileTextOutlined className={activeCardId === card.id ? "text-blue-500" : "text-slate-400"} />
                                    <span className="truncate">{card.title}</span>
                                </div>
                            ))}
                        </div>

                        {category.topics.length === 0 && category.cards.length === 0 && (
                            <div className="text-xs text-slate-400 italic px-3 ml-3 py-1">暂无内容</div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const TreeTopic = ({ 
    topic, 
    isActive, 
    activeCardId,
    categoryId,
    categoryTitle,
    onSelect, 
    onSelectCard,
    onAddTopicCard
}: { 
    topic: TopicNode, 
    isActive: boolean;
    activeCardId: string | null;
    categoryId: string;
    categoryTitle: string;
    onSelect: () => void;
    onSelectCard: (id: string, parentContext: string, categoryId: string, topicId: string | null) => void;
    onAddTopicCard: (topicId: string, topicTitle: string, categoryId: string) => void;
}) => {
    return (
        <div className="mb-1">
            <div className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all duration-200
                ${isActive ? 'bg-indigo-100/50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
            `}>
                <div className="flex items-center gap-2 flex-1 overflow-hidden" onClick={onSelect}>
                    <NodeIndexOutlined className={isActive ? "text-indigo-500 flex-shrink-0" : "text-slate-400 flex-shrink-0"} />
                    <span className="truncate">{topic.title}</span>
                </div>
                <div className="flex opacity-0 group-hover:opacity-100 transition-all ml-2 bg-white shadow-sm border border-slate-200 rounded p-[2px]">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onAddTopicCard(topic.id, topic.title, categoryId); }} 
                        className={`w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded transition-all text-xs
                            ${isActive ? 'text-indigo-500' : 'text-slate-400 hover:text-indigo-600'}
                        `}
                        title="新增路线图卡片"
                    >
                        <FileTextOutlined />
                    </button>
                </div>
            </div>

            {isActive && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="pl-5 mt-2 space-y-1 mb-3 relative before:content-[''] before:absolute before:left-[11px] before:top-0 before:bottom-0 before:w-px before:bg-indigo-200/60"
                >
                    {topic.cards.map(card => (
                        <div 
                            key={card.id}
                            onClick={(e) => { e.stopPropagation(); onSelectCard(card.id, ` 🗺️ ${topic.title} / 关卡节点`, categoryId, topic.id); }}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-colors relative z-10
                                ${activeCardId === card.id ? 'bg-white shadow-sm ring-1 ring-indigo-200/60 text-indigo-800 font-bold' : 'text-slate-500 hover:bg-slate-200/50'}
                            `}
                        >
                            <FileTextOutlined className={activeCardId === card.id ? "text-indigo-500" : "text-slate-400"} />
                            <span className="truncate">{card.title}</span>
                        </div>
                    ))}
                    {topic.cards.length === 0 && (
                        <div className="text-xs text-slate-400 italic px-3 py-1">路线图为空</div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

// --- Main Page Component ---
const AdminStudio: React.FC = () => {
    const navigate = useNavigate();
    
    // UI State
    const [treeData, setTreeData] = useState<CategoryNode[]>([]);
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
    const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
    const [activeCardId, setActiveCardId] = useState<string | null>(null);
    const [editorContext, setEditorContext] = useState<string>('📍 请选择或创建节点');
    
    // Editor State
    const [editorType, setEditorType] = useState<CardType>('concept');
    const [editorTitle, setEditorTitle] = useState('');
    const [editorDifficulty, setEditorDifficulty] = useState<Difficulty>('Medium');
    const [editorContent, setEditorContent] = useState('');
    const [editorAnswer, setEditorAnswer] = useState('');

    const [viewMode, setViewMode] = useState<ViewMode>('edit');

    const fetchTreeData = async () => {
        try {
            const res: any = await request.get('/studio/tree');
            if (res.code === 200 && Array.isArray(res.data)) {
                const mappedData = res.data.map((cat: any) => ({
                    id: String(cat.ID),
                    title: cat.name,
                    topics: (cat.topics || []).map((t: any) => ({
                        id: String(t.ID),
                        title: t.name,
                        cards: (t.cards || []).map((c: any) => ({
                            id: String(c.ID),
                            title: c.title,
                            type: c.card_type,
                            content: c.content,
                            question: c.content, 
                            answer: c.answer,
                            difficulty: diffMaper[c.difficulty] || 'Medium'
                        }))
                    })),
                    cards: (cat.cards || []).map((c: any) => ({
                            id: String(c.ID),
                            title: c.title,
                            type: c.card_type,
                            content: c.content,
                            question: c.content,
                            answer: c.answer,
                            difficulty: diffMaper[c.difficulty] || 'Medium'
                    }))
                }));
                setTreeData(mappedData);
            }
        } catch (err) {
            console.error("Failed to fetch tree data", err);
        }
    };

    useEffect(() => {
        fetchTreeData();
    }, []);
    
    const handleAddCategory = () => {
        setActiveCategoryId(null);
        setActiveTopicId(null);
        setActiveCardId('new-category');
        setEditorContext(`📍 正在创建: 全局新大类 (Category)`);
        setEditorTitle('');
        setEditorType('category');
        setEditorContent('');
        setViewMode('edit');
    };

    const handleAddTopic = (categoryId: string, catTitle: string) => {
        setActiveCategoryId(categoryId);
        setActiveTopicId(null);
        setActiveCardId('new-topic');
        setEditorContext(`📍 正在创建: 🗂️ ${catTitle} 内的新路线图`);
        setEditorTitle('');
        setEditorType('topic');
        setEditorContent('');
        setViewMode('edit');
    };

    const handleAddTopicCard = (topicId: string, topicTitle: string, categoryId: string) => {
        setActiveCategoryId(categoryId);
        setActiveTopicId(topicId);
        setActiveCardId('new');
        setEditorContext(`📍 正在创建: 🗺️ ${topicTitle} 的关卡节点`);
        resetEditorForm();
    };

    const handleAddCategoryCard = (categoryId: string, catTitle: string) => {
        setActiveCategoryId(categoryId);
        setActiveTopicId(null);
        setActiveCardId('new');
        setEditorContext(`📍 正在创建: 🗂️ ${catTitle} 的独立知识点`);
        resetEditorForm();
    };

    const resetEditorForm = () => {
        setEditorTitle('');
        setEditorType('concept');
        setEditorContent('');
        setEditorAnswer('');
        setViewMode('edit');
        setEditorDifficulty('Medium');
    };

    const handleSelectCard = (cardId: string, parentContext: string, categoryId: string, topicId: string | null) => {
        setActiveCategoryId(categoryId);
        setActiveCardId(cardId);
        setActiveTopicId(topicId);
        setEditorContext(`📍 位于: ${parentContext}`);
        
        for (const cat of treeData) {
            const discreteFound = cat.cards.find(c => c.id === cardId);
            if (discreteFound) {
                populateEditor(discreteFound);
                return;
            }
            for (const t of cat.topics) {
                const found = t.cards.find(c => c.id === cardId);
                if (found) {
                    populateEditor(found);
                    return;
                }
            }
        }
    };

    const populateEditor = (found: CardNode) => {
        setEditorType(found.type);
        setEditorTitle(found.title);
        if (found.difficulty) setEditorDifficulty(found.difficulty);
        setEditorContent(found.content || found.question || '');
        setEditorAnswer(found.answer || '');
    };

    const handleSave = async () => {
        try {
            if (activeCardId === 'new-category') {
                await request.post('/studio/categories', { name: editorTitle });
                alert("创建大类成功");
            } else if (activeCardId === 'new-topic') {
                if (!activeCategoryId) return alert("Missing category state");
                await request.post('/studio/topics', { name: editorTitle, category_id: Number(activeCategoryId) });
                alert("创建路线图成功");
            } else if (activeCardId === 'new') {
                if (!activeCategoryId) return alert("Missing category state");
                await request.post('/studio/cards', {
                    title: editorTitle,
                    card_type: editorType,
                    content: editorContent,
                    answer: editorAnswer,
                    difficulty: diffRevMaper[editorDifficulty],
                    category_id: Number(activeCategoryId),
                    topic_id: activeTopicId ? Number(activeTopicId) : null
                });
                alert("创建卡片成功");
            } else if (activeCardId && activeCardId !== 'new' && activeCardId !== 'new-category' && activeCardId !== 'new-topic') {
                // Update Card
                await request.put(`/studio/cards/${activeCardId}`, {
                    title: editorTitle,
                    card_type: editorType,
                    content: editorContent,
                    answer: editorAnswer,
                    difficulty: diffRevMaper[editorDifficulty]
                });
                alert("更新卡片成功");
            }
            // Refresh Tree
            await fetchTreeData();
            // Clear or keep active logic
        } catch (error) {
            console.error("Failed to save", error);
            alert("保存失败，请检查控制台");
        }
    };

    return (
        <div className="h-screen flex bg-white overflow-hidden font-sans">
            {/* Left Column: Contextual Structure Tree */}
            <div className="w-[340px] flex-shrink-0 bg-slate-50 border-r border-slate-200 flex flex-col h-full z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                {/* Header */}
                <div className="p-5 border-b border-slate-200/60 bg-white/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-5">
                        <button 
                            onClick={() => navigate('/')}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200/50 text-slate-400 transition-colors"
                        >
                            <ArrowLeftOutlined />
                        </button>
                        <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">创造者工作室</h1>
                    </div>
                    {/* ONLY one Global main button */}
                    <button onClick={handleAddCategory} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-sm transition-all flex items-center justify-center gap-2">
                        <FolderOutlined /> 新增大类 (Category)
                    </button>
                </div>

                {/* Tree Content */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {treeData.map(category => (
                        <TreeCategory 
                            key={category.id} 
                            category={category}
                            activeTopicId={activeTopicId}
                            activeCardId={activeCardId}
                            onSelectTopic={(id, title, catId) => { setActiveTopicId(id); setActiveCategoryId(catId); }}
                            onSelectCard={handleSelectCard}
                            onAddTopic={handleAddTopic}
                            onAddTopicCard={handleAddTopicCard}
                            onAddCategoryCard={handleAddCategoryCard}
                        />
                    ))}
                </div>
            </div>

            {/* Right Column: Polymorphic Editor & Live Preview */}
            <div className="flex-1 flex flex-col h-full bg-white relative">
                {/* Editor Header / Type Selector */}
                <div className="h-20 border-b border-slate-100 flex items-center justify-between px-10 flex-shrink-0 bg-white z-10">
                    <div>
                        <span className="text-xs font-bold text-slate-400 tracking-wider">
                            {!activeCardId ? '🚀 请点击左侧节点' : activeCardId.startsWith('new') ? '✨ 创建新模块' : '📝 编辑模块'}
                        </span>
                        <div className="text-xs mt-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md w-max border border-slate-200/60">
                            {editorContext}
                        </div>
                    </div>
                    
                    {/* Segmented Control - Only visible for cards */}
                    {['concept', 'qa', 'algorithm'].includes(editorType) && (
                        <div className="flex bg-slate-100/80 p-1 rounded-xl shadow-inner border border-slate-200/50">
                            {[
                                { type: 'concept', icon: <BookOutlined />, label: '概念' },
                                { type: 'qa', icon: <QuestionCircleOutlined />, label: '问答' },
                                { type: 'algorithm', icon: <CodeOutlined />, label: '算法' }
                            ].map(opt => (
                                <button
                                    key={opt.type}
                                    onClick={() => setEditorType(opt.type as CardType)}
                                    className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200
                                        ${editorType === opt.type 
                                            ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200/50' 
                                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                        }`}
                                >
                                    {opt.icon}
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Dynamic Editor Area */}
                {activeCardId ? <div className="flex-1 overflow-y-auto px-10 py-12 custom-scrollbar focus-within:bg-slate-50/30 transition-colors">
                    <div className="max-w-4xl mx-auto space-y-10 pb-32">
                        {/* Title (Common) */}
                        <div>
                            <input
                                type="text"
                                placeholder={
                                    editorType === 'category' ? "输入大类名称..." : 
                                    editorType === 'topic' ? "输入路线图名称..." : 
                                    "输入卡片核心主题..."
                                }
                                value={editorTitle}
                                onChange={(e) => setEditorTitle(e.target.value)}
                                className="w-full text-4xl font-extrabold text-slate-900 bg-transparent outline-none placeholder:text-slate-300 transition-all border-b-2 border-transparent focus:border-indigo-500/20 pb-2"
                            />
                        </div>

                        {/* View Mode Toggle & Content Area */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
                            {/* Toolbar */}
                            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                                <span className="text-sm font-bold flex items-center gap-2 text-indigo-700">
                                    {editorType === 'concept' ? <><BookOutlined /> 概念正文区</> :
                                     editorType === 'qa' ? <><QuestionCircleOutlined /> 问答编排区</> :
                                     editorType === 'algorithm' ? <><CodeOutlined /> 题目描述区</> :
                                     editorType === 'category' ? <><FolderOutlined /> 大类描述</> :
                                     <><NodeIndexOutlined /> 路线图描述</>}
                                </span>

                                <div className="flex bg-white p-0.5 rounded-lg border border-slate-200">
                                    <button
                                        onClick={() => setViewMode('edit')}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all
                                            ${viewMode === 'edit' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        <EditOutlined /> 编写
                                    </button>
                                    <button
                                        onClick={() => setViewMode('preview')}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all
                                            ${viewMode === 'preview' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        <EyeOutlined /> 预览
                                    </button>
                                </div>
                            </div>

                            {/* Content Body Based on View Mode & Polymorphic Type */}
                            <div className="p-6 bg-white min-h-[300px]">
                                <AnimatePresence mode="wait">
                                    {viewMode === 'edit' ? (
                                        <motion.div
                                            key="edit"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.15 }}
                                            className="space-y-6"
                                        >
                                            {(editorType === 'concept' || editorType === 'category' || editorType === 'topic') && (
                                                <textarea
                                                    value={editorContent}
                                                    onChange={(e) => setEditorContent(e.target.value)}
                                                    placeholder={editorType === 'concept' ? "支持 Markdown 及 ==自定义高亮== 控制挖空效果..." : "简单的描述信息 (可选)..."}
                                                    className="w-full h-80 bg-transparent resize-y outline-none focus:ring-0 text-slate-700 font-mono text-base leading-relaxed placeholder:text-slate-300"
                                                />
                                            )}

                                            {editorType === 'algorithm' && (
                                                <div className="space-y-6">
                                                    <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                                                        <label className="text-sm font-bold text-slate-500 w-24">题目难度</label>
                                                        <select
                                                            value={editorDifficulty}
                                                            onChange={(e) => setEditorDifficulty(e.target.value as Difficulty)}
                                                            className="h-10 px-4 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-slate-700 cursor-pointer"
                                                        >
                                                            <option value="Easy" className="text-green-600">Easy (简单)</option>
                                                            <option value="Medium" className="text-yellow-600">Medium (中等)</option>
                                                            <option value="Hard" className="text-red-600">Hard (困难)</option>
                                                        </select>
                                                    </div>
                                                    <textarea
                                                        value={editorContent}
                                                        onChange={(e) => setEditorContent(e.target.value)}
                                                        placeholder="题目描述、示例说明..."
                                                        className="w-full h-64 bg-transparent resize-y outline-none focus:ring-0 text-slate-700 font-mono text-base leading-relaxed placeholder:text-slate-300"
                                                    />
                                                </div>
                                            )}

                                            {editorType === 'qa' && (
                                                <div className="space-y-6">
                                                    <div>
                                                        <label className="block text-sm font-bold text-slate-400 mb-2">Q: 问题正文 (Front)</label>
                                                        <textarea
                                                            value={editorContent}
                                                            onChange={(e) => setEditorContent(e.target.value)}
                                                            className="w-full h-24 bg-transparent resize-y outline-none focus:ring-0 text-slate-800 font-mono text-lg font-bold leading-relaxed placeholder:text-slate-300 border-b border-slate-100"
                                                            placeholder="背诵提问..."
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-bold text-slate-400 mb-2">A: 答案揭晓 (Back)</label>
                                                        <textarea
                                                            value={editorAnswer}
                                                            onChange={(e) => setEditorAnswer(e.target.value)}
                                                            className="w-full h-48 bg-transparent resize-y outline-none focus:ring-0 text-slate-600 font-mono text-base leading-relaxed placeholder:text-slate-300"
                                                            placeholder="用户翻牌后看到的准确解答..."
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="preview"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.15 }}
                                            className="prose prose-slate max-w-none text-base bg-slate-50/50 p-6 rounded-xl border border-dashed border-slate-200 h-full min-h-[300px]"
                                        >
                                            {(editorType === 'concept' || editorType === 'category' || editorType === 'topic') && (
                                                <div className="whitespace-pre-wrap leading-loose">
                                                    {editorContent ? renderClozeText(editorContent) : <span className="text-slate-400 italic">空内容，开始编写...</span>}
                                                </div>
                                            )}

                                            {editorType === 'algorithm' && (
                                                <div>
                                                    <span className={`px-2 py-0.5 text-xs uppercase font-bold rounded-md mb-4 inline-block ${
                                                        editorDifficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                                        editorDifficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>{editorDifficulty}</span>
                                                    <div className="whitespace-pre-wrap leading-loose">
                                                        {editorContent ? renderClozeText(editorContent) : <span className="text-slate-400 italic">题目描述为空</span>}
                                                    </div>
                                                </div>
                                            )}

                                            {editorType === 'qa' && (
                                                <div className="space-y-6">
                                                    <div className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl">
                                                        <span className="text-amber-500 font-black mr-2">Q.</span>
                                                        <span className="font-bold text-slate-800">{editorContent || <span className="text-slate-300 italic">请输入问题</span>}</span>
                                                    </div>
                                                    <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl relative">
                                                        <div className="absolute top-0 right-0 p-2 text-[10px] text-slate-400 font-bold tracking-widest uppercase">Answers Revealed</div>
                                                        <div className="mt-4 whitespace-pre-wrap leading-relaxed text-slate-600">
                                                            {editorAnswer ? renderClozeText(editorAnswer) : <span className="text-slate-400 italic">空答案</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div> : <div className="flex-1 flex items-center justify-center bg-slate-50"><span className="text-slate-400">点击左侧目录进行操作</span></div>}

                {/* Bottom Action Footer */}
                {activeCardId && <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pointer-events-none">
                    <div className="max-w-4xl mx-auto flex justify-end gap-4 pointer-events-auto">
                        <button className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all flex items-center gap-2">
                            <CloseOutlined /> 取消修改
                        </button>
                        <button onClick={handleSave} className="px-8 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 transition-all active:scale-95 flex items-center gap-2">
                            <SaveOutlined /> 💾 保存{editorType === 'category' ? '分类' : editorType === 'topic' ? '路线图' : '知识碎片'}
                        </button>
                    </div>
                </div>}
            </div>
        </div>
    );
};

export default AdminStudio;
