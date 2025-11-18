import HttpService from "./interceptors";

export const JobListApi = async ({ queryKey }: any) =>
    await HttpService.get(
        `/jobs?limit=${queryKey[3] || 10}&page=${queryKey[1] || 1}&search=${queryKey[2]}`
    );