import styles from './DevelopStore.module.scss';

import store, { useAppDispatch, useAppSelector } from './store';
import { Provider } from 'react-redux';
import { useEffect } from 'react';
import {
  fetchFileSystem,
  selectFileSystemItems,
  selectFileSystemItemsByBasePathInOrder,
} from './store/fileSystem';

const DevelopStoreChild = () => {
  const fileSystem = useAppSelector(
    selectFileSystemItemsByBasePathInOrder('/')
  );
  const fileSystemFetchStatus = useAppSelector(
    (state) => state.fileSystem.status
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchFileSystem());
  }, [dispatch]);

  useEffect(() => {
    console.log(fileSystem);
  }, [fileSystem]);

  return (
    <>
      <pre>View helper to develop the store</pre>
      <pre>
        {fileSystemFetchStatus} {JSON.stringify(fileSystem, null, 4)}
      </pre>
    </>
  );
};

const DevelopStore = () => {
  console.log('DevelopStore');
  // load files, convert file content and add to state
  // all updates should trigger effect that updates files
  return (
    <Provider store={store}>
      <div className={styles.DevelopStore}>
        <DevelopStoreChild />
      </div>
    </Provider>
  );
};

export default DevelopStore;
