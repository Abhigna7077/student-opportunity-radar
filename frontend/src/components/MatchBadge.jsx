import React from 'react';
import { Sparkles, Zap, Flame } from 'lucide-react';

export default function MatchBadge({ matchPercentage, size = 'default' }) {
  const getBadgeStyle = (score) => {
    if (score >= 90) {
      return {
        bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
        dot: 'bg-emerald-400',
        label: 'Super Match',
        icon: Sparkles,
      };
    }
    if (score >= 80) {
      return {
        bg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
        dot: 'bg-cyan-400',
        label: 'Great Match',
        icon: Zap,
      };
    }
    if (score >= 70) {
      return {
        bg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
        dot: 'bg-indigo-400',
        label: 'Good Match',
        icon: Flame,
      };
    }
    return {
      bg: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
      dot: 'bg-slate-400',
      label: 'Potential Match',
      icon: Zap,
    };
  };

  const style = getBadgeStyle(matchPercentage);
  const Icon = style.icon;

  const sizeClasses = size === 'large' 
    ? 'px-3.5 py-1.5 text-sm font-semibold' 
    : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border backdrop-blur-sm shadow-xs ${style.bg} ${sizeClasses}`}
      title={`${style.label}: ${matchPercentage}% match based on your profile & skills`}
    >
      <Icon className={size === 'large' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span>{matchPercentage}% Match</span>
    </span>
  );
}
