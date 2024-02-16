import React from 'react';
import styles from './Requests.module.scss';
import { Row } from 'antd';
import Editor from '@monaco-editor/react';
import { create_list, edit_list, get_list, get_list_items, get_lists, site } from '@/app/services/requests';
import useBoolean from '@/app/services/useBoolean';
import { TbCloudCheck, TbCloudOff } from "react-icons/tb";
import { IREST, EmptyObj, TRestParameters, RequesterProps } from './interfaces';
import Requester from './Requester';

export default function Requests(): JSX.Element {

  const [code, setCode] = React.useState('{ "Clique em uma": "requisição para começar!" }');
  const [rest, setRest] = React.useState<IREST>();
  const [form, setForm] = React.useState<Record<string, string | undefined> | EmptyObj>({});
  const [body, setBody] = React.useState<Record<string, string | undefined> | EmptyObj>({});
  const [loading, { setTrue: startLoad, setFalse: stopLoad }] = useBoolean();

  const updateStatusCode = (statusCode?: number): void => setRest(prev => !prev ? undefined : ({ ...prev, statusCode }));
  const error = (error: any): void => { setCode(JSON.stringify(error.response.data, null, 2)); updateStatusCode(error?.response?.status || 400); };
  const success = (newCode: any): void => { setCode(JSON.stringify(newCode, null, 2)); updateStatusCode(200); };

  function getLists(): void {
    startLoad();
    setRest({ uri: `${site}/lists`, method: 'GET', statusCode: undefined });
    get_lists().then(success).catch(error).finally(stopLoad);
  }

  function getList(): void {
    if (!form.list_name) return;
    startLoad();
    setRest({ uri: `${site}/lists/${form.list_name}`, method: 'GET', statusCode: undefined });
    get_list(form.list_name).then(success).catch(error).finally(stopLoad);
  }

  function getListItems(): void {
    if (!form.list_name) return;
    startLoad();
    setRest({ uri: `${site}/lists/${form.list_name}/items`, method: 'GET', statusCode: undefined });
    get_list_items(form.list_name).then(success).catch(error).finally(stopLoad);
  }

  function createList(): void {
    if (!body.Name) return;
    startLoad();
    setRest({ uri: `${site}/lists`, method: 'POST', statusCode: undefined });
    create_list(body.Name).then(success).catch(error).finally(stopLoad);
  }

  function editList(): void {
    if (!body.Name || !form.list_name) return;
    startLoad();
    setRest({ uri: `${site}/lists`, method: 'POST', statusCode: undefined });
    edit_list(form.list_name, { Name: body.Name, LastID: 0 }).then(success).catch(error).finally(stopLoad);
  }

  function handleInputParamChange(e: any): void {
    const key = e.target.name as TRestParameters;
    const value = e.target.value;
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function handleInputBodyChange(e: any): void {
    const key = e.target.name as TRestParameters;
    const value = e.target.value;
    setBody(prev => ({ ...prev, [key]: value }));
  }

  const listNameParam = 'list_name';
  // const itemIdParam = 'item_id';

  const requesters: (RequesterProps & { key: React.Key })[] = [
    { key: 'getLists', title: 'Obter listas', onClick: getLists },
    { key: 'getList', title: 'Obter lista', onClick: getList, disabled: !form.list_name, params: [listNameParam], handleInputParamChange, form },
    { key: 'createList', title: 'Criar lista', onClick: createList, disabled: !body.Name, bodyKeys: ['Name'], handleInputBodyChange, body },
    { key: 'editList', title: 'Editar lista', onClick: editList, disabled: !form.list_name || !body.Name, params: [listNameParam], handleInputParamChange, form, bodyKeys: ['Name'], handleInputBodyChange, body },
    { key: 'getListItems', title: 'Obter itens de lista', onClick: getListItems, disabled: !form.list_name, params: [listNameParam], handleInputParamChange, form }
  ];

  return (
    <div>
      <Row className={styles.Requesters} gutter={[16, 24]}>
        {requesters.map(r => <Requester {...r} key={r.key} loading={loading} />)}
      </Row>
      <Row className={styles.Requesters} gutter={[16, 24]}>
        <div className={styles.Requesters_StatusBar}>
          <div className={styles.Requesters_StatusBar_Status} style={{ visibility: rest ? 'visible' : 'hidden' }}>
            {rest?.statusCode && rest.statusCode < 300 ? <TbCloudCheck /> : <TbCloudOff />}
            <span>{rest?.statusCode}</span>
            <span>{rest?.method}</span>
            <span>{rest?.uri}</span>
          </div>
        </div>
      </Row>
      <Row>
        <Editor
          height={300}
          defaultLanguage="json"
          value={code}
          options={{
            minimap: { enabled: false },
            wordWrap: 'on'
          }}
          theme="vs-dark" />
      </Row>
    </div>
  );
}