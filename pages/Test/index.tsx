import React from 'react';
import { InputNumber, Tag } from 'antd';
import styles from './Test.module.scss';

export default function Test(): JSX.Element {

  const [somaFinal, setSomaFinal] = React.useState<number>();

  const Topics = (): JSX.Element => {
    const digits = [2, 3, 4];

    return (
      <>
        {!somaFinal ? <></> : digits.map(d => {
          const operandsList = getOperands(somaFinal, d);
          return (
            <div className={styles.Main_Topic} key={d}>
              <span className={styles.Main_Topic_Header}>{d} dígitos</span>
              <div className={styles.Main_Topic_Operands}>
                {operandsList.map(operands => {
                  const key = operands.join('');
                  const Operands = (): JSX.Element => <>{joinArray(operands, '+').map(operand => <Tag key={key + operand}>{operand}</Tag>)}</>;
                  return <div key={key} className={styles.Main_Topic_Operands_Operand}><Operands /></div>;
                })}

              </div>
            </div>
          );
        })}
      </>
    );
  };


  return (
    <div className={styles.Main}>
      <div className={styles.Main_Header}>
        <InputNumber
          value={somaFinal}
          onChange={e => setSomaFinal(e || undefined)}
          min={2}
          max={99}
          placeholder='Soma final...'
          style={{ width: 120 }} />
      </div>

      <Topics />
    </div>
  );
}

type TOperands = [number] | [number, number] | [number, number, number] | [number, number, number, number]

function getOperands(numTotal: number, digits: number): TOperands[] {
  if (digits <= 0 || digits >= 5 || numTotal <= 1) return [];
  if (digits === 1) return numTotal < 10 ? [[numTotal]] : [];

  const length = numTotal - 1 >= 9 ? 9 : numTotal - 1;

  const arrNumbers = Array.from({ length }, (_, i) => i + 1);

  const result: TOperands[] = [];

  if (digits === 2) {
    arrNumbers.forEach(nA => {
      arrNumbers.forEach(nB => {
        if (nA + nB === numTotal) result.push([nA, nB]);
      });
    });
  } else if (digits === 3) {
    arrNumbers.forEach(nA => {
      arrNumbers.forEach(nB => {
        arrNumbers.forEach(nC => {
          if (nA + nB + nC === numTotal) result.push([nA, nB, nC]);
        });
      });
    });
  } else if (digits === 4) {
    arrNumbers.forEach(nA => {
      arrNumbers.forEach(nB => {
        arrNumbers.forEach(nC => {
          arrNumbers.forEach(nD => {
            if (nA + nB + nC + nD === numTotal) result.push([nA, nB, nC, nD]);
          });
        });
      });
    });
  }

  return result;
}

function joinArray<T>(arr: T[], separator: string): (string | T)[] {
  return arr.map((item, index) => index < arr.length - 1 ? [item, separator] : [item]).flat();
}