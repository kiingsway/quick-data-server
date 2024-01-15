import React from 'react';
import { Input, Divider, Col, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { RequesterProps } from '../interfaces';
import styles from '../Requests.module.scss';

export default function Requester(props: RequesterProps): JSX.Element {

  const { title, onClick, loading, disabled, params, bodyKeys, handleInputBodyChange, handleInputParamChange, form, body } = props;
  const { t } = useTranslation();

  const Params = (): JSX.Element => {
    if (!params || !params.length) return <></>;
    return (
      <div>
        {params.map(param => (
          <div className={styles.Requesters_Item_Container_Form} key={param}>
            <small>{param}:</small>
            <Input onChange={handleInputParamChange} name={param} value={form?.[param]} size='small' />
          </div>
        ))}
      </div>
    );
  };

  const Bodies = (): JSX.Element => {
    if (!bodyKeys || !bodyKeys.length) return <></>;
    return (
      <div>
        {bodyKeys.map(key => (
          <div className={styles.Requesters_Item_Container_Form} key={key}>
            <small>{key}:</small>
            <Input onChange={handleInputBodyChange} name={key} value={body?.[key]} size='small' />
          </div>
        ))}
      </div>
    );
  };

  const showDivider = Boolean(params?.length) && Boolean(bodyKeys?.length);
  const BodyDivider = (): JSX.Element => !showDivider ? <></> : <Divider>{t("BodyWord")}</Divider>;

  return (
    <Col span={24} sm={24 / 3} className={styles.Requesters_Item}>
      <div className={styles.Requesters_Item_Container}>

        <Params />
        <BodyDivider />
        <Bodies />

        <Button onClick={onClick} loading={loading} disabled={loading || disabled}>{title}</Button>
      </div>
    </Col>
  );
}