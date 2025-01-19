import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../utils/loader";
import {
  API_URL,
  errorText,
  nextButton,
  noResultFoundText,
  pageSizeArr,
  prevButton,
  tableHeadings,
  tableHeadingText,
} from "./constants";
import "./Table.css";

const Table = () => {
  const [data, setData] = useState({
    loading: true,
    error: false,
    users: [],
  });
  const [pageNo, setPageNo] = useState(1);
  // no. of entities on the table
  const [pageSize, setPageSize] = useState(5);
  // search logic
  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const fetchData = async () => {
    try {
      const resp = await fetch(API_URL);
      const value = await resp.json();
      // mapping relevant fields
      const users = value.map((it) => ({
        id: it["s.no"],
        title: it.title,
        percentage: it["percentage.funded"],
        amount: it["amt.pledged"],
      }));
      setData({
        loading: false,
        error: false,
        users,
      });
      setFilteredUsers(users);
    } catch (err) {
      setData({
        ...data,
        loading: false,
        error: true,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePageSize = (e) => {
    setPageSize(e.target.value);
    setPageNo(1);
  };
  const { loading, error, users } = data;
  const handleSearch = (e) => {
    const searchQuery = e.target.value.toLowerCase();
    setSearchText(searchQuery);
    if (searchQuery) {
      const filteredUsersData = users.filter((item) =>
        item.title.toLowerCase().includes(searchQuery)
      );
      setFilteredUsers(filteredUsersData);
      filteredUsersData.length ? setPageNo(1) : setPageNo(0);
    } else {
      setFilteredUsers(users);
      setPageNo(1);
    }
  };

  if (loading) {
    return <LoadingSpinner width={150} height={150} />;
  }
  if (error) {
    return <>{errorText} </>;
  }
  const displayUsers = filteredUsers.slice(
    (pageNo - 1) * pageSize,
    pageNo * pageSize
  );
  const lastPage = Math.ceil(filteredUsers.length / pageSize);
  return (
    <div className="table-wrapper">
      <h1>{tableHeadingText}</h1>
      <input
        className="search"
        type="text"
        value={searchText}
        onChange={handleSearch}
        placeholder="Search"
      />
      <table>
        <thead>
          <tr>
            {tableHeadings.map(({ label, key }) => (
              <th key={key}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {
            displayUsers.length ?
              displayUsers.map(({ id, title, percentage, amount }) => (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{title}</td>
                  <td>{percentage}</td>
                  <td>{amount}</td>
                </tr>
              )) :
              <tr>
                <td className="no-result">
                  {noResultFoundText}
                </td>
              </tr>
          }
        </tbody>
      </table>
      <div className="footer">
        <select value={pageSize} onChange={handlePageSize}>
          {pageSizeArr.map(({ text, value }) => {
            return (
              <option key={value} value={value}>
                {text}
              </option>
            );
          })}
        </select>
        <div className="pagination">
          <button
            className="btn"
            disabled={pageNo === 1 || pageNo === 0}
            onClick={() => setPageNo(pageNo - 1)}
          >
            {prevButton}
          </button>
          <p> {`Page ${pageNo} of ${lastPage}`}</p>
          <button
            className="btn"
            disabled={pageNo === lastPage}
            onClick={() => setPageNo(pageNo + 1)}
          >
            {nextButton}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;
