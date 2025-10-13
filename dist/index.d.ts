import { ComponentOptionsMixin } from 'vue';
import { ComponentProvideOptions } from 'vue';
import { DefineComponent } from 'vue';
import { PublicProps } from 'vue';

declare interface Props {
    userId?: string;
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

export declare const Tasks: DefineComponent<Props, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<Props> & Readonly<{}>, {
userId: string;
}, {}, {}, {}, string, ComponentProvideOptions, false, {
editInput: HTMLInputElement;
}, HTMLDivElement>;

export declare interface TasksProps {
    userId?: string;
}

export { }
