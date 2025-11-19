import HttpService from "./interceptors";

export const JobListApi = async ({ queryKey }: { queryKey: [string, number, string] }) => {
    const [, page, search] = queryKey;
    return await HttpService.get(
        `/jobs?limit=10&page=${page}&search=${search}`
    );
};
