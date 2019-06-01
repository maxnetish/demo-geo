/**
 * To shim import raw file as string
 */

declare module "*.tpl.html" {
    const content: string;
    export default content;
}

declare namespace JSX {
    interface IntrinsicElements {
        'dg-expander': HTMLAttributes & {onToggle?: GenericEventHandler};
    }
}
