'use client';

import { useEffect, useRef, useState } from 'react';
import { Users, Award, Briefcase, Clock } from 'lucide-react';

interface Stats {
  projectsCompleted: number;
  yearsExperience: number;
  happyCustomers: number;
  teamMembers: number;
}

interface StatsSectionProps {
  stats?: Stats | null;
}

function CountUp({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = Date.now();
          const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easeOut * end));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return (
    <span ref={countRef}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export function StatsSection({ stats }: StatsSectionProps) {
  const defaultStats = {
    projectsCompleted: stats?.projectsCompleted || 500,
    yearsExperience: stats?.yearsExperience || 10,
    happyCustomers: stats?.happyCustomers || 350,
    teamMembers: stats?.teamMembers || 25,
  };

  const statItems = [
    {
      icon: Briefcase,
      value: defaultStats.projectsCompleted,
      suffix: '+',
      label: 'Projects Completed',
      color: 'text-solar-400',
    },
    {
      icon: Clock,
      value: defaultStats.yearsExperience,
      suffix: '+',
      label: 'Years Experience',
      color: 'text-accent-400',
    },
    {
      icon: Users,
      value: defaultStats.happyCustomers,
      suffix: '+',
      label: 'Happy Customers',
      color: 'text-yellow-400',
    },
    {
      icon: Award,
      value: defaultStats.teamMembers,
      suffix: '',
      label: 'Team Members',
      color: 'text-purple-400',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {statItems.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 mb-4 ${stat.color}`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                <CountUp end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-navy-300 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
