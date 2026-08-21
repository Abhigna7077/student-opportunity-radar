import React from 'react';
import { Clock, AlertCircle, CheckCircle2, CalendarOff } from 'lucide-react';

export default function DeadlineBadge({ deadlineStatus, size = 'default' }) {
  const getStatusConfig = (statusText = '') => {
    const text = (statusText || '').toLowerCase();

    if (text.includes('today')) {
      return {
        bg: 'bg-rose-500/15 text-rose-300 border-rose-500/30 animate-pulse',
        icon: AlertCircle,
        dot: 'bg-rose-500',
      };
    }
    if (text.includes('tomorrow') || text.includes('1 day')) {
      return {
        bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        icon: Clock,
        dot: 'bg-amber-400',
      };
    }
    if (text.includes('passed') || text.includes('closed') || text.includes('expired')) {
      return {
        bg: 'bg-slate-700/60 text-slate-400 border-slate-600/40 line-through',
        icon: CheckCircle2,
        dot: 'bg-slate-500',
      };
    }
    if (text.includes('unavailable') || text.includes('not specified') || text.includes('unknown')) {
      return {
        bg: 'bg-slate-800/80 text-slate-400 border-slate-700/60',
        icon: CalendarOff,
        dot: 'bg-slate-500',
      };
    }
    if (text.includes('day') && (text.includes('2') || text.includes('3') || text.includes('4') || text.includes('5'))) {
      return {
        bg: 'bg-orange-500/10 text-orange-300 border-orange-500/25',
        icon: Clock,
        dot: 'bg-orange-400',
      };
    }
    // Default / comfortable deadline
    return {
      bg: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
      icon: Clock,
      dot: 'bg-sky-400',
    };
  };

  const config = getStatusConfig(deadlineStatus);
  const Icon = config.icon;

  const sizeClasses = size === 'large'
    ? 'px-3 py-1 text-sm font-medium'
    : 'px-2.5 py-0.5 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border ${config.bg} ${sizeClasses}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{deadlineStatus}</span>
    </span>
  );
}
