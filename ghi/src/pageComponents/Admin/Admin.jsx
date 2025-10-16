/* eslint-disable react/prop-types */
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Typography,
  Avatar,
  Badge,
  Button,
  Layout,
  Breadcrumb
} from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  HeartOutlined,
  BookOutlined,
  QuestionCircleOutlined,
  DashboardOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import Users from './admin-content/AdminUsers';
import AdminEvents from './admin-content/AdminEvents';
import AdminPrayers from './admin-content/AdminPrayers';
import StudyForm from './admin-content/AddStudy';
import Questions from './admin-content/AdminQuestions';
import './admin.css';

const { Title, Text } = Typography;
const { Header, Content } = Layout;

const Admin = ({ user, setUser }) => {
  const location = useLocation();

  const dashboardCards = [
    {
      title: 'Manage Users',
      description: 'View and manage user accounts',
      icon: <UserOutlined />,
      color: '#1890ff',
      path: '/admin/admin-users',
      count: '1,234'
    },
    {
      title: 'Manage Events',
      description: 'Create and manage ministry events',
      icon: <CalendarOutlined />,
      color: '#52c41a',
      path: '/admin/admin-events',
      count: '23'
    },
    {
      title: 'Manage Prayers',
      description: 'Oversee prayer requests and responses',
      icon: <HeartOutlined />,
      color: '#fa541c',
      path: '/admin/admin-prayers',
      count: '156'
    },
    {
      title: 'Manage Studies',
      description: 'Add and organize Bible studies',
      icon: <BookOutlined />,
      color: '#722ed1',
      path: '/admin/admin-studies',
      count: '89'
    },
    {
      title: 'Manage Q&A',
      description: 'Handle questions and answers',
      icon: <QuestionCircleOutlined />,
      color: '#eb2f96',
      path: '/admin/admin-q-and-a',
      count: '67'
    }
  ];

  const isOnDashboard = location.pathname === '/admin' || location.pathname === '/admin/';

  return (
    <Layout className='admin-dashboard'>
      <Header className='dashboard-header'>
        <div className='header-content'>
          <div className='logo-section'>
            <DashboardOutlined className='dashboard-icon' />
            <Title level={3} className='dashboard-title'>Admin Dashboard</Title>
          </div>
          <div className='user-section'>
            <Text className='welcome-text'>Welcome back, {user?.username || 'Admin'}</Text>
            <Avatar
              size="large"
              icon={<UserOutlined />}
              className='user-avatar'
            />
            <Button
              type="text"
              icon={<LogoutOutlined />}
              className='logout-btn'
            >
              <Link to="/">Exit</Link>
            </Button>
          </div>
        </div>
      </Header>

      <Content className='dashboard-content'>
        {isOnDashboard ? (
          <div className='dashboard-overview'>
            <div className='dashboard-intro'>
              <Title level={2}>Ministry Management Dashboard</Title>
              <Text className='dashboard-description'>
                Manage all aspects of your ministry from this central dashboard
              </Text>
            </div>

            <Row gutter={[24, 24]} className='dashboard-cards'>
              {dashboardCards.map((card, index) => (
                <Col xs={24} sm={12} lg={8} xl={6} key={index}>
                  <Link to={card.path}>
                    <Card
                      className='dashboard-card'
                      hoverable
                      style={{ borderLeft: `4px solid ${card.color}` }}
                    >
                      <div className='card-header'>
                        <div className='card-icon' style={{ color: card.color }}>
                          {card.icon}
                        </div>
                        <Badge count={card.count} className='card-badge' />
                      </div>
                      <Title level={4} className='card-title'>{card.title}</Title>
                      <Text className='card-description'>{card.description}</Text>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>

            <Row gutter={[24, 24]} className='dashboard-stats'>
              <Col span={24}>
                <Card className='stats-card'>
                  <Title level={4}>Quick Stats</Title>
                  <Row gutter={16}>
                    <Col span={6}>
                      <div className='stat-item'>
                        <Text className='stat-number'>1,234</Text>
                        <Text className='stat-label'>Total Users</Text>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div className='stat-item'>
                        <Text className='stat-number'>23</Text>
                        <Text className='stat-label'>Active Events</Text>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div className='stat-item'>
                        <Text className='stat-number'>156</Text>
                        <Text className='stat-label'>Prayer Requests</Text>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div className='stat-item'>
                        <Text className='stat-number'>89</Text>
                        <Text className='stat-label'>Bible Studies</Text>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </div>
        ) : (
          <div className='content-section'>
            <Breadcrumb className='content-breadcrumb'>
              <Breadcrumb.Item>
                <Link to="/admin">
                  <DashboardOutlined /> Dashboard
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                {location.pathname.split('/').pop().replace('admin-', '').replace('-', ' ')}
              </Breadcrumb.Item>
            </Breadcrumb>

            <div className='content-wrapper'>
              <Routes>
                <Route path="admin-users" element={<Users setUser={setUser} user={user}/>} />
                <Route path="admin-events" element={<AdminEvents setUser={setUser} user={user}/>} />
                <Route path="admin-prayers" element={<AdminPrayers user={user}/>} />
                <Route path="admin-studies" element={<StudyForm  />} />
                <Route path="admin-q-and-a" element={<Questions user={user} />} />
              </Routes>
            </div>
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default Admin;
