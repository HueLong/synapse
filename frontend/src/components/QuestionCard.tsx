import { Tag, Space } from 'antd';
import { ClockCircleOutlined, EyeOutlined, DatabaseOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

interface QuestionCardProps {
    id: number;
    title: string;
    difficulty: number;
    category: string;
    updatedAt: string;
    onClick?: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
    title,
    difficulty,
    category,
    updatedAt,
    onClick,
}) => {
    const getDifficultyInfo = (d: number) => {
        if (d === 1) return { color: 'bg-emerald-500', text: '简单', tag: 'success' };
        if (d === 2) return { color: 'bg-amber-500', text: '中等', tag: 'warning' };
        return { color: 'bg-rose-500', text: '困难', tag: 'error' };
    };

    const diff = getDifficultyInfo(difficulty);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            onClick={onClick}
            className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200 cursor-pointer transition-all hover:border-indigo-300 hover:shadow-xl h-full flex flex-col"
        >
            {/* Left Difficulty Strip */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${diff.color}`} />

            {/* Background Watermark */}
            <div className="absolute -bottom-6 -right-6 text-slate-100 rotate-[-12deg] z-0 transition-transform duration-300 group-hover:scale-110">
                <DatabaseOutlined style={{ fontSize: '100px' }} />
            </div>

            <div className="p-5 pl-8 relative z-10 flex flex-col h-full">
                {/* Top Badge */}
                <div className="mb-3">
                    <span className="bg-slate-100 text-slate-600 rounded-full px-2.5 py-1 text-xs font-semibold">
                        {category}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 mb-6 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">
                    {title}
                </h3>

                {/* Bottom Metadata */}
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                        <ClockCircleOutlined />
                        <span>{updatedAt}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-medium">
                        <div className="flex items-center gap-1 text-slate-400">
                            <EyeOutlined />
                            <span>128</span> {/* Mock Views */}
                        </div>
                        <div className={`flex items-center gap-1 ${diff.tag === 'success' ? 'text-emerald-500' : diff.tag === 'warning' ? 'text-amber-500' : 'text-rose-500'}`}>
                            <span>{diff.text}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default QuestionCard;
