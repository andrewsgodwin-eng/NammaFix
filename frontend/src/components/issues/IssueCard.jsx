import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Users, Calendar, ArrowRight } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { formatDate } from '../../utils/formatters';

export const IssueCard = ({ issue, showDistance = false, distanceMeters }) => {
  const { t } = useTranslation();

  const categoryName = t(`categories.${issue.category}`, issue.category);

  return (
    <Card hoverable className="overflow-hidden flex flex-col justify-between bg-white border-[#E8E2D9] shadow-xs">
      <Link to={`/issue/${issue.complaintId || issue.id || issue._id}`} className="block group">
        {/* Card Header with Category & Status Badge */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-[11px] font-mono font-bold text-[#6B4A2E] tracking-wider">
            {issue.complaintId || issue.id || issue._id?.slice(-6) || 'INC'}
          </span>
          <Badge status={issue.status} size="sm" />
        </div>

        {/* Thumbnail & Description */}
        <div className="flex gap-3 sm:gap-4 mb-3">
          {issue.imageUrl && (
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#FBF9F6] flex-shrink-0 border border-[#E8E2D9]">
              <img
                src={issue.imageUrl}
                alt={categoryName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                loading="lazy"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-[#1A120E] text-sm sm:text-base group-hover:text-[#A88462] transition-colors leading-snug truncate">
              {issue.title || categoryName}
            </h4>
            <p className="text-xs text-[#6B4A2E] line-clamp-2 mt-1 leading-relaxed">
              {issue.description}
            </p>
          </div>
        </div>

        {/* Location & Address */}
        <div className="flex items-start gap-1.5 text-xs text-[#1A120E] mb-3 bg-[#FBF9F6] p-2.5 rounded-xl border border-[#E8E2D9]">
          <MapPin className="w-3.5 h-3.5 text-[#A88462] flex-shrink-0 mt-0.5" />
          <span className="truncate flex-1 font-medium">{issue.address}</span>
          {(showDistance || distanceMeters != null) && (
            <span className="text-[#1A120E] font-mono font-bold bg-[#A88462]/15 border border-[#A88462]/30 px-1.5 py-0.5 rounded text-[10px]">
              {distanceMeters != null ? `${distanceMeters < 1000 ? `${distanceMeters}m` : `${(distanceMeters/1000).toFixed(1)}km`}` : `${issue.distance} km`}
            </span>
          )}
        </div>
      </Link>

      {/* Card Footer */}
      <div className="pt-2.5 border-t border-[#E8E2D9] flex items-center justify-between text-[11px] text-[#6B4A2E]">
        <div className="flex items-center gap-1 font-medium">
          <Calendar className="w-3.5 h-3.5 text-[#A88462]" />
          <span>{formatDate(issue.createdAt || Date.now())}</span>
        </div>

        <div className="flex items-center gap-1 text-[#1A120E] font-medium">
          <Users className="w-3.5 h-3.5 text-[#A88462]" />
          <span>{issue.affectedCount || 1} confirmed</span>
        </div>
      </div>
    </Card>
  );
};
