import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Tag, Space, Skeleton, Breadcrumb, message } from 'antd';
import { ArrowLeftOutlined, EyeOutlined, ClockCircleOutlined, EditOutlined } from '@ant-design/icons';
import { MdPreview } from 'md-editor-rt';
import 'md-editor-rt/lib/preview.css';
import request from '../utils/request';

interface Question {
    id: number;
    title: string;
    content: string;
    answer: string;
    difficulty: number;
    category_name: string;
    updated_at: string;
    created_at: string;
    views: number;
    review_count?: number;
    mastery_level?: number;
}

const QuestionDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [question, setQuestion] = useState<Question | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAnswer, setShowAnswer] = useState(false);
    const [reviewing, setReviewing] = useState(false);
    const [reviewSubmitted, setReviewSubmitted] = useState(false);
    const [reviewCount, setReviewCount] = useState(0);

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const fetchedIdRef = React.useRef<string | null>(null);

    useEffect(() => {
        if (id === fetchedIdRef.current) return; // Prevent duplicate fetch for same ID
        fetchedIdRef.current = id || null;

        const controller = new AbortController();
        if (id) {
            fetchQuestionDetail(id, controller.signal);
        }
        return () => {
            controller.abort();
            // Do not reset fetchedIdRef here to support Strict Mode behavior
        };
    }, [id]);

    const handleReview = async (masteryLevel: number) => {
        if (!question) return;
        setReviewing(true);
        try {
            const result: any = await request.post('/review', {
                id: question.id,
                mastery_level: masteryLevel
            });
            if (result.code === 200) {
                setReviewSubmitted(true);
                setReviewCount(prev => prev + 1);
                message.success('打卡成功！');
            }
        } catch (error) {
            console.error('Review error:', error);
        } finally {
            setReviewing(false);
        }
    };

    const fetchQuestionDetail = async (questionId: string, signal?: AbortSignal) => {
        setLoading(true);
        try {
            const result: any = await request.post('/card/detail', {
                id: Number(questionId)
            });

            if (result.success || result.code === 200) {
                setQuestion(result.data);
                if (result.data.review_count) {
                    setReviewCount(result.data.review_count);
                }
            } else {
                message.error(result.message || '获取详情失败');
            }
        } catch (error: any) {
            console.error('Fetch detail error:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDifficultyInfo = (d: number) => {
        if (d === 1) return { text: '简单', color: 'success' };
        if (d === 2) return { text: '中等', color: 'processing' };
        return { text: '困难', color: 'error' };
    };

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto p-6 lg:p-10">
                <Skeleton active title paragraph={{ rows: 10 }} />
            </div>
        );
    }

    if (!question) {
        return (
            <div className="max-w-3xl mx-auto p-6 lg:p-10 text-center">
                <p className="text-slate-500">未找到相关题目</p>
                <Button onClick={() => navigate('/')} type="primary" className="mt-4">返回首页</Button>
            </div>
        );
    }

    const diff = getDifficultyInfo(question.difficulty);

    return (
        <div className="max-w-4xl mx-auto p-6 lg:p-10 pb-20">
            <Breadcrumb className="mb-8">
                <Breadcrumb.Item>
                    <a onClick={() => navigate('/')}>首页</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{question.category_name}</Breadcrumb.Item>
                <Breadcrumb.Item>题目详情</Breadcrumb.Item>
            </Breadcrumb>

            <header className="mb-10">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Tag color={diff.color}>{diff.text}</Tag>
                    <Tag color="blue">{question.category_name}</Tag>
                    <Space className="text-slate-400 text-xs ml-auto">
                        <ClockCircleOutlined />
                        <span>更新于 {new Date(question.updated_at).toLocaleDateString()}</span>
                    </Space>
                </div>
                <div className="flex justify-between items-start gap-4">
                    <h1 className="text-3xl font-bold text-slate-900 leading-tight flex-1">
                        {question.title}
                    </h1>
                    {token && role === 'admin' && (
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => navigate(`/admin/questions/edit/${question.id}`)}
                        >
                            编辑
                        </Button>
                    )}
                </div>
            </header>

            {question.content && question.content.trim() !== '' && (
                <section className="prose prose-slate max-w-none mb-12">
                    <h2 className="text-xl font-bold text-slate-900 border-l-4 border-indigo-500 pl-4 mb-6">题目描述</h2>
                    <div className="bg-slate-50 rounded-2xl p-6 lg:p-8 border border-slate-200">
                        <MdPreview modelValue={question.content} />
                    </div>
                </section>
            )}

            <section className="relative">
                <h2 className="text-xl font-bold text-slate-900 border-l-4 border-indigo-500 pl-4 mb-6">解析与答案</h2>

                <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200">
                    <div className={`p-6 lg:p-8 transition-all duration-500 ${!showAnswer ? 'blur-md select-none grayscale pt-16 h-64 overflow-hidden' : 'blur-0'}`}>
                        <MdPreview modelValue={question.answer || '暂无答案解析。'} />
                    </div>

                    {!showAnswer && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[2px]">
                            <div className="text-center p-8 bg-white/90 rounded-2xl shadow-xl border border-slate-100">
                                <p className="text-slate-500 mb-6 font-medium">思维火花正在碰撞中...</p>
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<EyeOutlined />}
                                    onClick={() => setShowAnswer(true)}
                                    className="bg-indigo-600 hover:bg-indigo-700 h-12 px-8 rounded-xl flex items-center shadow-lg shadow-indigo-100"
                                >
                                    点击查看答案详情
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Review Section - Only visible after showing answer */}
            {showAnswer && (
                <section className="mt-8 mb-12">
                    <div className="bg-white rounded-2xl p-6 lg:p-8 border border-slate-200 shadow-sm text-center">
                        {reviewSubmitted ? (
                            <div className="py-2 text-emerald-500 font-bold text-lg animate-pulse">
                                ✅ 已打卡，坚持就是胜利！(当前复习第 {reviewCount} 次)
                            </div>
                        ) : (
                            <>
                                <h3 className="text-slate-500 mb-6 font-medium">本次复习感觉如何？</h3>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <Button
                                        size="large"
                                        className="rounded-xl h-12 px-6 border-slate-200 hover:border-rose-400 hover:text-rose-500"
                                        onClick={() => handleReview(1)}
                                        loading={reviewing}
                                        disabled={reviewing}
                                    >
                                        😩 忘记了
                                    </Button>
                                    <Button
                                        size="large"
                                        className="rounded-xl h-12 px-6 border-slate-200 hover:border-amber-400 hover:text-amber-500"
                                        onClick={() => handleReview(2)}
                                        loading={reviewing}
                                        disabled={reviewing}
                                    >
                                        🤔 有点印象
                                    </Button>
                                    <Button
                                        size="large"
                                        className="rounded-xl h-12 px-6 border-slate-200 hover:border-emerald-400 hover:text-emerald-500"
                                        onClick={() => handleReview(3)}
                                        loading={reviewing}
                                        disabled={reviewing}
                                    >
                                        😎 完全掌握
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </section>
            )}

            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 lg:left-auto lg:right-12 lg:translate-x-0 z-40">
                <Button
                    shape="round"
                    size="large"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)}
                    className="shadow-2xl border-none h-12 px-6 flex items-center font-medium bg-white text-slate-600 hover:text-indigo-600 transition-all hover:scale-105"
                >
                    返回列表
                </Button>
            </div>
        </div>
    );
};

export default QuestionDetail;
