import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageTrafficTable } from "../../components/Tables";
import { getAPIData, postAPIData } from "../../utils/getAPIData";
import { Button, Modal, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const QuickWorkOutExercise = () => {
    const [quickWorkOutExercise, setQuickWorkOutExercise] = useState([]);
    const [searchParams] = useSearchParams();
    const [errormsg, setErrormsg] = useState("")
    const [deleteUser, setDeleteUser] = useState({
        Id: 0,
        IsConfirmed: false
    });
    const [deactive, setDeactive] = useState(false);
    const navigate = useNavigate();
    const quickworkout_id = searchParams.get('quickworkoutid');
    let token = localStorage.getItem('token');

    const fetchData = async () => {
        let { data, error, status } = await getAPIData(`/getExerciseByQuickworkoutId/${quickworkout_id}`, token);

        if (!error) {
            setQuickWorkOutExercise([]);
            if (data.quickworkoutexercises.length > 0) {
                data.quickworkoutexercises.map((item) => {
                    setQuickWorkOutExercise((prev) => [...prev, {
                        Id: item._id,
                        Image: item.exercise_Id.image,
                        Exercise_Name: item.exercise_Id.exerciseName,
                        Description: item.exercise_Id.description,
                        Exercise_Time: item.exercise_Id.exerciseTime,
                        Pro: item.isActive,
                        Action: 2
                    }])
                })
            } else if (data.quickworkoutexercises.length < 1) {
                setErrormsg(data.message);
            }
        } else {
            setQuickWorkOutExercise([]);
            if (status === 401) {
                localStorage.removeItem('token');
                navigate('/');
            } else if (status === 400) {
                setErrormsg(' ');
                toast.error(`${data.message}`, { position: "top-center", autoClose: 2500 })
            } else {
                setErrormsg(' ');
                toast.error("Something went wrong.", { position: "top-center", autoClose: 2500 })
            }
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const deleteData = async () => {
        setDeactive(true);
        let { data, error, status } = await postAPIData(`/deleteQuickworkoutexercise/${deleteUser.Id}`, null, token);

        if (!error) {
            fetchData();
            toast.error(`${data.message}`, { position: "top-center", autoClose: 2500 });
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
        setDeleteUser({ Id: 0, IsConfirmed: false })
    }


    const queryParams = new URLSearchParams({
        quickworkoutid: quickworkout_id,
    }).toString();

    const statusChange = async (Id, Status) => {
        let { data, error, status } = await postAPIData(`/changeQuickworkoutexerciseStatus`, {
            id: Id,
            status: Status ? 1 : 0
        }, token);

        if (!error) {
            fetchData();
        } else {
            if (status === 401) {
                localStorage.removeItem('token');
                navigate('/');
            }
        }
    }

    return (
        <React.Fragment>
            <Button variant="primary" className="my-2" onClick={() => navigate(`/admin/addquickworkoutexercise?${queryParams}`)}>
                <FontAwesomeIcon icon={faPlus} /> Add New QuickWorkOut Exercise
            </Button>
            {quickWorkOutExercise.length > 0 ?
                <PageTrafficTable
                    data={quickWorkOutExercise}
                    deleteUser={setDeleteUser}
                    statusChange={statusChange}
                /> : errormsg ? <h2>{errormsg}</h2> : <Spinner animation='border' variant='primary' style={{ height: 80, width: 80 }} className="position-absolute top-50 start-50" />}

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
                    <Button variant="primary" onClick={deleteData} disabled={deactive}>
                        Confirm Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    )
};
export default QuickWorkOutExercise;