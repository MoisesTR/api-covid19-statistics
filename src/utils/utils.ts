const getExtensionModulesDI = (): string => (process.env.NODE_ENV === 'production' ? '.js' : '.ts');

export { getExtensionModulesDI };
