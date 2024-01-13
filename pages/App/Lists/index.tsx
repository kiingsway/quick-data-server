import { ColumnsType } from 'antd/es/table';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Table, Tooltip } from 'antd';
import styles from './Lists.module.scss';
import { rawText } from '@/app/services/helpers';
import BtnIcon from '@/pages/components/BtnIcon';
import { BiBookAdd } from "react-icons/bi";
import useBoolean from '@/app/services/useBoolean';
import NewListModal from './NewList';
import { FiEdit3 } from "react-icons/fi";

interface Props {
  lists: IList[];
  setList: (list?: string) => void;
}

export default function Lists({ lists, setList }: Props): JSX.Element {

  const { t } = useTranslation();
  const [search, setSearch] = React.useState('');
  const [isNewListOpen, { setTrue: openNewList, setFalse: closeNewList }] = useBoolean();
  const [selectedList, selectList] = React.useState<IList>();

  function closeListForm(): void {
    selectList(undefined);
    closeNewList();
  }

  const NameColumn = ({ name }: { name?: string }): JSX.Element => {
    const list = lists.find(l => l.Name === name);
    const editOnClick = (): void => { selectList(list); openNewList(); };
    const nameOnClick = (): void => setList(name);
    return (
      <>
        <Tooltip title={t('EditList')}>
          <BtnIcon type='text' onClick={editOnClick} icon={<FiEdit3 fontSize={15} />} />
        </Tooltip>
        <BtnIcon type='text' onClick={nameOnClick}>{name}</BtnIcon>
      </>
    );
  };

  const columns: ColumnsType<IList> = [
    {
      dataIndex: 'Name', title: t('NameWord'),
      render: name => <NameColumn name={name} />
    },
    { dataIndex: 'LastID', title: t('LastIDWord') },
  ];

  const filteredLists = !search ? lists : lists.filter(l => rawText(l.Name).includes(rawText(search)));

  return (
    <div className={styles.Lists}>
      {!isNewListOpen ? <></> : <NewListModal closeListForm={closeListForm} isNewListOpen={isNewListOpen} selectedList={selectedList} />}
      <div className={styles.Lists_Toolbar}>
        <BtnIcon icon={<BiBookAdd />} type='primary' onClick={openNewList}>{t('NewList')}</BtnIcon>
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('SearchListWord', { rest: '...' })} />
      </div>
      <Table
        dataSource={filteredLists.map(l => ({ ...l, key: l.Name }))}
        columns={columns}
        pagination={{
          simple: true
        }}
      />
    </div>
  );
}