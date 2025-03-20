import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageTrafficTable } from "../../components/Tables";
import { getAPIData, postAPIData } from "../../utils/getAPIData";
import { Button, Modal, Spinner, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import InputField from "../../utils/InputField";

const Weeks = () => {
    const [weekData, setWeeksData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [updateUser, setUpdateUser] = useState({});
    const [deleteUser, setDeleteUser] = useState({
        Id: 0,
        IsConfirmed: false
    });
    const [errormsg, setErrormsg] = useState("")
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const id = searchParams.get('challengesid');
    let token = localStorage.getItem('token');

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm();

    const handleClose = () => {
        setValue('weekName');
        setShowModal(false);
    }

    const fetchData = async () => {
        let { data, error, status } = await getAPIData(`/getWeeksByChallengesId/${id}`, token)

        if (!error) {
            setWeeksData([]);
            if (data.weeks.length > 0) {
                data.weeks.map((item) => {
                    setWeeksData((prev) => [...prev, {
                        Id: item._id,
                        Challenges_Name: item.challenges_Id.challengesName,
                        Week_Name: item.weekName,
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
                setWeeksData([]);
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

    const updateData = async (values) => {
        let { data, error, status } = await postAPIData(`/updateWeek/${updateUser.Id}`, values, token);
        if (!error) {
            toast.success("Update was successful!", { position: "top-center", autoClose: 2500 })
            fetchData();
        } else {
            if (status === 401) {
                localStorage.removeItem('token');
                toast.error(`${data.message}`, { position: "top-center", autoClose: 2500 })
                navigate('/');
            } else if (status === 400) {
                toast.error(`${data.message}`, { position: "top-center", autoClose: 2500 })
            } else {
                toast.error("Something went wrong.", { position: "top-center", autoClose: 2500 })
            }
        }
        handleClose();
    }

    const deleteData = async () => {
        let { data, error, status } = await postAPIData(`/deleteWeek/${deleteUser.Id}`, null, token);

        if (!error) {
            fetchData();
            toast.error(`${data.message}`, { position: "top-center", autoClose: 2500 })
        } else {
            if (status === 401) {
                localStorage.removeItem('token');
                toast.error(`${data.message}`, { position: "top-center", autoClose: 2500 });
                navigate('/');
            } else if (status === 400) {
                toast.error(`${data.message}`, { position: "top-center", autoClose: 2500 });
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

            {weekData.length > 0 ?
                <PageTrafficTable data={weekData} handleModal={setShowModal} setUser={setUpdateUser} deleteUser={setDeleteUser} /> :
                errormsg ? <h2>{errormsg}</h2> :
                    <Spinner animation='border' variant='primary' style={{ height: 80, width: 80 }} className="position-absolute top-50 start-50" />}

            <Modal show={showModal} onHide={handleClose}>
                <Form onSubmit={handleSubmit(updateData)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Week Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <InputField
                            type="text"
                            label="Week Name"
                            placeholder="Enter week name"
                            defaultValue={updateUser?.Week_Name}
                            errors={errors['weekName']}
                            {...register('weekName', { required: "Week name is required." })}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

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