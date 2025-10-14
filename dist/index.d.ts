import { ComponentOptionsMixin } from 'vue';
import { ComponentProvideOptions } from 'vue';
import { DefineComponent } from 'vue';
import { PublicProps } from 'vue';

declare interface Props {
    userId?: string;
    showHeaderLink?: boolean;
}

declare interface Props_2 {
    taskId: string;
    userId: string;
}

export declare const TaskDetail: DefineComponent<Props_2, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
close: () => any;
}, string, PublicProps, Readonly<Props_2> & Readonly<{
onClose?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, ComponentProvideOptions, false, {
editInput: HTMLInputElement;
}, HTMLDivElement>;

export declare const Tasks: DefineComponent<Props, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
minimize: () => any;
navigate: () => any;
}, string, PublicProps, Readonly<Props> & Readonly<{
onMinimize?: (() => any) | undefined;
onNavigate?: (() => any) | undefined;
}>, {
userId: string;
showHeaderLink: boolean;
}, {}, {}, {}, string, ComponentProvideOptions, false, {
editInput: HTMLInputElement;
}, HTMLDivElement>;

export declare interface TasksProps {
    userId?: string;
    showHeaderLink?: boolean;
}

export { }
