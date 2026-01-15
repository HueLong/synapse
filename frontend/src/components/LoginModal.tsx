import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import request from '../utils/request';
import { useAuth } from '../context/AuthContext';

const LoginModal: React.FC = () => {
    const { isLoginModalOpen, closeLoginModal, login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [shake, setShake] = useState(0);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const res: any = await request.post('/login', values);
            if (res.code === 200) {
                message.success('登录成功');
                // Assuming res.data.username handles username if returned, else use input or default
                login(res.data.token, res.data.role, values.username);
            } else {
                message.error(res.message || '登录失败');
                triggerShake();
            }
        } catch (error) {
            console.error('Login failed:', error);
            triggerShake();
        } finally {
            setLoading(false);
        }
    };

    const triggerShake = () => {
        setShake(prev => prev + 1);
    };

    // Stop propagation to prevent closing when clicking inside the modal
    const handleModalClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <AnimatePresence>
            {isLoginModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden p-4 sm:p-6"
                    role="dialog"
                    aria-modal="true"
                    onClick={closeLoginModal}
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
                        aria-hidden="true"
                    />

                    {/* Modal Panel */}
                    <motion.div
                        key={shake} // Key change triggers re-render/animation if needed, but for shake we use animate prop
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            x: shake ? [-10, 10, -10, 10, 0] : 0
                        }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }} // Shake animation duration logic handled inside x sequence usually, or default
                        className="relative w-full max-w-md transform rounded-2xl bg-white p-8 text-left shadow-2xl transition-all"
                        onClick={handleModalClick}
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">欢迎回来</h2>
                            <p className="text-slate-500 mt-2 text-sm">请登录以继续操作</p>
                        </div>

                        <Form
                            name="modal_login_aesthetic"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            size="large"
                            className="space-y-4"
                        >
                            <Form.Item
                                name="username"
                                rules={[{ required: true, message: '请输入用户名!' }]}
                                className="mb-0"
                            >
                                <Input
                                    prefix={<UserOutlined className="text-slate-400" />}
                                    placeholder="用户名"
                                    className="rounded-xl bg-slate-50 border-transparent hover:bg-slate-100 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all h-12"
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: '请输入密码!' }]}
                                className="mb-6"
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="text-slate-400" />}
                                    placeholder="密码"
                                    className="rounded-xl bg-slate-50 border-transparent hover:bg-slate-100 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all h-12"
                                />
                            </Form.Item>

                            <Form.Item className="mb-0">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="w-full rounded-xl h-12 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 border-none font-bold text-white shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all transform hover:-translate-y-0.5"
                                    loading={loading}
                                >
                                    立即登录
                                </Button>
                            </Form.Item>
                        </Form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LoginModal;
