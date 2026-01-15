import React, { useState, useEffect } from 'react';
import { Space, Input, Card, Skeleton, Empty, Select, message } from 'antd';
import { SearchOutlined, FireOutlined, history, ClockCircleOutlined, BulbOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import SpotlightCard from '../components/SpotlightCard';
import request from '../utils/request';

// Animated Counter Component
const AnimatedCounter = ({ value }: { value: number }) => {
    const spring = useSpring(0, { bounce: 0, duration: 2000 });
    const rounded = useTransform(spring, Math.round);

    useEffect(() => {
        spring.set(value);
    }, [value, spring]);

    return <motion.span>{rounded}</motion.span>;
};

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const Home: React.FC = () => {
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [sortOrder, setSortOrder] = useState('smart'); // Default sort
    const [stats, setStats] = useState({ total: 0, today: 0 }); // Added stats state
    const navigate = useNavigate();
    const { categoryId } = useParams<{ categoryId?: string }>();
    const [categoryName, setCategoryName] = useState('');

    const statsFetchedRef = React.useRef(false); // Ref to track if stats have been fetched

    useEffect(() => {
        if (statsFetchedRef.current) return;
        statsFetchedRef.current = true;
        fetchStats();
    }, []);



    useEffect(() => {
        fetchQuestions();
        // If not viewing a category, clear the name
        if (!categoryId) {
            setCategoryName('');
        }
    }, [categoryId, sortOrder]);




    // ...

    const fetchStats = async () => {
        try {
            const result: any = await request.get('/stats');
            if (result.code === 200) {
                setStats({
                    total: result.data.total,
                    today: result.data.today_new
                });
            }
        } catch (error) {
            console.error('Fetch stats error:', error);
        }
    };

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const result: any = await request.post('/questions', {
                category_id: categoryId ? Number(categoryId) : 0,
                page: 1,
                page_size: 100,
                sort: sortOrder
            });
            if (result.success || result.code === 200) {
                const list = result.data?.list || [];
                setQuestions(list);

                // Optimistic: Set category name from the first item if in category mode
                if (categoryId && list.length > 0) {
                    setCategoryName(list[0].category);
                }

                // Stats should be managed by fetchStats and not overwritten here
                // unless we want to show filtered count, but the UI says "Total Question Bank"
            } else {
                message.error(result.message || result.error || '获取题目失败');
            }
        } catch (error) {
            console.error('Fetch questions error:', error);
            message.error('网络错误');
        } finally {
            setLoading(false);
        }
    };

    const filteredQuestions = questions.filter(q =>
        q.title.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className="p-6 md:p-10 w-full">
            <header className="mb-8">
                {/* Stats Row within Header or below it? User said "top of main content area". I'll put it in a grid with Title. */}
                <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
                    <div className="flex-1">
                        {/* Stats - simple badges or text for now, or the blocks from Sidebar */}
                        <div className="flex items-center gap-6 mb-4 text-sm text-slate-500">
                            {!categoryId ? (
                                <>
                                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                                        <span className="w-2 h-2 rounded-full bg-slate-800"></span>
                                        <span className="flex items-center gap-1">
                                            总题库:
                                            <span className="font-bold text-slate-900 inline-flex min-w-[20px]">
                                                <AnimatedCounter value={stats.total} />
                                            </span>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                        <span className="flex items-center gap-1">
                                            今日新增:
                                            <span className="font-bold text-indigo-600 inline-flex min-w-[20px]">
                                                <AnimatedCounter value={stats.today} />
                                            </span>
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                    <span>分类: <span className="font-bold text-indigo-600">{categoryName}</span></span>
                                </div>
                            )}
                        </div>

                        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
                            {categoryId ? (categoryName ? `${categoryName} 分类` : '分类筛选') : '所有题目'}
                        </h1>
                        <p className="text-slate-500">
                            {categoryId ? `探索针对 ${categoryName || '该分类'} 的深度面试秘籍` : '人民万岁'}
                        </p>
                    </div>

                    <div className="w-full xl:w-96 flex gap-3">
                        <Select
                            value={sortOrder}
                            onChange={(val) => setSortOrder(val)}
                            size="large"
                            className="w-36 rounded-xl"
                            options={[
                                { value: 'smart', label: <span className="flex items-center gap-1"><BulbOutlined className="text-amber-500" /> 智能复习</span> },
                                { value: 'views', label: <span className="flex items-center gap-1"><FireOutlined className="text-rose-500" /> 最热题目</span> },
                                { value: 'newest', label: <span className="flex items-center gap-1"><ClockCircleOutlined className="text-blue-500" /> 最新录入</span> },
                            ]}
                        />
                        <Input
                            prefix={<SearchOutlined className="text-slate-400" />}
                            placeholder="搜索..."
                            size="large"
                            className="rounded-xl border-slate-200 flex-1"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                        />
                    </div>
                </div>
            </header>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <Card key={i} className="rounded-2xl border-slate-100">
                            <Skeleton active title paragraph={{ rows: 2 }} />
                        </Card>
                    ))}
                </div>
            ) : questions.length > 0 ? (
                <motion.div
                    key={categoryId || 'all'}
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    <AnimatePresence mode='popLayout'>
                        {filteredQuestions.map((q) => (
                            <SpotlightCard
                                key={q.id}
                                id={q.id}
                                title={q.title}
                                difficulty={q.difficulty}
                                category={q.category} // Assuming API returns 'category' object or string. DTO says CategoryName is flattened, but List returns Category struct? No, List returning Flattened DTO.
                                // Actually, repository GetList returns DTO with 'CategoryName'.
                                // Client code map: category={q.category || q.CategoryName}. Check GetList DTO.
                                // Repository line 53: CategoryName: q.Category.Name
                                // Home.tsx use q.category? Wait, in previous view I saw q.category.
                                // Let's check view_file 607 line 53. DTO has CategoryName.
                                // But JS frontend might receive it as CategoryName.
                                // Let's check Home.tsx state. It seems it uses q.category.
                                // Let's fix property access if needed.
                                views={q.views} // Pass views!
                                updatedAt={new Date(q.updated_at).toLocaleDateString()}
                                nextReviewAt={q.next_review_at}
                                onClick={() => navigate(`/question/${q.id}`)}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>
            ) : (
                <div className="py-20 flex justify-center">
                    <Empty description="暂无相关题目内容" />
                </div>
            )}
        </div>
    );
};

export default Home;
