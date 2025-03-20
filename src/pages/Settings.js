import React, { useState } from "react";
import { Card, Form, Spinner } from "react-bootstrap";
import { getAPIData, postAPIData } from "../utils/getAPIData";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ToggleSwitch = ({ id, label, value }) => {
  const navigate = useNavigate();
  const [switchChecked, setSwitchChecked] = useState(value);
  let token = localStorage.getItem('token');

  const updateStatus = async (index, label) => {
    const updateValue = {
      "settingId": index,
      [label]: switchChecked === "0" ? "1" : "0"
    }

    const { data, error, status } = await postAPIData('/updatesetting', updateValue, token);

    if (!error) {
      if (data.data.success) {
        toast.success("Settings Changed Successfully.", { position: "top-center", autoClose: 2500 })
      }
    } else {
      if (status === 401) {
        localStorage.removeItem('token');
        toast.error(`${data.message}`, { position: "top-center", autoClose: 2500 });
        navigate('/');
      } else if (status === 400) {
        toast.error(`${data.message}`, { position: "top-center", autoClose: 2500 });
      } else {
        toast.error("Something went wrong.", { position: "top-center", autoClose: 2500 });
      }
    }
  }

  return (
    <div className="d-flex mb-2">
      <label className="col-2">{label.charAt(0).toUpperCase() + label.slice(1).toLowerCase()}</label>
      <Form.Check type="switch"
        className="col-9"
        checked={switchChecked === "1" ? true : false}
        onChange={() => {
          if (switchChecked === "0") {
            setSwitchChecked("1");
          } else {
            setSwitchChecked("0");
          }
          updateStatus(id, label);
        }}
      />
    </div>
  )
}

const Settings = () => {
  const [settingList, setSettingList] = useState([]);
  const [settingId, setSettingId] = useState('');
  const [errormsg, setErrormsg] = useState('');
  const navigate = useNavigate();
  let token = localStorage.getItem('token');

  const fetchData = async () => {
    let { data, error, status } = await getAPIData('/settings', token);

    if (!error) {
      setSettingList([]);
      if (data?.data?.success) {
        setSettingList(Object.entries(data.data.settings[0]));
        setSettingId(data.data.settings[0].settingId);
      } else if (data.settings.length < 1) {
        setErrormsg(data.message);
      }
    } else {
      if (status === 401) {
        localStorage.removeItem('token');
        toast.error(`${data.message}`, { position: "top-center", autoClose: 2500 });
        navigate('/');
      } else {
        toast.error("Something went wrong.", { position: "top-center", autoClose: 2500 });
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">Exercise Setting</h5>
        {settingList.length > 0 ? settingList.map((item, index) => {
          if (item[0] !== "_id" && item[0] !== "settingId" && item[0] !== "updatedAt") {
            return (
              <ToggleSwitch id={String(settingId)} value={String(item[1])} label={item[0]} key={index} />
            )
          }
        }) : errormsg ? <h1>{errormsg}</h1> : <Spinner animation='border' variant='primary' style={{ height: 80, width: 80 }} className="position-absolute top-50 start-50" />}
      </Card.Body>
    </Card>
  );
};
export default Settings;