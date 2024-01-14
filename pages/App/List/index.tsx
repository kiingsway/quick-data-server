import { isISODate, objectAllKeys } from '@/app/services/helpers';
import { get_list_items } from '@/app/services/requests';
import { Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { DateTime } from 'luxon';
import React from 'react';
import { IoCheckmark } from "react-icons/io5";
import styles from './List.module.scss';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

interface Props {
  list: IList;
}

export default function Lists({ list }: Props): JSX.Element {

  const { t } = useTranslation();
  const [items, setItems] = React.useState<IAnyListItem[]>();

  function handleItems(): void {
    get_list_items(list.Name).then(setItems);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => handleItems(), []);

  const columns: ColumnsType<IAnyListItem> = objectAllKeys(items || []).map(key => {

    const render = (value?: TListItemValue): JSX.Element => (
      <div className={styles.List_ColData}>
        <Tooltip title={<TooltipRender value={value} t={t} />}>
          <span><ValueRender value={value} /></span>
        </Tooltip>
      </div>
    );

    return { dataIndex: key, title: key, render };
  });

  return (
    <Table
      columns={columns}
      dataSource={items?.map(i => ({ ...i, key: i.ID }))}
      size='small'
      scroll={{ y: 400 }}
      pagination={{
        simple: true,
        pageSize: 50
      }}
    />
  );
}

const ValueRender = ({ value }: { value: any }): JSX.Element => {
  if (Array.isArray(value)) return <>{value.join(', ')}</>;
  if (typeof value === 'string' && isISODate(value)) return <>{DateTime.fromISO(value).toFormat('dd/LL/yyyy HH:mm')}</>;
  if (typeof value === 'boolean' && value) return <IoCheckmark />;
  if (!value) return <></>;
  return <>{value}</>;
};

const TooltipRender = ({ value, t }: { value: any, t: TFunction<"translation", undefined> }): JSX.Element => {
  if (Array.isArray(value)) return <>{value.join(', ')}</>;
  if (typeof value === 'string' && isISODate(value)) return <>{DateTime.fromISO(value).toFormat('dd/LL/yyyy HH:mm:ss')}</>;
  if (typeof value === 'boolean') return <>{value ? t('YesWord') : t('NoWord')}</>;
  if (!value) return <>{t('EmptyWord')}</>;
  return <>{value}</>;
};