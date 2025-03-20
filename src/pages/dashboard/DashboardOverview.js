
import React, { useEffect, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import { CounterWidget, TeamMembersWidget } from "../../components/Widgets";
import { getAPIData } from "../../utils/getAPIData";
import { useNavigate } from "react-router-dom";
import { faList, faUser } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

export default () => {
  const [userData, setUserData] = useState([]);
  const iconsArray = [faList, faUser, faUser, faUser, faUser, faUser];
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
          toast.error(`${data.message}`, { position: "top-center", autoClose: 2500 });
          navigate('/');
        } else if (status === 400) {
          toast.error(`${data.message}`, { position: "top-center", autoClose: 2500 })
        } else {
          toast.error("Something went wrong.", { position: "top-center", autoClose: 2500 });
        }
      }
    }
    fetchData();
  }, []);

  return (
    <Row className="justify-content-start">
      {userData.length > 0 ? userData.map((item, index) => {
        return (
          <Col xs={12} sm={6} xl={4} xxl={3} className="mb-4" key={index}>
            <CounterWidget
              category={`TOTAL ${String(item[0]).toUpperCase()}`}
              title={item[1]}
              icon={iconsArray[index]}
            />
          </Col>
        )
      }) : <Spinner animation='border' variant='primary' style={{ height: 80, width: 80 }} className="position-absolute top-50 start-50" />}
    </Row>
  );
};
