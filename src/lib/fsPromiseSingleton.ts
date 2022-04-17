import LightningFS from '@isomorphic-git/lightning-fs';

const instances: { [key: string]: LightningFS } = {};
const fsPromiseSingleton = (() => {
  const createInstance = (instanceNamespace: string) => {
    const classObj = new LightningFS(instanceNamespace);
    return classObj;
  };

  return {
    getInstance: (instanceNamespace: string) => {
      if (!instances[instanceNamespace]) {
        instances[instanceNamespace] = createInstance(instanceNamespace);
      }
      return instances[instanceNamespace].promises;
    },
  };
})();

export default fsPromiseSingleton;
