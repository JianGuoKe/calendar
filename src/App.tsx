import { FC, useState } from 'react';
import { Button, Calendar, Collapse, Dropdown, Layout, Space } from 'antd';
import {
  Calendar as BigCalendar,
  // dayjsLocalizer
  momentLocalizer,
  Event,
  View,
} from 'react-big-calendar';
import withDragAndDrop, {
  withDragAndDropProps,
} from 'react-big-calendar/lib/addons/dragAndDrop';

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import dayjs from 'dayjs';
dayjs.locale('zh-cn');
// const localizer = dayjsLocalizer(dayjs);

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const localizer = momentLocalizer(moment);

import {
  CaretRightOutlined,
  DesktopOutlined,
  LeftOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RightOutlined,
  SearchOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import './App.less';
import React from 'react';

const { Header, Content, Sider } = Layout;
const { Panel } = Collapse;

//@ts-ignore
const DnDCalendar = withDragAndDrop(BigCalendar);

let deferredPrompt: any = null;
// 判断用户是否安装此应用：beforeinstallprompt,如果用户已经安装过了,那么该事件不会再次触发
// 需要卸载，然后重新打开浏览器才能再次触发
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const pwa = document.querySelector('.pwsinstall') as any;
  if (pwa) {
    pwa.style.display = 'inline-block';
  }
});

// 安装完成后触发,即点击安装弹窗中的“安装”后被触发
window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
});

function addToDesktop() {
  // 调用prompt()方法触发安装弹窗
  deferredPrompt.prompt();
  deferredPrompt = null;
}

const now = dayjs();

const App: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(now);
  const [events, setEvents] = useState<Event[]>([
    {
      title: '测试事件',
      start: now.toDate(),
      end: now.add(2, 'hour').toDate(),
    },
  ]);

  const onEventResize: withDragAndDropProps['onEventResize'] = (data) => {
    const { start, end } = data;

    setEvents((currentEvents) => {
      const firstEvent = {
        start: new Date(start),
        end: new Date(end),
      };
      return [...currentEvents, firstEvent];
    });
  };

  const onEventDrop: withDragAndDropProps['onEventDrop'] = (data) => {
    console.log(data);
  };

  const panelStyle = {
    marginBottom: 24,
    border: 'none',
  };

  const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

  const menuViews = {
    items: [
      {
        label: '月',
        key: 'month',
      },
      {
        label: '周',
        key: 'week',
      },
      {
        label: '日',
        key: 'day',
      },
      {
        label: '议程',
        key: 'agenda',
      },
    ],
    onClick: (e: any) => {
      setView(e.key);
    },
  };

  return (
    <Layout className="layout">
      <Header className="header">
        <div className="title">
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            }
          )}
        </div>
        <div className="calendartitle">
          <Button>今天</Button>
          <Button type="text" icon={<LeftOutlined />}></Button>
          <Button type="text" icon={<RightOutlined />}></Button>
          <h3 className="daytitle">
            {date.year()}年{date.month() + 1}月
          </h3>
          <Button
            title="点击安装桌面版"
            className="pwsinstall"
            style={{ display: deferredPrompt ? 'inline-block' : 'none' }}
            type="text"
            icon={<DesktopOutlined />}
            onClick={() => addToDesktop()}
          ></Button>
          <Button type="text" icon={<SearchOutlined />}></Button>
          <Button type="text" icon={<SettingOutlined />}></Button>
          <Dropdown menu={menuViews}>
            <Button>
              <Space>{view}</Space>
            </Button>
          </Dropdown>
        </div>
      </Header>
      <Layout className="body">
        <Sider
          width={262}
          trigger={null}
          collapsedWidth={0}
          collapsible
          collapsed={collapsed}
        >
          <Button className="addevent" type="primary">
            添加事件
          </Button>
          <Calendar
            fullscreen={false}
            value={date}
            headerRender={({ value, type, onChange, onTypeChange }) => {
              const year = value.year();
              const month = value.month();
              return (
                <div className="datetitle">
                  {year}年{month + 1}月
                </div>
              );
            }}
          />
          <Collapse
            bordered={false}
            defaultActiveKey={['my']}
            expandIcon={({ isActive }) => (
              <CaretRightOutlined rotate={isActive ? 90 : 0} />
            )}
          >
            <Panel header="我的日历" key="my" style={panelStyle}>
              <p>{text}</p>
            </Panel>
          </Collapse>
        </Sider>
        <DnDCalendar
          className="calendar"
          defaultView="month"
          date={date.toDate()}
          view={view}
          events={events}
          localizer={localizer}
          toolbar={false}
          onEventDrop={onEventDrop}
          onEventResize={onEventResize}
          resizable
        />
      </Layout>
    </Layout>
  );
};

export default App;
