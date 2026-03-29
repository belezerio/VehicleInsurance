interface Props {
  status: string;
}

const StatusBadge = ({ status }: Props) => {
  const colors: Record<string, string> = {
    ProposalSubmitted: 'bg-yellow-100 text-yellow-800',
    QuoteGenerated: 'bg-blue-100 text-blue-800',
    Active: 'bg-green-100 text-green-800',
    Expired: 'bg-gray-100 text-gray-800',
    Rejected: 'bg-red-100 text-red-800',
    Filed: 'bg-yellow-100 text-yellow-800',
    UnderReview: 'bg-blue-100 text-blue-800',
    Approved: 'bg-green-100 text-green-800',
    Completed: 'bg-green-100 text-green-800',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

export default StatusBadge;