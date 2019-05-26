import {Component, h, VNode} from 'preact';
import classNames from 'classnames';

import './expander.less';

interface IExpanderProps {
    expanded?: boolean;
    class?: string;
    header?: VNode | string;
}

export default class ExpanderComponent extends Component<IExpanderProps, {}> {


    render(
        props: Readonly<IExpanderProps & preact.Attributes & { children?: preact.ComponentChildren; ref?: preact.Ref<any> }>,
        state: Readonly<{}>,
        context?: any
    ): preact.VNode<any> | object | string | number | boolean | null {
        const {expanded, header, 'class': outerClass, ...restProps} = props;
        const containerClass = classNames([
            outerClass,
            'dg-details'
        ]);

        return <section class={containerClass} {...restProps}>
            <details open={expanded}>
                <summary class="dg-details__summary">
                    <header>{header}</header>
                </summary>
                {props.children}
            </details>
        </section>
    }
}
