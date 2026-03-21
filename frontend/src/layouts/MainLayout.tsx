import React, { useState, useEffect } from 'react';
import request from '../utils/request';
import { useAuth } from '../context/AuthContext';
import { Drawer, Button } from 'antd';
import {
    MenuOutlined,
    SettingOutlined,
    LogoutOutlined,
    UserOutlined,
    RightOutlined,
    DownOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types & Mock Data ---
interface NavNode {
    id: string;
    icon: string;
    label: string;
    path: string;
    children?: NavNode[];
}

const mockKnowledgeBase: NavNode[] = [
    {
        id: '101',
        icon: '🗂️',
        label: '算法与数据结构',
        path: '/category/101',
        children: [
            { id: '1', icon: '🗺️', label: '二叉树核心套路', path: '/topic/1' },
            { id: '2', icon: '🗺️', label: '动态规划进阶', path: '/topic/2' },
        ]
    },
    {
        id: '102',
        icon: '🗂️',
        label: 'Go 核心原理',
        path: '/category/102',
        children: [
            { id: '3', icon: '🗺️', label: 'GMP 调度模型深剖', path: '/topic/3' },
        ]
    },
    {
        id: '103',
        icon: '🗂️',
        label: 'Redis',
        path: '/category/103',
    }
];

// --- Subcomponents ---
const BaseNavItem = ({ 
    icon, label, isActive, isSemiActive, isChild, hasChildren, isExpanded, onToggle, onClick 
}: { 
    icon: string; label: string; isActive: boolean; isSemiActive?: boolean; isChild?: boolean;
    hasChildren?: boolean; isExpanded?: boolean; onToggle?: (e: React.MouseEvent) => void; onClick: () => void;
}) => (
    <div 
        onClick={onClick}
        className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 
            ${isChild ? 'ml-6 pl-2' : ''}
            ${isActive 
                ? 'bg-indigo-50 text-indigo-600 font-medium shadow-sm ring-1 ring-indigo-100/50' 
                : isSemiActive 
                    ? 'bg-slate-100 text-slate-800 font-medium'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 font-medium'
            }
        `}
    >
        <div className="flex items-center gap-3 overflow-hidden">
            <span className="text-xl flex-shrink-0">{icon}</span>
            <span className="line-clamp-1">{label}</span>
        </div>
        {hasChildren && (
            <div 
                onClick={(e) => {
                    e.stopPropagation();
                    if (onToggle) onToggle(e);
                }}
                className={`w-6 h-6 flex items-center justify-center rounded-md transition-colors 
                    ${isActive || isSemiActive ? 'text-indigo-500 hover:bg-indigo-100/50' : 'text-slate-400 hover:bg-slate-200/50'}
                `}
            >
                {isExpanded ? <DownOutlined className="text-[10px]" /> : <RightOutlined className="text-[10px]" />}
            </div>
        )}
    </div>
);

const AccordionNavNode = ({ node, currentPath, onClickNav }: { node: NavNode, currentPath: string, onClickNav: (p: string) => void }) => {
    // Check if any child is active
    const isChildActive = node.children?.some(c => c.path === currentPath);
    const isActive = node.path === currentPath;
    const isSemiActive = !isActive && isChildActive;
    
    // Auto expand if child is active, otherwise default to closed (unless managed in state). 
    // For simplicity, we manage internal state here, initialized by child activity.
    const [expanded, setExpanded] = useState(isChildActive || isActive);

    useEffect(() => {
        if (isChildActive || isActive) {
            setExpanded(true);
        }
    }, [isChildActive, isActive]);

    return (
        <div className="mb-1">
            <BaseNavItem 
                icon={node.icon}
                label={node.label}
                isActive={isActive}
                isSemiActive={isSemiActive}
                hasChildren={!!node.children && node.children.length > 0}
                isExpanded={expanded}
                onClick={() => {
                    onClickNav(node.path);
                    if (node.children?.length) setExpanded(true); // Auto expand when clicking parent
                }}
                onToggle={(e) => {
                    setExpanded(!expanded);
                }}
            />
            {node.children && node.children.length > 0 && (
                <AnimatePresence initial={false}>
                    {expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="overflow-hidden mt-1 space-y-1"
                        >
                            {node.children.map(child => (
                                <BaseNavItem 
                                    key={child.id}
                                    icon={child.icon}
                                    label={child.label}
                                    isChild={true}
                                    isActive={currentPath === child.path}
                                    onClick={() => onClickNav(child.path)}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
};

const SidebarGroup = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-8">
        <h3 className="text-xs font-bold text-slate-400 tracking-widest mb-3 px-3 uppercase">{title}</h3>
        <div className="space-y-1">
            {children}
        </div>
    </div>
);

const MainLayout: React.FC = () => {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const navigate = useNavigate();
    const location = useLocation();

    // Use AuthContext
    const { user, logout, openLoginModal } = useAuth();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const categoriesResult: any = await request.get('/tree');
            if (categoriesResult.code === 200 && Array.isArray(categoriesResult.data)) {
                const mappedNav = categoriesResult.data.map((cat: any) => ({
                    id: String(cat.ID),
                    icon: '🗂️',
                    label: cat.name,
                    path: `/category/${cat.ID}`,
                    children: (cat.topics || []).map((t: any) => ({
                        id: String(t.ID),
                        icon: '🗺️',
                        label: t.name,
                        path: `/topic/${t.ID}`
                    }))
                }));
                setCategories(mappedNav);
            }
        } catch (error) {
            console.error('Fetch sidebar data error:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleNavClick = (path: string) => {
        navigate(path);
        setDrawerVisible(false);
    };

    const SidebarContent = (
        <div className="flex flex-col h-full bg-slate-50 border-r border-slate-100 relative">
            {/* Minimal Background Glow */}
            <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-white to-transparent pointer-events-none z-0" />

            <div className="p-6 pb-2 z-10">
                <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={() => handleNavClick('/')}>
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                        <span className="text-white font-black text-xl leading-none">S</span>
                    </div>
                    <span className="text-2xl font-black text-slate-800 tracking-tight">Synapse</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 z-10 custom-scrollbar">
                <SidebarGroup title="MAIN (核心)">
                    <BaseNavItem 
                        icon="💠" 
                        label="全部突触 (Dashboard)" 
                        isActive={location.pathname === '/' || location.pathname === '/all'} 
                        onClick={() => handleNavClick('/')} 
                    />
                </SidebarGroup>

                <SidebarGroup title="KNOWLEDGE BASE (知识库)">
                    {categories.map(node => (
                        <AccordionNavNode 
                            key={node.id} 
                            node={node} 
                            currentPath={location.pathname} 
                            onClickNav={handleNavClick} 
                        />
                    ))}
                </SidebarGroup>
            </div>

            <div className="p-5 border-t border-slate-200/60 flex flex-col gap-2 mt-auto bg-slate-50 z-10">
                {user ? (
                    <>
                        {user.role === 'admin' && (
                            <button
                                onClick={() => handleNavClick('/admin/questions/new')}
                                className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 hover:bg-white hover:text-indigo-600 rounded-xl transition-all font-bold text-sm shadow-sm border border-transparent hover:border-slate-200"
                            >
                                <SettingOutlined className="text-lg" />
                                管理后台
                            </button>
                        )}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all font-bold text-sm shadow-sm border border-transparent hover:border-red-100"
                        >
                            <LogoutOutlined className="text-lg" />
                            退出登录
                        </button>
                    </>
                ) : (
                    <button
                        onClick={openLoginModal}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl transition-all font-bold shadow-lg shadow-slate-200 active:scale-95"
                    >
                        <UserOutlined className="text-lg" />
                        立即登录
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
            {/* Desktop Sidebar */}
            <div className="hidden md:flex w-72 flex-col flex-shrink-0 z-20">
                {SidebarContent}
            </div>

            {/* Mobile Header - Fixed */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur border-b border-slate-100 flex items-center justify-between px-4 z-50 shadow-sm">
                <div className="flex items-center gap-3">
                    <Button
                        type="text"
                        icon={<MenuOutlined className="text- slate-800" />}
                        onClick={() => setDrawerVisible(true)}
                        className="text-lg flex items-center justify-center"
                    />
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center shadow-sm shadow-indigo-100">
                            <span className="text-white font-bold text-xs uppercase">S</span>
                        </div>
                        <span className="font-extrabold text-slate-900">Synapse</span>
                    </div>
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
                closable={false}
            >
                {SidebarContent}
            </Drawer>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <div className="flex-1 overflow-y-auto">
                    {/* Add top padding for mobile header */}
                    <div className="md:hidden h-16" />
                    <div className="h-full">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
