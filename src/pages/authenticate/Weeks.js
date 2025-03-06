import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageTrafficTable } from "../../components/Tables";
import { getAPIData, postAPIData } from "../../utils/getAPIData";
import { Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const Weeks = () => {
    const [weekData, setWeeksData] = useState([]);
    const [deleteUser, setDeleteUser] = useState({
        Id: 0,
        IsConfirmed: false
    });
    const [errormsg, setErrormsg] = useState("")
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const id = searchParams.get('challengesid');
    let token = localStorage.getItem('token');


    const fetchData = async () => {
        let { data, error, status } = await getAPIData(`/getWeeksByChallengesId/${id}`, token)

        if (!error) {
            setWeeksData([]);
            if (data.weeks.length > 0) {
                data.weeks.map((item) => {
                    setWeeksData((prev) => [...prev, {
                        Id: item._id,
                        'Challenges Name': item.challenges_Id.challengesName,
                        'Week Name': item.weekName,
                        VIEW_DAYS: {
                            label: "View Days",
                            type: "Button",
                            navigateRoute: "/admin/weekdays",
                            queryparams: {
                                weekid: item._id,
                                challengesid: id,
                            },

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
        challengesid: id,
    }).toString();


    const deleteData = async () => {
        let { data, error, status } = await postAPIData(`/deleteWeek/${deleteUser.Id}`, null, token);

        if (!error) {
            fetchData();
            toast.error(`${data.message}`, { position: "top-center", autoClose: 2500 })
        } else {
            if (status === 401 || status === 400) {
                localStorage.removeItem('token');
                toast.error(`${data.message}`, { position: "top-center", autoClose: 2500 })
                navigate('/');
            } else {
                toast.error("Something went wrong.", { position: "top-center", autoClose: 2500 })
            }
        }
        setDeleteUser({ Id: 0, IsConfirmed: false })
    }

    return (
        <React.Fragment>
            <Button variant="primary" className="my-2" onClick={() => navigate(`/admin/addweek?${queryParams}`)}>
                <FontAwesomeIcon icon={faPlus} /> Add New Week
            </Button>

            {weekData.length > 0 ? (
                <PageTrafficTable
                    data={weekData}
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
export default Weeks;