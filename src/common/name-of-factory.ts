export default <T>() => (name: keyof T): string => `${name}`;
