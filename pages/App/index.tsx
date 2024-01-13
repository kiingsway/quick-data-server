import React from 'react';
import '@/app/i18n';
import { Breadcrumb, Dropdown, Layout } from 'antd';
import { CA, BR, FR, JP, ES } from 'country-flag-icons/react/3x2';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from 'i18next';
import { DateTime } from 'luxon';
import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb';
import styles from './App.module.scss';
import { TbWorld } from "react-icons/tb";
import Lists from './Lists';
import BtnIcon from '../components/BtnIcon';
import listsData from '@/server/lists.json';
import List from './List';
const { Header, Content, Footer } = Layout;

export const AppContext = React.createContext<IAppContext | undefined>(undefined);

export default function App(): JSX.Element {

  const { t, i18n } = useTranslation();

  const defaultSiteMap: string[] = [t('ListsWord')];
  const [siteMap, setSiteMap] = React.useState<string[]>(defaultSiteMap);
  const [lists, setLists] = React.useState<IList[]>(listsData);
  const setList = (list?: string): void => list ? setSiteMap([...defaultSiteMap, list]) : setSiteMap(defaultSiteMap);

  React.useEffect(() => {
    setSiteMap(prev => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, ...rest] = prev;
      return [t('ListsWord'), ...rest];
    });
  }, [t]);


  const updateLists = (newLists?: IList[]): void => setLists(newLists || listsData);

  const breadcrumbs: BreadcrumbItemType[] = siteMap.map((title, index, arr) => {
    const isButton = !index && arr.length > 1;
    const onClick = (): void => isButton ? setList() : undefined;
    const className = isButton ? styles.App_Breadcrumb_Lists : undefined;
    return { title, onClick, className };
  });

  const languageItems = [
    {
      key: 'en',
      icon: <CA width={16} />,
      label: "English",
      onClick: () => changeLanguage('en'),
    },
    {
      key: 'br',
      icon: <BR width={16} />,
      label: "Português (Brasileiro)",
      onClick: () => changeLanguage('br'),
    },
    {
      key: 'fr',
      icon: <FR width={16} />,
      label: "Français",
      onClick: () => changeLanguage('fr'),
    },
    {
      key: 'es',
      icon: <ES width={16} />,
      label: "Español",
      onClick: () => changeLanguage('es'),
    },
    {
      key: 'jp',
      icon: <JP width={16} />,
      label: "日本語",
      onClick: () => changeLanguage('jp'),
    },
  ];

  const selectedLanguageItem = languageItems.find(l => l?.key === i18n.language);


  const AppContent = (): JSX.Element => {
    const selectedList = lists.find(l => l.Name === siteMap?.[1]);

    if (selectedList) return <List list={selectedList} />;
    return <Lists lists={lists} setList={setList} />;
  };

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="demo-logo" />
        <Dropdown menu={{ items: languageItems }} placement="bottomLeft" arrow>
          <BtnIcon type='text' icon={<TbWorld />} style={{ opacity: 0.6 }}>{selectedLanguageItem?.label}</BtnIcon>
        </Dropdown>
      </Header>
      <Content style={{ padding: '0 48px' }}>
        <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbs} />
        <AppContext.Provider value={{ lists, setList, updateLists }}>
          <div className={styles.App}>
            <AppContent />
          </div>
        </AppContext.Provider>
      </Content>
      <Footer style={{ textAlign: 'center' }}>{t('About', { year: DateTime.now().toFormat('yyyy') })}</Footer>
    </Layout>
  );
}