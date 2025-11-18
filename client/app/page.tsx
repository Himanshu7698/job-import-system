"use client";
import { useQuery } from "@tanstack/react-query";
import { JobListApi } from "./api/index";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

export default function Home() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [totalPage, setTotalPage] = useState<number | undefined>(undefined);
  const [jobData, setJobData] = useState<any>([]);
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["jobs", page, debouncedSearch],
    queryFn: JobListApi,
  });

  useEffect(() => {
    if (data) {
      setTotalPage(data?.data?.info?.total_page);
      setJobData(data?.data?.data);
    }
  }, [data]);

  useEffect(() => {
    if (!isFirstLoad) {
      refetch();
    }
  }, [page]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (debouncedSearch !== search) {
        setDebouncedSearch(search);
        if (page !== 1) {
          setPage(1);
        }
      }
    }, 700);
    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const isDataAvailable = jobData && jobData.length > 0;

  return (
    <>
      <div style={{ backgroundColor: "#f4f7f9", minHeight: "100vh", padding: "1px 0" }}>
        <div className="container py-4">
          <div className="row">
            <div className="col-12">
              <h1 className="fw-bold mb-4 text-dark border-bottom pb-2">
                Job Import Dashboard
              </h1>

              {/* Main content section */}
              <section className="content mb-5">
                <div className="container-fluid p-0">
                  <div className="row">
                    <div className="col-12">
                      <div className="card shadow-sm border-0 rounded-2">
                        <div className="card-header bg-white d-flex justify-content-end py-3 border-bottom-0 focus-ring-0">
                          <div className="input-group" style={{ maxWidth: "400px" }}>
                            <span className="input-group-text bg-white border-end-0">
                              <i className="fa fa-search text-muted"></i>
                            </span>
                            <input
                              placeholder="Search by title, company, or location..."
                              type="search"
                              className="form-control form-control-md shadow-none border-start-0"
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="table-responsive">
                          <table className="table table-hover table-striped mb-0">
                            <thead className="table-light sticky-top">
                              <tr>
                                <th style={{ width: "80px" }}>Sr no</th>
                                <th>Job Title</th>
                                <th>Company</th>
                                <th style={{width:"70px"}}>Link</th>
                                <th>Location</th>
                                <th className="text-center" style={{ width: "200px" }}>Created At</th>
                                <th className="text-center" style={{ width: "200px" }}>Updated At</th>
                              </tr>
                            </thead>

                            {!isLoading && isDataAvailable ? (
                              <tbody>
                                {jobData.map((item: any, i: number) => (
                                  <tr key={i}>
                                    <td>{i + 1 + (page - 1) * 10}</td>
                                    <td><span className="fw-bold">{item?.title}</span></td>
                                    <td>{item?.company}</td>
                                    <td>
                                      <a href={item?.link} target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-none text-nowrap" >
                                        <i className="fa fa-external-link me-1"></i>Link
                                      </a>
                                    </td>
                                    <td>{item?.location}</td>
                                    <td className="text-center text-muted">
                                      {new Date(item?.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                                    </td>
                                    <td className="text-center text-muted">
                                      {new Date(item?.updatedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            ) : null}
                          </table>

                          {(isLoading || !isDataAvailable) && (
                            <div className="p-5 text-center">
                              {isLoading ? (
                                <>
                                  <i className="fa fa-spinner fa-spin fa-3x" style={{ color: "#0d6efd" }}></i>
                                  <p className="mt-3 text-muted">Loading job data...</p>
                                </>
                              ) : (
                                <div className="p-3 bg-light rounded">
                                  <i className="fa fa-folder-open-o fa-3x text-warning"></i>
                                  <p className="fs-5 mt-2 mb-0 fw-bold text-dark">No Jobs Found</p>
                                  <p className="text-muted">Try adjusting your search criteria.</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Pagination */}
                        {totalPage ? (
                          <div className={`border-top-0 d-flex justify-content-center py-3 ${totalPage > 0 ? "" : "d-none"}`}>
                            <ReactPaginate
                              previousLabel={<i className="fa fa-angle-left" aria-label="Previous Page"></i>}
                              nextLabel={<i className="fa fa-angle-right" aria-label="Next Page"></i>}
                              breakLabel={"..."}
                              pageCount={totalPage}
                              marginPagesDisplayed={1}
                              pageRangeDisplayed={2}
                              forcePage={page - 1}
                              onPageChange={(pageClicked) => setPage(pageClicked.selected + 1)}
                              containerClassName={"pagination pagination-sm mb-0 rounded-pill bg-light py-1 px-1 shadow"}
                              pageClassName={"page-item"}
                              pageLinkClassName={"page-link border-0 shadow-none fw-medium text-black bg-transparent rounded-pill mx-1"}
                              previousLinkClassName={"page-link border-0 shadow-none fw-medium text-black bg-transparent"}
                              nextClassName={"page-item"}
                              nextLinkClassName={"page-link border-0 shadow-none fw-medium text-black bg-transparent"}
                              breakClassName={"page-item disabled"}
                              breakLinkClassName={"page-link border-0 text-black bg-transparent"}
                              activeClassName={"active"}
                              activeLinkClassName={"text-primary bg-white fw-bold shadow"}
                            />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div >
      </div >
    </>
  );
}