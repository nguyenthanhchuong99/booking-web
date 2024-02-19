import { Button } from 'antd';

interface FooterBooking {
  onDelete: (id: number) => Promise<void>;
  onCancel: () => void;
  id: number;
}

const FooterBooking: React.FC<FooterBooking> = ({ onDelete, onCancel, id }) => {
  return (
    <>
      <Button key='cancel' onClick={onCancel}>
        Cancel
      </Button>
      <Button key='delete' type='primary' danger onClick={() => onDelete(id)}>
        Delete
      </Button>
    </>
  );
};
export default FooterBooking;
