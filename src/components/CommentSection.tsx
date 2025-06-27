import { useState } from 'react';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

export default function CommentSection({ context }: { context: { project: string; device: string; pageName: string; pagePath: string; filename: string; } }) {
  const [refreshFlag, setRefreshFlag] = useState(false);

  const triggerRefresh = () => {
    setRefreshFlag(prev => !prev);
  };

  return (
    <div>
      <CommentForm context={context} onSuccess={triggerRefresh} />
      <CommentList project={context.project} device={context.device} refreshFlag={refreshFlag} />
    </div>
  );
}
