import React, { useState, useEffect } from 'react';
import request from '../utils/request';
import { useAuth } from '../context/AuthContext';
import { Layout, Menu, Drawer, Button, Space, Avatar } from 'antd';
import {
    MenuOutlined,
    AppstoreOutlined,
    SettingOutlined,
    LogoutOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Sider, Content, Header } = Layout;

const MainLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const navigate = useNavigate();
    const location = useLocation();

    // Use AuthContext
    const { user, logout, openLoginModal } = useAuth();
    // We can rely on user object from context instead of raw token check
    // user is { username, role }

    useEffect(() => {
        fetchSidebarData();
    }, []);

    const fetchSidebarData = async () => {
        try {
            const categoriesResult: any = await request.post('/categories', {});
            if (categoriesResult.code === 200) {
                setCategories(categoriesResult.data || []);
            }
        } catch (error) {
            console.error('Fetch sidebar data error:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/'); // Go home after logout
    };

    const menuItems = [
        {
            key: '/',
            icon: <AppstoreOutlined />,
            label: '全部题目',
        },
        ...categories.map(cat => ({
            key: `/category/${cat.ID}`,
            label: cat.name,
        })),
    ];

    const SidebarContent = (
        <div className="flex flex-col h-full bg-white">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100">
                        <span className="text-white font-bold">M</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900 leading-none">前进前进</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2">
                <Menu
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={({ key }) => {
                        navigate(key);
                        setDrawerVisible(false);
                    }}
                    className="border-none bg-transparent"
                />
            </div>

            <div className="p-4 border-t border-slate-100 flex flex-col gap-2">
                {user ? (
                    <>
                        {user.role === 'admin' && (
                            <Button
                                type="text"
                                icon={<SettingOutlined />}
                                block
                                className="flex items-center justify-start h-10 rounded-lg text-slate-500 hover:bg-slate-50"
                                onClick={() => navigate('/admin/questions/new')}
                            >
                                管理后台
                            </Button>
                        )}
                        <Button
                            type="text"
                            danger
                            icon={<LogoutOutlined />}
                            block
                            className="flex items-center justify-start h-10 rounded-lg"
                            onClick={handleLogout}
                        >
                            退出登录
                        </Button>
                    </>
                ) : (
                    <Button
                        type="primary"
                        icon={<UserOutlined />}
                        block
                        className="h-10 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-bold"
                        onClick={openLoginModal}
                    >
                        登录
                    </Button>
                )}
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
            {/* Desktop Sidebar */}
            <div className="hidden md:flex w-64 flex-col bg-white border-r border-slate-100 flex-shrink-0 z-20">
                {SidebarContent}
            </div>

            {/* Mobile Header - Fixed */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur border-b border-slate-100 flex items-center justify-between px-4 z-50">
                <div className="flex items-center gap-3">
                    <Button
                        type="text"
                        icon={<MenuOutlined />}
                        onClick={() => setDrawerVisible(true)}
                        className="text-lg"
                    />
                    <span className="font-bold text-slate-900">前进前进</span>
                </div>
            </div>

            {/* Mobile Drawer */}
            <Drawer
                placement="left"
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                styles={{
                    body: { padding: 0 },
                    header: { display: 'none' }
                }}
                width={256}
                closable={false}
            >
                {SidebarContent}
            </Drawer>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <div className="flex-1 overflow-y-auto">
                    {/* Add top padding for mobile header */}
                    <div className="md:hidden h-16" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
