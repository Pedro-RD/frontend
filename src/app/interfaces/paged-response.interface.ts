export default interface PagedResponse<T> {
    data: T[];
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
}

export enum Order {
    ASC = "ASC",
    DESC = "DESC"
}