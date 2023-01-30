import { FC, useState } from 'react';
import { Button, Calendar, Collapse, Layout } from 'antd';
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  Event,
} from 'react-big-calendar';
import withDragAndDrop, {
  withDragAndDropProps,
} from 'react-big-calendar/lib/addons/dragAndDrop';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import zhCN from 'date-fns/locale/zh-CN';
import addHours from 'date-fns/addHours';
import startOfHour from 'date-fns/startOfHour';

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CaretRightOutlined, DesktopOutlined } from '@ant-design/icons';
import './App.less';

const { Header, Content, Sider } = Layout;
const { Panel } = Collapse;

//@ts-ignore
const DnDCalendar = withDragAndDrop(BigCalendar);

const locales = {
  'zh-CN': zhCN,
};
const endOfHour = (date: Date): Date => addHours(startOfHour(date), 1);
const now = new Date();
const start = endOfHour(now);
const end = addHours(start, 2);
// The types here are `object`. Strongly consider making them better as removing `locales` caused a fatal error
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

let deferredPrompt: any = null;
// 判断用户是否安装此应用：beforeinstallprompt,如果用户已经安装过了,那么该事件不会再次触发
// 需要卸载，然后重新打开浏览器才能再次触发
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const pwa = document.querySelector('#pwsinstallql') as any;
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

const App: FC = () => {
  const [events, setEvents] = useState<Event[]>([
    {
      title: '测试事件',
      start,
      end,
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

  return (
    <Layout className="layout">
      <Header className="header">
        <div className="logo" />
        <Button
          title="点击安装桌面版"
          className="pwsinstall"
          icon={<DesktopOutlined />}
          onClick={() => addToDesktop()}
        ></Button>
      </Header>
      <Layout className="body">
        <Sider width={262}>
          <Button className="addevent" type="primary">
            Primary Button
          </Button>
          <Calendar
            fullscreen={false}
            headerRender={({ value, type, onChange, onTypeChange }) => {
              const year = value.year();
              const month = value.month();
              return (
                <div>
                  {year}年{month + 1}月
                </div>
              );
            }}
          />
          <Collapse
            bordered={false}
            defaultActiveKey={['1']}
            expandIcon={({ isActive }) => (
              <CaretRightOutlined rotate={isActive ? 90 : 0} />
            )}
          >
            <Panel header="This is panel header 1" key="1" style={panelStyle}>
              <p>{text}</p>
            </Panel>
            <Panel header="This is panel header 2" key="2" style={panelStyle}>
              <p>{text}</p>
            </Panel>
            <Panel header="This is panel header 3" key="3" style={panelStyle}>
              <p>{text}</p>
            </Panel>
          </Collapse>
        </Sider>
        <DnDCalendar
          className="calendar"
          defaultView="month"
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
