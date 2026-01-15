import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, message, Card, Modal, Space } from 'antd';
import { MdEditor } from 'md-editor-rt';
import { useParams, useNavigate } from 'react-router-dom';
import request from '../../utils/request';
import 'md-editor-rt/lib/style.css';

const EditQuestion = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [content, setContent] = useState('');
    const [answer, setAnswer] = useState('## 参考答案\n在这里输入答案...');
    const [preview, setPreview] = useState(true);
    const [categories, setCategories] = useState<any[]>([]);

    // Add Category Modal State
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryDesc, setNewCategoryDesc] = useState('');

    useEffect(() => {
        const handleResize = () => {
            setPreview(window.innerWidth >= 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        fetchCategories();

        if (id) {
            fetchQuestionDetail(id);
        }

        return () => window.removeEventListener('resize', handleResize);
    }, [id]);

    const fetchCategories = async () => {
        try {
            const res: any = await request.post('/categories', {});
            // Check if res.data exists or if res IS the data (based on interceptor)
            // request interceptor returns response.data
            // response.data usually has { code, message, data }
            if (res.code === 200 && res.data) {
                const options = res.data.map((item: any) => ({
                    value: item.ID,
                    label: item.name
                }));
                setCategories(options);
            }
        } catch (error) {
            console.error('Fetch categories error:', error);
        }
    };

    const fetchQuestionDetail = async (questionId: string) => {
        try {
            const result: any = await request.post('/question/detail', {
                id: Number(questionId)
            });
            if (result.code === 200) {
                const q = result.data;
                form.setFieldsValue({
                    title: q.title,
                    category_id: q.category_id,
                    difficulty: q.difficulty
                });
                setContent(q.content);
                setAnswer(q.answer);
            } else {
                message.error(result.message || '获取题目详情失败');
            }
        } catch (error) {
            console.error('Fetch detail error:', error);
        }
    };

    const handleAddCategory = async () => {
        if (!newCategoryName) {
            message.warning('请输入分类名称');
            return;
        }
        try {
            const result: any = await request.post('/category/add', {
                name: newCategoryName,
                description: newCategoryDesc
            });

            if (result.code === 200) {
                message.success('分类添加成功');
                setIsCategoryModalOpen(false);
                setNewCategoryName('');
                setNewCategoryDesc('');
                fetchCategories(); // Refresh list
            } else {
                message.error(result.message || '添加失败');
            }
        } catch (error) {
            console.error('Add category error:', error);
        }
    };

    const onFinish = async (values: any) => {
        const payload = { ...values, content, answer, id: id ? Number(id) : undefined };
        const url = id ? '/update-question' : '/create-question';

        try {
            const result: any = await request.post(url, payload);

            if (result.code === 200) {
                message.success(id ? '题目已更新！' : '题目已发布！');
                // Redirect to detail page
                const targetId = id || result.data.ID;
                if (targetId) {
                    navigate(`/question/${targetId}`);
                } else {
                    navigate('/');
                }
            } else {
                message.error(result.message || '操作失败');
            }
        } catch (error) {
            console.error('Submit error:', error);
            // message.error handles by interceptor usually, but safe to keep log
        }
    };

    return (
        <div className="p-4 max-w-5xl mx-auto">
            <Card title={id ? "编辑面试题" : "录入面试题"} className="shadow-md">
                <Form layout="vertical" onFinish={onFinish} form={form}>
                    <Form.Item label="题目标题" name="title" rules={[{ required: true, message: '请输入题目标题' }]}>
                        <Input placeholder="输入题目名称，如：什么是 GMP 模型？" size="large" />
                    </Form.Item>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item label="分类" required>
                            <Space.Compact block>
                                <Form.Item
                                    name="category_id"
                                    noStyle
                                    rules={[{ required: true, message: '请选择分类' }]}
                                >
                                    <Select
                                        placeholder="请选择分类"
                                        options={categories}
                                        size="large"
                                        style={{ width: 'calc(100% - 100px)' }}
                                    />
                                </Form.Item>
                                <Button size="large" onClick={() => setIsCategoryModalOpen(true)}>新增分类</Button>
                            </Space.Compact>
                        </Form.Item>
                        <Form.Item label="难度等级" name="difficulty" rules={[{ required: true, message: '请选择难度' }]}>
                            <Select
                                placeholder="请选择难度"
                                options={[{ value: 1, label: '简单' }, { value: 2, label: '中等' }, { value: 3, label: '困难' }]}
                                size="large"
                            />
                        </Form.Item>
                    </div>

                    <Form.Item label="问题描述 (可选)">
                        <MdEditor
                            modelValue={content}
                            onChange={setContent}
                            language="en-US"
                            preview={preview}
                            style={{ height: '300px' }}
                        />
                    </Form.Item>

                    <Form.Item label="参考答案 (Markdown)">
                        <MdEditor
                            modelValue={answer}
                            onChange={setAnswer}
                            language="en-US"
                            preview={preview}
                            style={{ height: '300px' }}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block size="large">
                            发布题目
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            <Modal
                title="新增分类"
                open={isCategoryModalOpen}
                onOk={handleAddCategory}
                onCancel={() => setIsCategoryModalOpen(false)}
            >
                <Form layout="vertical">
                    <Form.Item label="分类名称" required>
                        <Input
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="例如：Golang基础"
                        />
                    </Form.Item>
                    <Form.Item label="描述">
                        <Input.TextArea
                            value={newCategoryDesc}
                            onChange={(e) => setNewCategoryDesc(e.target.value)}
                            placeholder="描述该分类..."
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default EditQuestion;