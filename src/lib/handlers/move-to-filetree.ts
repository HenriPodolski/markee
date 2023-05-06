const moveToFiletree = () => {
  const filetreeElement = document.getElementById('filetree');
  const splitViewElement = document.getElementById('split-view-section');
  if (filetreeElement && splitViewElement) {
    splitViewElement.scrollTo({
      left: filetreeElement.offsetLeft,
      behavior: 'auto',
    });
  }
};

export default moveToFiletree;
