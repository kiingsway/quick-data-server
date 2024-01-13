import React from 'react';
import { Form, Input, Modal, ModalProps } from 'antd';
import styles from './NewList.module.scss';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../..';
import { Rule } from 'antd/lib/form';

interface Props {
  isNewListOpen: boolean;
  closeListForm: () => void;
  selectedList?: IList
}

export default function NewListModal({ closeListForm, isNewListOpen, selectedList }: Props): JSX.Element {


  const { lists, updateLists } = React.useContext(AppContext) as IAppContext;
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const isEdit = Boolean(selectedList);

  const modalProps: ModalProps = {
    title: !isEdit ? t('NewList') : t('EditListModalTitle', { listName: selectedList!.Name }),
    open: isNewListOpen,
    onOk: closeListForm,
    onCancel: closeListForm,
    okText: isEdit ? t('EditWord') : t('SaveWord'),
    cancelText: t('CancelWord'),
    okButtonProps: {
      onClick: saveList,
    }
  };

  async function saveList(): Promise<void> {
    await form.validateFields();
    const formData = form.getFieldsValue();
    const bodyList: IList = { Name: formData.Name, LastID: selectedList?.LastID || 0 };

    const newLists = lists;

    if (isEdit) {
      const listIndex = newLists.findIndex(l => l.Name === selectedList!.Name);
      newLists[listIndex] = bodyList;
    } else {
      newLists.push(bodyList);
    }
    updateLists(newLists);
    closeListForm();
  }

  const validateMinLength = (_: any, value: string): Promise<void> => {

    if (!value) Promise.resolve();

    const listAlreadyExists = lists.some(l => l.Name === value);
    if (listAlreadyExists) return Promise.reject(new Error(t('ListAlreadyExist')));

    const minimum = 5;
    if (value.length < minimum) return Promise.reject(new Error(t('MinCharField', { n: minimum })));

    return Promise.resolve();
  };

  const nameRules: Rule[] = [
    { required: true, message: t('RequiredFieldWord') },
    { validator: validateMinLength, },
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
