import { Card, Space, Statistic } from "antd";
import { Link } from "react-router-dom";

interface CardProps {
  value: number | undefined;
  link: string;
  backgroundCard: string;
  title: string;
  icon: React.ReactNode;
}

const TotalCard: React.FC<CardProps> = ({
  value,
  link,
  backgroundCard,
  title,
  icon,
}) => {
  return (
    <>
      <Space direction="horizontal">
        <Link to={`/${link}`}>
          <Card hoverable style={{ width: 400, background: backgroundCard }}>
            <Space direction="horizontal" className="card-total">
              {icon}
              <Statistic className="total-detail" title={title} value={value} />
            </Space>
          </Card>
        </Link>
      </Space>
    </>
  );
};

export default TotalCard;
