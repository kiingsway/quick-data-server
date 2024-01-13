import React from 'react';

interface Props {
  list: IList;
}

export default function Lists({ list }: Props): JSX.Element {
  return (
    <div>
      {list.Name}
    </div>
  );
}