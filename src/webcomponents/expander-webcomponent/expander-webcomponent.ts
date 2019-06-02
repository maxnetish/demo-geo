/**
 * Usage:
 * <dg-expander open title-text="Title for details">
 *     <div slot="title">
 *         Custom title
 *         <i class="custom icon"></i>
 *     </div>
 *     <ul slot="content">
 *         <li>Expander content</li>
 *     </ul>
 * </dg-expander>
 *
 * Slot "title" overrides title-text, fires event "toggle" when close or open by user.
 * You can manage component programmatically by property "open".
 */

import templateHtmlString from './expander-webcomponent.tpl.html';
import {IWebComponent} from "../base";
import {autobind} from "core-decorators";

const templateElement = document.createElement('template');
templateElement.innerHTML = templateHtmlString;

export const toggleEvent = 'toggle';
const defaultTitle = 'Details';
const openAttr = 'open';
const titleTextAttr = 'title-text';

class ExpanderWebComponent extends HTMLElement implements IWebComponent {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        if (this.shadowRoot) {
            this.shadowRoot.appendChild(templateElement.content.cloneNode(true));
        } else {
            throw new Error('ExpanderErbComponent: Cannot construct shadow root.');
        }
    }

    private toggleElement: HTMLElement | null;
    private contentInnerBox: HTMLElement | null;
    private contentBox: HTMLElement | null;

    @autobind
    private toggleClickHandler(e: Event) {
        const open = this.open = !this.open;

        this.dispatchEvent(new CustomEvent(toggleEvent, {
            detail: {
                open
            },
            bubbles: true,
            cancelable: false,
            composed: true,
        }));
    }

    private animateOpen() {
        const measureHeight = this.contentInnerBox ? this.contentInnerBox.scrollHeight : 0;
        if (this.contentBox) {
            // after animation ends set height:auto allowing block height by content
            this.contentBox.addEventListener('transitionend', () => {
                if (this.contentBox && this.contentBox.style.height === `${measureHeight}px`) {
                    // to prevent set auto when closing begins before opening end
                    this.contentBox.style.height = 'auto';
                }
            }, {once: true});
            // set arbitrary height to start transition
            this.contentBox.style.height = `${measureHeight}px`;
        }
    }

    private animateClose() {
        const measureHeight = this.contentInnerBox ? this.contentInnerBox.scrollHeight : 0;
        if (this.contentBox) {
            // set arbitrary initial height
            if(this.contentBox.style.height === 'auto') {
                // to prevent set full height if height already arbitrary
                this.contentBox.style.height = `${measureHeight}px`;
            }
            setTimeout(() => {
                if (this.contentBox) {
                    // set zero height on next tick
                    // else transition won't begins
                    this.contentBox.style.height = '0';
                }
            }, 0);
        }
    }

    private updateTitleText(value: string | null) {
        if(!this.shadowRoot) {
            return;
        }
        const titleElm = this.shadowRoot.querySelector('.dg-expander-title');
        if(titleElm) {
            titleElm.textContent = value || defaultTitle;
        }
    }

    public get open(): boolean {
        return this.hasAttribute(openAttr);
    }

    public set open(value: boolean) {
        if (value && !this.open) {
            this.setAttribute(openAttr, '');
            this.animateOpen();
        } else if (!value && this.open) {
            this.removeAttribute(openAttr);
            this.animateClose();
        }
    }

    public get titleText(): string | null {
        return this.hasAttribute(titleTextAttr) ? this.getAttribute(titleTextAttr) : null;
    }

    public set titleText(value: string | null) {
        if(value) {
            if(this.titleText!==value) {
                this.setAttribute(titleTextAttr, value);
            }
        } else {
            this.removeAttribute(titleTextAttr);
        }
        this.updateTitleText(value);
    }

    connectedCallback() {
        this.open = !!this.open;

        if (this.shadowRoot) {
            this.toggleElement = this.shadowRoot.querySelector('.dg-expander-toggle');
            this.contentBox = this.shadowRoot.querySelector('.dg-expander-content');
            this.contentInnerBox = this.shadowRoot.querySelector('.dg-expander-content-inner');
        }

        if (this.toggleElement) {
            this.toggleElement.addEventListener('click', this.toggleClickHandler);
        }

        if(this.contentBox) {
            // set initial visibility of content without animation
            this.contentBox.style.height = this.open ? 'auto' : '0';
        }
    }

    disconnectedCallback() {
        if (this.toggleElement) {
            this.toggleElement.removeEventListener('click', this.toggleClickHandler);
        }
    }


    attributeChangedCallback(attrName: string, oldVal?: string, newVal?: string) {
        switch (attrName) {
            case 'open':
                this.open = (typeof newVal === 'string');
                break;
            case 'title-text':
                this.titleText = newVal || null;
        }
    }

    static get observedAttributes() {
        return [openAttr, titleTextAttr];
    }
}

window.customElements.define('dg-expander', ExpanderWebComponent);
