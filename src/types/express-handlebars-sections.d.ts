declare module 'express-handlebars-sections' {
    const sections: () => (name: string, options: any) => string;
    export default sections;
}
