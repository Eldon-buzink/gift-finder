import { use } from 'react';

type Params = {
  view_link_id: string;
};

export default function Page({ params }: { params: Promise<Params> }) {
  const { view_link_id } = use(params);

  return (
    <div>
      <h1>Gift Reply</h1>
      <p>View link ID: {view_link_id}</p>
    </div>
  );
} 