import React, { FunctionComponent } from 'react';
import styles from '../editor/Editor.module.scss';
import { useTranslation } from 'react-i18next';

export type Props = {
  date: Date;
};

const DateOutput: FunctionComponent<Props> = ({ date }) => {
  const { t } = useTranslation('common');
  return (
    <>
      {date && (
        <time
          className={styles.DateOutput}
          dateTime={date.toLocaleTimeString()}
        >
          {date instanceof Date &&
          (date as Date).getDate() === new Date().getDate() ? (
            <>{t('date-relative-time-output', { val: 0 })}</>
          ) : (
            <>
              {t('date-time-output', {
                val: date,
                formatParams: {
                  val: {
                    year: '2-digit',
                    month: 'numeric',
                    day: 'numeric',
                  },
                },
              })}
            </>
          )}
          {', '}
          {t('date-time-output', {
            val: date,
            formatParams: {
              val: {
                hour: 'numeric',
                minute: 'numeric',
              },
            },
          }).toLowerCase()}
        </time>
      )}
    </>
  );
};

export default DateOutput;
