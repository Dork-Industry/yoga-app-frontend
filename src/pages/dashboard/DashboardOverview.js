
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { CounterWidget } from "../../components/Widgets";
import { getAPIData } from "../../utils/getAPIData";
import { useNavigate } from "react-router-dom";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";

export default () => {
  const [userData, setUserData] = useState([]);
  const navigate = useNavigate();
  let token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchData() {
      let { data, error, status } = await getAPIData('/dashboard', token);

      if (!error) {
        setUserData(Object.entries(data));
      } else {
        if (status === 401) {
          localStorage.removeItem('token');
          navigate('/');
        }
      }
    }
    fetchData();
  }, []);

  return (
    <Row className="justify-content-start">
      {userData.length > 0 && userData.map((item, index) => {
        return (
          <Col xs={12} sm={6} xl={3} className="mb-4" key={index}>
            <CounterWidget
              category={`TOTAL ${String(item[0]).toUpperCase()}`}
              title={item[1]}
              period="Feb 1 - Apr 1"
              percentage={18.2}
              icon={faChartLine}
              iconColor="shape-secondary"
            />
          </Col>
        )
      })}
    </Row>
  );
};
