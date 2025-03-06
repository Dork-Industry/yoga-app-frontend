import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageTrafficTable } from "../../components/Tables";
import { getAPIData, postAPIData } from "../../utils/getAPIData";
import { Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const WeekDays = () => {
    const [weekDaysData, setWeekDaysData] = useState([]);
    const [deleteUser, setDeleteUser] = useState({
        Id: 0,
        IsConfirmed: false
    });
    const [errormsg, setErrormsg] = useState("")
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const id = searchParams.get('weekid');
    const challenges_id = searchParams.get('challengesid');
    let token = localStorage.getItem('token');

    const fetchData = async () => {
        let { data, error, status } = await getAPIData(`/getDaysByWeekId/${id}`, token)
        if (!error) {
            setWeekDaysData([]);
            if (data.days.length > 0) {
                data.days.map((item) => {
                    setWeekDaysData((prev) => [...prev, {
                        Id: item._id,
                        'Week Name': item.week_Id.weekName,
                        'Days': item.daysName,
                        View_Exercise: {
                            label: "View Exercise",
                            type: "Button",
                            queryparams: {
                                daysid: item._id,
                                challengesid: challenges_id,
                                weekid: id
                            },
                            navigateRoute: "/admin/challengesexercise",

                        },
                        Action: 1
                    }])
                })
            }

        }
        else {
            if (status === 401) {
                localStorage.removeItem('token');
                navigate('/');
            }
            else {
                if (data.message) {
                    setErrormsg(data.message);
                }
                else {
                    setErrormsg("Something Went Wrong!")
                }
            }
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const queryParams = new URLSearchParams({
        weekid: id,
        challengesid: challenges_id
    }).toString();

    const handleAddWeekDay = () => {
        if (weekDaysData.length >= 7) {
            alert("Days can not be more than 7 in a week")
        } else {
            navigate(`/admin/addweekdays?${queryParams}`)
        }
    }

    const deleteData = async () => {
        let { data, error, status } = await postAPIData(`/deleteDay/${deleteUser.Id}`, null, token);

        if (!error) {
            fetchData();
            toast.error(`${data.message}`, { position: "top-center", autoClose: 2500 });
        } else {
            if (status === 401 || status === 400) {
                localStorage.removeItem('token');
                toast.error(`${data.message}`, { position: "top-center", autoClose: 2500 });
                navigate('/');
            } else {
                toast.error("Something went wrong.", { position: "top-center", autoClose: 2500 });
            }
        }
        setDeleteUser({ Id: 0, IsConfirmed: false })
    }


    return (
        <React.Fragment>
            <Button variant="primary" className="my-2" onClick={() => { handleAddWeekDay() }}>
                <FontAwesomeIcon icon={faPlus} /> Add New Week Days
            </Button>

            {weekDaysData.length > 0 ? (
                <PageTrafficTable
                    data={weekDaysData}
                    deleteUser={setDeleteUser}
                />
            ) : <h2>{errormsg}</h2>
            }
            <Modal show={deleteUser.IsConfirmed} onHide={() => setDeleteUser({ Id: 0, IsConfirmed: false })}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Are you sure you want to delete?</h5>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setDeleteUser({ Id: 0, IsConfirmed: false })}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={deleteData}>
                        Confirm Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    )
};
export default WeekDays;