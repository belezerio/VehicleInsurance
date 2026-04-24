import { Chip } from '@mui/material';

interface Props {
  status: string;
}

const StatusBadge = ({ status }: Props) => {
  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'ProposalSubmitted':
      case 'Filed':
        return 'warning';
      case 'QuoteGenerated':
      case 'UnderReview':
        return 'info';
      case 'Active':
      case 'Approved':
      case 'Completed':
        return 'success';
      case 'Rejected':
        return 'error';
      case 'Expired':
      default:
        return 'default';
    }
  };

  return (
    <Chip
      label={status}
      color={getBadgeColor(status) as any}
      size="small"
      sx={{
        fontWeight: 600,
        borderRadius: '8px',
      }}
    />
  );
};

export default StatusBadge;