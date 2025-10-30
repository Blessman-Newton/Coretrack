import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Dispatch } from '../../types';
import { getDaysOut } from '../../utils/helpers';

interface NotificationsProps {
  dispatches: Dispatch[];
  onClose: () => void;
  onNotificationClick: (projectId: string, drillholeId: string, dispatchId: number) => void;
}

export const Notifications: React.FC<NotificationsProps> = ({ dispatches, onClose, onNotificationClick }) => {
  // Filter dispatches that are outstanding for more than 10 days
  const overdueDispatches = dispatches.filter(d => {
    if (d.status !== 'outstanding') return false;
    const daysOut = getDaysOut(d.dispatchDate);
    return daysOut > 10;
  });

  if (overdueDispatches.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-40 max-w-md animate-slide-in">
      <div className="bg-red-50 border-2 border-red-500 rounded-lg shadow-xl p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <h3 className="font-bold text-red-900">Overdue Dispatches Alert</h3>
          </div>
          <button
            onClick={onClose}
            className="text-red-600 hover:text-red-800 transition-colors"
            aria-label="Close notification"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-sm text-red-800 mb-3">
          {overdueDispatches.length} {overdueDispatches.length === 1 ? 'dispatch has' : 'dispatches have'} been outstanding for more than 10 days (click to view):
        </p>
        
        <div className="max-h-60 overflow-y-auto space-y-2">
          {overdueDispatches.slice(0, 5).map(dispatch => {
            const daysOut = getDaysOut(dispatch.dispatchDate);
            return (
              <button
                key={dispatch.id}
                onClick={() => {
                  onNotificationClick(dispatch.projectId, dispatch.drillholeId, dispatch.id);
                  onClose();
                }}
                className="w-full bg-white border border-red-300 rounded p-2 text-sm hover:bg-red-50 hover:border-red-400 transition-colors cursor-pointer text-left"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-slate-800">
                      {dispatch.projectId} / {dispatch.drillholeId}
                    </p>
                    <p className="text-slate-600 text-xs">{dispatch.company}</p>
                  </div>
                  <span className="text-red-700 font-bold text-sm">
                    {daysOut} days
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        
        {overdueDispatches.length > 5 && (
          <p className="text-xs text-red-700 mt-2 text-center">
            ...and {overdueDispatches.length - 5} more
          </p>
        )}
      </div>
    </div>
  );
};
