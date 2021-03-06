import { SearchkitComponent, PaginationAccessor, SearchkitComponentProps } from "../../../../core";
export interface PaginationProps extends SearchkitComponentProps {
}
export declare enum DIRECTION {
    NEXT = 0,
    PREVIOUS = 1,
}
export declare class Pagination extends SearchkitComponent<PaginationProps, any> {
    accessor: PaginationAccessor;
    static translations: any;
    translations: any;
    static propTypes: any;
    defineAccessor(): PaginationAccessor;
    defineBEMBlocks(): {
        container: string;
        option: string;
    };
    getCurrentPage(): number;
    setPage(direction: DIRECTION): void;
    isDisabled(direction: DIRECTION): boolean;
    paginationElement(direction: DIRECTION, cssClass: string, displayText: string): JSX.Element;
    render(): JSX.Element;
}
