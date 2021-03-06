import React from "react";
import "./ContainerIssues.css";
import { IssuesInPage } from "./IssuesInPage";
import { getData, getInfoAboutRepo } from "./HttpRequest";
import ReactPaginate from "react-paginate";

export class ContainerIssues extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      infoRepository: {},
      page: props.page ? props.page : 1,
      pageCount: 0,
      query: props.query
    };

    getData(this.state.page, this.state.query).then(data =>
      this.setState({ data: data })
    );
    getInfoAboutRepo().then(data =>
      this.setState({
        infoRepository: data,
        pageCount: Math.ceil(data.open_issues_count / 30)
      })
    );
  }

  pushPage(n) {
    getData(n, this.state.query).then(data => {
      scrollUp();
      this.props.history.push(`?page=${n}&state=${this.state.query}`);
      this.setState({ data: data, page: n });
    });
  }

  pushIssue(n) {
    this.props.handleClick(n);
    this.props.history.push(`/issue/get-issue?number=${n.number}`);
  }

  render() {
    return (
      <div className="box-container">
        <form
          className="filter"
          action={`${window.location.href}`}
          method="get"
        >
          <input
            type="text"
            name="state"
            placeholder={this.state.query ? this.state.query : "Filter..."}
          />
        </form>

        <IssuesInPage
          data={this.state.data}
          handleClick={n => this.pushIssue(n)}
        />

        <div className="pagination">
          <ReactPaginate
            disableInitialCallback={true}
            initialPage={this.state.page - 1}
            previousLabel={"PREV"}
            nextLabel={"NEXT"}
            breakLabel={"..."}
            pageCount={this.state.pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={n => this.pushPage(n.selected + 1)}
            pageClassName={"page"}
            activeClassName={"page-enabled"}
            breakClassName={"page-break"}
            previousClassName={"page-previous"}
            nextClassName={"page-next"}
            disabledClassName={"page-disabled"}
          />
        </div>
      </div>
    );
  }
}

function scrollUp() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth"
  });
}
