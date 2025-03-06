import React, { useState } from "react";
import { Card, Form } from "react-bootstrap";
import { postAPIData } from "../utils/getAPIData";

const ToggleSwitch = ({ id, label }) => {
  const [switchChecked, setSwitchChecked] = useState(true);
  let token = localStorage.getItem('token');

  const updateStatus = async (index) => {
    // const { data, error, status } = await postAPIData('URL', "value ? value : null", token);
  }

  return (
    <div className="d-flex mb-2">
      <label className="col-2">{label}</label>
      <Form.Check type="switch"
        className="col-9"
        checked={switchChecked}
        onChange={() => {
          setSwitchChecked(!switchChecked);
          updateStatus(id);
        }}
      />
    </div>
  )
}

const Settings = () => {
  const SettingList = ["Challenges", "Category", "Discover", "Quick Workout", "Stretches"];
  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">Exercise Setting</h5>
        {SettingList.map((item, index) => <ToggleSwitch id={index} label={item} />)}
      </Card.Body>
    </Card>
  );
};
export default Settings;