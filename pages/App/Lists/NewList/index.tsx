import React from 'react';
import { Form, Input, Modal, ModalProps } from 'antd';
import styles from './NewList.module.scss';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../..';
import { Rule } from 'antd/lib/form';
import { rawText } from '@/app/services/helpers';
import BtnIcon from '@/pages/components/BtnIcon';
import { create_list, delete_list, edit_list } from '@/app/services/requests';

interface Props {
  isNewListOpen: boolean;
  closeListForm: () => void;
  selectedList?: IList
}

export default function NewListModal({ closeListForm, isNewListOpen, selectedList }: Props): JSX.Element {

  const { lists, updateLists, handleAlerts } = React.useContext(AppContext) as IAppContext;
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const isEdit = Boolean(selectedList);

  function deleteList(): void {
    if (lists.length === 1 || !selectedList) return;
    const listName = selectedList.Name;
    const sure = confirm(t('AreYouSureDeleteList', { listName }));
    if (sure) {
      const th = (): void => { updateLists(); handleAlerts(t('ListDeleted', { listName })); };
      const ca = (e: any): void => handleAlerts(String(e), 'error');
      delete_list(listName).then(th).catch(ca);
    }
  }

  async function saveList(): Promise<void> {
    await form.validateFields();
    const formData = form.getFieldsValue();
    const listName = formData.Name;
    const ca = (e: any): void => handleAlerts(String(e), 'error');
    const fi = (): void => { updateLists(); closeListForm(); };
    if (!isEdit) {
      await create_list(listName)
        .then(() => handleAlerts(t('ListCreated', { listName })))
        .catch(ca).finally(fi);
    } else {
      await edit_list(selectedList!.Name, { Name: listName, LastID: 0 })
        .then(() => handleAlerts(t('ListEdited', { listName })))
        .catch(ca).finally(fi);
    }
  }

  const footer: JSX.Element[] = [
    isEdit ? <BtnIcon danger type='text' key='delete' onClick={deleteList} disabled={lists.length === 1}>{t('DeleteWord')}</BtnIcon> : <></>,
    <BtnIcon key='cancel' onClick={closeListForm}>{t('CancelWord')}</BtnIcon>,
    <BtnIcon type='primary' key='save' onClick={saveList}>{isEdit ? t('EditWord') : t('SaveWord')}</BtnIcon>,
  ];

  const modalProps: ModalProps = {
    title: !isEdit ? t('NewList') : t('EditListModalTitle', { listName: selectedList!.Name }),
    open: isNewListOpen,
    footer,
    onCancel: closeListForm,
  };

  const nameValidator = (_: any, listName: string): Promise<void> => {

    if (!listName) Promise.resolve();

    const rawListName = rawText(listName);

    const forbiddenListNames = ['lists'];
    if (forbiddenListNames.includes(rawListName)) return Promise.reject(new Error(t('ForbiddenListName')));

    const listAlreadyExists = lists.some(({ Name }) => rawText(Name) === rawListName);
    if (listAlreadyExists) return Promise.reject(new Error(t('ListAlreadyExist')));

    const minimum = 5;
    if (listName.length < minimum) return Promise.reject(new Error(t('MinCharField', { minimum })));

    return Promise.resolve();
  };

  const nameRules: Rule[] = [
    { required: true, message: t('RequiredFieldWord') },
    { validator: nameValidator, },
  ];

  const initialValues = !isEdit ? undefined : {
    Name: selectedList!.Name
  };

  return (
    <Modal {...modalProps}>
      {!isNewListOpen ? <></> : <Form form={form} className={styles.Main} initialValues={initialValues}>
        <Form.Item label={t('NewListLabel')} name="Name" rules={nameRules}>
          <Input placeholder={t('NewListPlaceholder')} />
        </Form.Item>
      </Form>}
    </Modal>
  );
}
