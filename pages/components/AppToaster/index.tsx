import React from 'react';
import { toast, Toaster, ToastBar } from 'react-hot-toast';
import { IoMdClose } from 'react-icons/io';
import BtnIcon from '../BtnIcon';

export default function AppToaster(): JSX.Element {
  return (
    <Toaster position="bottom-right">
      {(t) => {
        const onClick = (): void => toast.dismiss(t.id);
        return (
          <ToastBar toast={t} style={{ backgroundColor: '#333', color: 'white' }}>
            {({ icon, message }) => (
              <>
                {icon}
                {message}
                {t.type !== 'loading' && (
                  <BtnIcon type='text' icon={<IoMdClose />} onClick={onClick} size='small' />
                )}
              </>
            )}
          </ToastBar>
        );
      }}
    </Toaster>
  );
}