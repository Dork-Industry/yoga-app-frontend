
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faArrowDown, faArrowUp, faEdit, faEllipsisH, faExternalLinkAlt, faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Nav, Card, Image, Button, Table, Dropdown, ProgressBar, Pagination, ButtonGroup, Form } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';

import { RoutesData } from "../routes";
import { pageVisits, pageTraffic, pageRanking } from "../data/tables";
import transactions from "../data/transactions";
import commands from "../data/commands";

const ValueChange = ({ value, suffix }) => {
  const valueIcon = value < 0 ? faAngleDown : faAngleUp;
  const valueTxtColor = value < 0 ? "text-danger" : "text-success";

  return (
    value ? <span className={valueTxtColor}>
      <FontAwesomeIcon icon={valueIcon} />
      <span className="fw-bold ms-1">
        {Math.abs(value)}{suffix}
      </span>
    </span> : "--"
  );
};

export const PageVisitsTable = () => {
  const TableRow = (props) => {
    const { pageName, views, returnValue, bounceRate } = props;
    const bounceIcon = bounceRate < 0 ? faArrowDown : faArrowUp;
    const bounceTxtColor = bounceRate < 0 ? "text-danger" : "text-success";

    return (
      <tr>
        <th scope="row">{pageName}</th>
        <td>{views}</td>
        <td>${returnValue}</td>
        <td>
          <FontAwesomeIcon icon={bounceIcon} className={`${bounceTxtColor} me-3`} />
          {Math.abs(bounceRate)}%
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="shadow-sm">
      <Card.Header>
        <Row className="align-items-center">
          <Col>
            <h5>Page visits</h5>
          </Col>
          <Col className="text-end">
            <Button variant="secondary" size="sm">See all</Button>
          </Col>
        </Row>
      </Card.Header>
      <Table responsive className="align-items-center table-flush">
        <thead className="thead-light">
          <tr>
            <th scope="col">Page name</th>
            <th scope="col">Page Views</th>
            <th scope="col">Page Value</th>
            <th scope="col">Bounce rate</th>
          </tr>
        </thead>
        <tbody>
          {pageVisits.map(pv => <TableRow key={`page-visit-${pv.id}`} {...pv} />)}
        </tbody>
      </Table>
    </Card>
  );
};

export const ToggleSwitch = ({ activity, id, updateStatus }) => {
  const [switchChecked, setSwitchChecked] = useState(activity == 1 ? true : false);

  return (
    <Form.Check type="switch" checked={switchChecked} onChange={() => {
      setSwitchChecked(!switchChecked);
      updateStatus(id, !switchChecked);
    }} />
  )
}

export const PageTrafficTable = ({ data, handleModal, setUser, deleteUser, statusChange }) => {
  const [activePage, setActivePage] = useState(1);
  const [activeEllipsis, setActiveEllipsis] = useState(false);
  const totalPages = Math.ceil(data.length / 10);

  const startIndex = (activePage - 1) * 10;
  const endIndex = startIndex + 10;
  const currentItems = data.slice(startIndex, endIndex);

  const goToPage = (index) => {
    setActivePage(index);
  }

  const nextPage = () => {
    if (activePage === 4) {
      setActiveEllipsis(true);
    } else if (activePage === totalPages - 4) {
      setActiveEllipsis(false);
    }
    if (activePage < totalPages) {
      setActivePage(activePage + 1);
    }
  };

  const prevPage = () => {
    if (activePage === 5) {
      setActiveEllipsis(false);
    } else if (activePage - 1 === totalPages - 4) {
      setActiveEllipsis(true);
    }
    if (activePage > 1) {
      setActivePage(activePage - 1);
    }
  };

  const TableRow = ({ id, ...props }) => {

    const navigate = useNavigate();

    const handleClick = (navigateroute, id) => {
      const queryParams = new URLSearchParams({
        challengesid: id,

      }).toString();
      // Redirect to the desired path
      navigate(`${navigateroute}?${queryParams}`);
    };

    const handleDaysClick = (navigateroute, id, parentparams) => {
      const queryParams = new URLSearchParams(parentparams).toString();

      navigate(`${navigateroute}?${queryParams}`);
    }
    // const { id, source, sourceIcon, sourceIconColor, sourceType, category, rank, trafficShare, change } = props;console.log(data);

    return (
      <tr>
        {Object.entries(props).map((value, index) => {
          return (
            <td key={index}>
              {value[0] === "Image" ? (
                <Image src={value[1]} style={{ height: 50, width: 50 }} />
              ) : (value[0] === "Pro" || value[0] === "Active") ? (
                <ToggleSwitch activity={value[1]} id={props.Id} updateStatus={statusChange} />
              ) : value[0] === "Action" ?
                value[1] === 1 ? (
                  <React.Fragment>
                    <Button variant="outline-secondary" className="mx-1" onClick={() => {
                      handleModal(true);
                      setUser(data[id]);
                    }}>
                      <FontAwesomeIcon icon={faEdit} /> Edit
                    </Button>
                    <Button variant="outline-danger" className="mx-1" onClick={() => {
                      deleteUser({
                        Id: data[id].Id,
                        IsConfirmed: true
                      })
                    }}>
                      <FontAwesomeIcon icon={faTrashAlt} /> Delete
                    </Button>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Button variant="outline-danger" className="mx-1" onClick={() => {
                      deleteUser({
                        Id: data[id].Id,
                        IsConfirmed: true
                      })
                    }}>
                      <FontAwesomeIcon icon={faTrashAlt} /> Delete
                    </Button>
                  </React.Fragment>
                ) : value[1]?.type === "Button" ? (
                  <Button variant="outline-primary" className="mx-1" onClick={() => {
                    handleDaysClick(value[1].navigateRoute, data[id].Id, value[1].queryparams)
                  }}>{value[1].label}</Button>
                ) : value[0] === "Id" ? id + 1 + ((activePage - 1) * 10) : <div dangerouslySetInnerHTML={{ __html: value[1] }} />}
            </td>
          )
        })}
        {/* <td>
          <Card.Link href="#" className="text-primary fw-bold">{id}</Card.Link>
        </td>
        <td className="fw-bold">
          <FontAwesomeIcon icon={sourceIcon} className={`icon icon-xs text-${sourceIconColor} w-30`} />
          {source}
        </td>
        <td>{sourceType}</td>
        <td>{category ? category : "--"}</td>
        <td>{rank ? rank : "--"}</td>
        <td>
          <Row className="d-flex align-items-center">
            <Col xs={12} xl={2} className="px-0">
              <small className="fw-bold">{trafficShare}%</small>
            </Col>
            <Col xs={12} xl={10} className="px-0 px-xl-1">
              <ProgressBar variant="primary" className="progress-lg mb-0" now={trafficShare} min={0} max={100} />
            </Col>
          </Row>
        </td>
        <td>
          <ValueChange value={change} suffix="%" />
        </td> */}
      </tr>
    );
  };

  return (
    <React.Fragment>
      <Card border="light" className="shadow-sm mb-4">
        <Card.Body className="pb-0">
          <Table responsive className="table-centered table-nowrap rounded mb-0">
            <thead className="thead-light">
              <tr>
                {currentItems.length > 0 && Object.keys(currentItems[0]).map((key, index) => (
                  <th className="border-0" key={index}>{key === 'Id' ? '#' : key.replace("_", " ")}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((value, index) => (<TableRow key={`page-traffic-${index}`} id={index} {...value} />))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      {totalPages > 1 &&
        <Pagination className="justify-content-end">
          <Pagination.Prev onClick={() => prevPage()} disabled={activePage === 1} linkClassName="prevBtn" />
          {totalPages > 5 ? (
            <React.Fragment>
              {Array.from({ length: totalPages }, (_, index) => (
                <Pagination.Item key={index} onClick={() => goToPage(index + 1)} active={activePage === index + 1}>{index + 1}</Pagination.Item>
              )).slice(0, 4)}

              <Pagination.Ellipsis active={activeEllipsis} />

              {Array.from({ length: totalPages }, (_, index) => (
                <Pagination.Item key={index} onClick={() => goToPage(index + 1)} active={activePage === index + 1}>{index + 1}</Pagination.Item>
              )).slice(totalPages - 4)}
            </React.Fragment>
          ) : (
            Array.from({ length: totalPages }, (_, index) => (
              <Pagination.Item key={index} onClick={() => goToPage(index + 1)} active={activePage === index + 1}>{index + 1}</Pagination.Item>
            )
            ))}
          <Pagination.Next onClick={() => nextPage()} disabled={activePage === totalPages} linkClassName="nextBtn" />
        </Pagination>
      }
    </React.Fragment>
  );
};

export const RankingTable = () => {
  const TableRow = (props) => {
    const { country, countryImage, overallRank, overallRankChange, travelRank, travelRankChange, widgetsRank, widgetsRankChange } = props;

    return (
      <tr>
        <td className="border-0">
          <Card.Link href="#" className="d-flex align-items-center">
            <Image src={countryImage} className="image-small rounded-circle me-2" />
            <div><span className="h6">{country}</span></div>
          </Card.Link>
        </td>
        <td className="fw-bold border-0">
          {overallRank ? overallRank : "-"}
        </td>
        <td className="border-0">
          <ValueChange value={overallRankChange} />
        </td>
        <td className="fw-bold border-0">
          {travelRank ? travelRank : "-"}
        </td>
        <td className="border-0">
          <ValueChange value={travelRankChange} />
        </td>
        <td className="fw-bold border-0">
          {widgetsRank ? widgetsRank : "-"}
        </td>
        <td className="border-0">
          <ValueChange value={widgetsRankChange} />
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="shadow-sm">
      <Card.Body className="pb-0">
        <Table responsive className="table-centered table-nowrap rounded mb-0">
          <thead className="thead-light">
            <tr>
              <th className="border-0">Country</th>
              <th className="border-0">All</th>
              <th className="border-0">All Change</th>
              <th className="border-0">Travel & Local</th>
              <th className="border-0">Travel & Local Change</th>
              <th className="border-0">Widgets</th>
              <th className="border-0">Widgets Change</th>
            </tr>
          </thead>
          <tbody>
            {pageRanking.map(r => <TableRow key={`ranking-${r.id}`} {...r} />)}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export const TransactionsTable = () => {
  const totalTransactions = transactions.length;

  const TableRow = (props) => {
    const { invoiceNumber, subscription, price, issueDate, dueDate, status } = props;
    const statusVariant = status === "Paid" ? "success"
      : status === "Due" ? "warning"
        : status === "Canceled" ? "danger" : "primary";

    return (
      <tr>
        <td>
          <Card.Link as={Link} to={RoutesData.Invoice.path} className="fw-normal">
            {invoiceNumber}
          </Card.Link>
        </td>
        <td>
          <span className="fw-normal">
            {subscription}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            {issueDate}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            {dueDate}
          </span>
        </td>
        <td>
          <span className="fw-normal">
            ${parseFloat(price).toFixed(2)}
          </span>
        </td>
        <td>
          <span className={`fw-normal text-${statusVariant}`}>
            {status}
          </span>
        </td>
        <td>
          <Dropdown as={ButtonGroup}>
            <Dropdown.Toggle as={Button} split variant="link" className="text-dark m-0 p-0">
              <span className="icon icon-sm">
                <FontAwesomeIcon icon={faEllipsisH} className="icon-dark" />
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>
                <FontAwesomeIcon icon={faEye} className="me-2" /> View Details
              </Dropdown.Item>
              <Dropdown.Item>
                <FontAwesomeIcon icon={faEdit} className="me-2" /> Edit
              </Dropdown.Item>
              <Dropdown.Item className="text-danger">
                <FontAwesomeIcon icon={faTrashAlt} className="me-2" /> Remove
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="table-wrapper table-responsive shadow-sm">
      <Card.Body className="pt-0">
        <Table hover className="user-table align-items-center">
          <thead>
            <tr>
              <th className="border-bottom">#</th>
              <th className="border-bottom">Bill For</th>
              <th className="border-bottom">Issue Date</th>
              <th className="border-bottom">Due Date</th>
              <th className="border-bottom">Total</th>
              <th className="border-bottom">Status</th>
              <th className="border-bottom">Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => <TableRow key={`transaction-${t.invoiceNumber}`} {...t} />)}
          </tbody>
        </Table>
        <Card.Footer className="px-3 border-0 d-lg-flex align-items-center justify-content-between">
          <Nav>
            <Pagination className="mb-2 mb-lg-0">
              <Pagination.Prev>
                Previous
              </Pagination.Prev>
              <Pagination.Item active>1</Pagination.Item>
              <Pagination.Item>2</Pagination.Item>
              <Pagination.Item>3</Pagination.Item>
              <Pagination.Item>4</Pagination.Item>
              <Pagination.Item>5</Pagination.Item>
              <Pagination.Next>
                Next
              </Pagination.Next>
            </Pagination>
          </Nav>
          <small className="fw-bold">
            Showing <b>{totalTransactions}</b> out of <b>25</b> entries
          </small>
        </Card.Footer>
      </Card.Body>
    </Card>
  );
};

export const CommandsTable = () => {
  const TableRow = (props) => {
    const { name, usage = [], description, link } = props;

    return (
      <tr>
        <td className="border-0" style={{ width: '5%' }}>
          <code>{name}</code>
        </td>
        <td className="fw-bold border-0" style={{ width: '5%' }}>
          <ul className="ps-0">
            {usage.map(u => (
              <ol key={u} className="ps-0">
                <code>{u}</code>
              </ol>
            ))}
          </ul>
        </td>
        <td className="border-0" style={{ width: '50%' }}>
          <pre className="m-0 p-0">{description}</pre>
        </td>
        <td className="border-0" style={{ width: '40%' }}>
          <pre><Card.Link href={link} target="_blank">Read More <FontAwesomeIcon icon={faExternalLinkAlt} className="ms-1" /></Card.Link></pre>
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="shadow-sm">
      <Card.Body className="p-0">
        <Table responsive className="table-centered rounded" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          <thead className="thead-light">
            <tr>
              <th className="border-0" style={{ width: '5%' }}>Name</th>
              <th className="border-0" style={{ width: '5%' }}>Usage</th>
              <th className="border-0" style={{ width: '50%' }}>Description</th>
              <th className="border-0" style={{ width: '40%' }}>Extra</th>
            </tr>
          </thead>
          <tbody>
            {commands.map(c => <TableRow key={`command-${c.id}`} {...c} />)}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};