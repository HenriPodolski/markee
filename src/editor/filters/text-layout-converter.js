const textLayoutFilter = (node) => {
    return node.nodeName === 'P' && (
        node.classList.contains('ql-align-center') ||
        node.classList.contains('ql-align-right') ||
        node.classList.contains('ql-align-justify')
    );
}

const replaceTextLayoutClass = (innerHTML, node) => {
    console.log('replaceTextLayoutClass', node);
    return innerHTML;
}

export default {
    filter: textLayoutFilter,
    replacement: replaceTextLayoutClass
};