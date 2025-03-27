import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PageTrafficTable } from "../../components/Tables";
import { getAPIData, postAPIData } from "../../utils/getAPIData";
import { toast } from "react-toastify";

const Plan = () => {
    const [userListData, setUserListData] = useState([]);
    const [errormsg, setErrormsg] = useState('');
    const navigate = useNavigate();
    let token = localStorage.getItem('token');

    const fetchData = async () => {
        let { data, error, status } = await getAPIData('/user', token);

        if (!error) {
            setUserListData([]);
            if (data.user.length > 0) {
                data.user.map((item) => {
                    setUserListData((prev) => [...prev, {
                        Id: item._id,
                        FirstName: item.first_name,
                        LastName: item.last_name,
                        UserName: item.username,
                        Email: item.email,
                        Password: item.password,
                        Mobile: item.mobile,
                        Age: item.age,
                        Gender: item.gender,
                        Height: item.height,
                        Weight: item.weight,
                        Address: item.address,
                        City: item.city,
                        State: item.state,
                        Country: item.country,
                        Intensively: item.intensively,
                        Timeinweek: item.timeinweek,
                        Active: item.isActive
                    }])
                })
            } else if (data.user.length < 1) {
                setErrormsg(data.message);
            }
        } else {
            if (status === 401) {
                localStorage.removeItem('token');
                toast.error(`${data.message}`, { position: "top-center", autoClose: 2500 });
                navigate('/');
            } else {
                setErrormsg(' ');
                toast.error("Something went wrong.", { position: "top-center", autoClose: 2500 });
            }
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const statusChange = async (Id, Status) => {
        let { data, error, status } = await postAPIData(`/changeuserstatus`, {
            id: Id,
            status: Status ? 1 : 0
        }, token);

        if (!error) {
            fetchData();
        } else {
            if (status === 401) {
                localStorage.removeItem('token');
                toast.error(`${data.message}`, { position: "top-center", autoClose: 2500 })
                navigate('/');
            } else if (status === 400) {
                toast.error(`${data.message}`, { position: "top-center", autoClose: 2500 })
            } else {
                toast.error("Something went wrong.", { position: "top-center", autoClose: 2500 });
            }
        }
    }

    return (
        <React.Fragment>
            {userListData.length > 0 ?
                <PageTrafficTable
                    data={userListData}
                    statusChange={statusChange}
                /> : errormsg ? <h1>{errormsg}</h1> : <Spinner animation='border' variant='primary' style={{ height: 80, width: 80 }} className="position-absolute top-50 start-50" />}
        </React.Fragment>
    )
};

export default Plan;