import { Button, ButtonProps } from 'antd';
import React from 'react';
import styles from './BtnIcon.module.scss';

export default function BtnIcon(props: React.PropsWithChildren<ButtonProps>): JSX.Element {

  const { icon, children, ...buttonProps } = props;

  return (
    <Button {...buttonProps}>
      <div className={styles.Btn}>
        {icon}
        {children ? <span>{children}</span> : null}
      </div>
    </Button>
  );
}
