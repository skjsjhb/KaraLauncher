type TomlObject = { [key: string]: TomlObject } & string & boolean & number & TomlObject[];

declare module '*.toml' {
    const content: TomlObject;
    // noinspection JSUnusedGlobalSymbols
    export default content;
}
