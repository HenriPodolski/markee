import React, { FunctionComponent, useMemo, useState } from 'react';
import styles from './Preview.module.scss';
/* eslint import/no-webpack-loader-syntax: off */
import rootStyles from '!!raw-loader!./PreviewRoot.module.css';
import cx from 'classnames';
import { useRecoilValue } from 'recoil';
import { openFileState } from '../../store/openFile/openFile.atoms';
import root from 'react-shadow';
import MarkdownIt from 'markdown-it';

const md2html = new MarkdownIt();

export type Props = {
  className: string;
  id?: string;
};

const Preview: FunctionComponent<Props> = ({ id, className }: Props) => {
  const openFile = useRecoilValue(openFileState);
  const [convertedDoc, setConvertedDoc] = useState('');

  useMemo(() => {
    if (openFile?.content) {
      const renderedMarkup = md2html.render(openFile.content);
      setConvertedDoc(renderedMarkup);
    }
  }, [openFile?.content]);

  return (
    <root.div id={id} className={cx(styles.Preview, className)}>
      <div
        className="PreviewInner"
        dangerouslySetInnerHTML={{ __html: convertedDoc }}
      />
      <style>{rootStyles}</style>
    </root.div>
  );
};

export default Preview;
