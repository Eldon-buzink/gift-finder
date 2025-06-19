import ViewReplyClient from './ViewReplyClient';

type Props = {
  params: {
    view_link_id: string;
  };
};

export default function ViewReplyPage({ params }: Props) {
  return <ViewReplyClient view_link_id={params.view_link_id} />;
} 