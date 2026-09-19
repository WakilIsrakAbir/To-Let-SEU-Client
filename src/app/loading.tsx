import React from 'react';
import LoadingState from '@/components/common/LoadingState';

export default function Loading() {
  return (
    <div className="flex-1 w-full min-h-[75vh] flex items-center justify-center">
      <LoadingState
        message="Loading SEU Bachelor To-Let..."
        fullscreen={false}
        showTips={true}
      />
    </div>
  );
}
