const centerClassName = 'ql-align-center';
const rightClassName = 'ql-align-right';
const justifyClassName = 'ql-align-justify';

const textLayoutFilter = (node: HTMLElement) => {
  return (
    node.nodeName === 'P' &&
    (node.classList.contains(centerClassName) ||
      node.classList.contains('ql-align-right') ||
      node.classList.contains('ql-align-justify'))
  );
};

const rules = {
  center: 'text-align: center',
  right: 'text-align: right',
  justify: 'text-align: justify; text-justify: inter-word;',
};

const replaceTextLayoutClass = (innerHTML: string, node: HTMLElement) => {
  let mode;

  if (node.classList.contains(centerClassName)) {
    mode = rules.center;
  } else if (node.classList.contains(rightClassName)) {
    mode = rules.right;
  } else if (node.classList.contains(justifyClassName)) {
    mode = rules.justify;
  }

  if (!mode) {
    return innerHTML;
  }

  return `<p style="${mode}">${innerHTML}</p>`;
};

export default {
  filter: textLayoutFilter,
  replacement: replaceTextLayoutClass,
};
