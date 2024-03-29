import React from 'react';
import '@/app/i18n';
import { Breadcrumb, Dropdown, Layout, Menu } from 'antd';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb';
import styles from './App.module.scss';
import { TbWorld } from "react-icons/tb";
import Lists from './Lists';
import BtnIcon from '../components/BtnIcon';
import List from './List';
import { get_lists } from '@/app/services/requests';
import { toast } from 'react-hot-toast';
import AppToaster from '../components/AppToaster';
import { ItemType, MenuItemType } from 'antd/es/menu/hooks/useItems';
const { Header, Content, Footer } = Layout;
import { LuLayoutDashboard } from "react-icons/lu";
import { TbCloudDataConnection } from "react-icons/tb";
import { BiTestTube } from "react-icons/bi";
import Requests from '../Requests';
import languages from '@/app/languages';
import Test from '../Test';

export const AppContext = React.createContext<IAppContext | undefined>(undefined);

type TTab = 'dashboard' | 'requests' | 'test';

export default function App(): JSX.Element {

  const { t, i18n } = useTranslation();

  const listsData: IList[] = [];

  const defaultSiteMap: string[] = [t('ListsWord')];
  const [siteMap, setSiteMap] = React.useState<string[]>(defaultSiteMap);
  const [tab, setTab] = React.useState<TTab>('dashboard');
  const [lists, setLists] = React.useState<IList[]>(listsData);
  const setList = (list?: string): void => list ? setSiteMap([...defaultSiteMap, list]) : setSiteMap(defaultSiteMap);

  function updateLists(): void {
    get_lists()
      .then(setLists)
      .catch(e => handleAlerts(String(e), 'error'));
  }

  React.useEffect(updateLists, []);

  React.useEffect(() => {
    setSiteMap(prev => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, ...rest] = prev;
      return [t('ListsWord'), ...rest];
    });
  }, [t]);

  const breadcrumbs: BreadcrumbItemType[] = tab === 'requests' ?
    [{ title: t('RequestsWord') }]
    :
    siteMap.map((title, index, arr) => {
      const isButton = !index && arr.length > 1;
      const onClick = (): void => isButton ? setList() : undefined;
      const className = isButton ? styles.App_Breadcrumb_Lists : undefined;
      return { title, onClick, className };
    });

  function handleAlerts(message: string, type: 'success' | 'error' = 'success'): void {
    if (type === 'success') toast.success(message, { duration: 5000 });
    else if (type === 'error') toast.error(message, { duration: 15000 });
  }

  const selectedLanguageItem = languages.find(l => l?.key === i18n.language);

  const AppContent = (): JSX.Element => {
    const selectedList = lists.find(l => l.Name === siteMap?.[1]);

    if (tab === 'test') return <Test />;
    if (tab === 'requests') return <Requests />;
    if (selectedList) return <List list={selectedList} />;
    return <Lists lists={lists} setList={setList} />;
  };

  const items: ItemType<MenuItemType>[] = [
    { key: 'dashboard', label: 'Dashboard', icon: <LuLayoutDashboard /> },
    { key: 'requests', label: t('RequestsWord'), icon: <TbCloudDataConnection /> },
    { key: 'test', label: 'Test', icon: <BiTestTube /> },
  ];

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          items={items}
          selectedKeys={[tab]}
          onClick={(e) => setTab(e.key as TTab)}
          style={{ flex: 1, minWidth: 0 }}
        />
        <Dropdown menu={{ items: languages }} placement="bottomLeft" arrow>
          <BtnIcon type='text' icon={<TbWorld />} style={{ opacity: 0.6 }}>{selectedLanguageItem?.label}</BtnIcon>
        </Dropdown>
      </Header>
      <Content style={{ padding: '0 48px' }}>
        <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbs} />
        <AppContext.Provider value={{ lists, setList, updateLists, handleAlerts }}>
          <div className={styles.App}>
            <AppToaster />
            <AppContent />
          </div>
        </AppContext.Provider>
      </Content>
      <Footer style={{ textAlign: 'center' }}>{t('About', { year: DateTime.now().toFormat('yyyy') })}</Footer>
    </Layout>
  );
}