import { Star, CheckCircle, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Mentor } from '@/data/types';

interface MentorCardProps {
  mentor: Mentor;
  index?: number;
  isVisible?: boolean;
}

const MentorCard = ({ mentor, index = 0, isVisible = true }: MentorCardProps) => {
  const initials = mentor.name.split(' ').map(n => n[0]).join('');

  return (
    <Link
      to={`/mentor/${mentor.id}`}
      className={`group block bg-card rounded-xl border overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 active:scale-[0.98] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
      style={{ transitionDelay: isVisible ? `${index * 100}ms` : '0ms' }}
    >
      {/* Header */}
      <div className="relative p-5 pb-3">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="text-base font-semibold truncate">{mentor.name}</h4>
              {mentor.isVerified && (
                <CheckCircle className="h-4 w-4 text-accent shrink-0" />
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">{mentor.title}</p>
          </div>
        </div>

        {mentor.isAvailableNow && (
          <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-medium">
            <Zap className="h-3 w-3" />
            Available Now
          </div>
        )}
      </div>

      {/* Skills */}
      <div className="px-5 pb-3">
        <div className="flex flex-wrap gap-1.5">
          {mentor.expertise.slice(0, 3).map(skill => (
            <span key={skill} className="px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3.5 border-t bg-secondary/30 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-semibold tabular-nums">{mentor.rating}</span>
          <span className="text-xs text-muted-foreground">({mentor.reviewCount})</span>
        </div>
        <div className="text-right">
          <span className="text-base font-bold">₹{mentor.hourlyRate.toLocaleString('en-IN')}</span>
          <span className="text-xs text-muted-foreground">/hr</span>
        </div>
      </div>
    </Link>
  );
};

export default MentorCard;
