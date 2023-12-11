type YamlObject = { [key: string]: YamlObject } & string & boolean & number & YamlObject[];

declare module '*.yaml' {
    const content: YamlObject;
    // noinspection JSUnusedGlobalSymbols
    export default content;
}
