import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAPIData, postAPIData } from "../../utils/getAPIData";
import { PageTrafficTable } from "../../components/Tables";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import InputField from "../../utils/InputField";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const Exercise = () => {
    const [exerciseData, setExerciseData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [updateUser, setUpdateUser] = useState({});
    const [deleteUser, setDeleteUser] = useState({
        Id: 0,
        IsConfirmed: false
    });
    const [errormsg, setErrormsg] = useState('');
    const navigate = useNavigate();
    let token = localStorage.getItem('token');

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm();

    const handleClose = () => {
        setValue('exerciseName');
        setValue('exerciseTime');
        setValue('description');
        setShowModal(false);
    }

    const fetchData = async () => {
        let { data, error, status } = await getAPIData('/exercise', token);

        if (!error) {
            setExerciseData([]);
            if (data.exercises.length > 0) {
                data.exercises.map((item) => {
                    setExerciseData((prev) => [...prev, {
                        Id: item._id,
                        Image: item.image,
                        Exercise_Name: item.exerciseName,
                        Description: item.description,
                        Exercise_Time: item.exerciseTime,
                        Active: item.isActive,
                        Action: 1
                    }])
                })
            } else if (data.exercises.length < 1) {
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
    }

    useEffect(() => {
        fetchData();
    }, []);

    const updateData = async (values) => {
        values['description'] = values['description'] === undefined ? '' : values['description'];
        let { data, error, status } = await postAPIData(`/updateExercise/${updateUser.Id}`, values, token);

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
        let { data, error, status } = await postAPIData(`/deleteExercise/${deleteUser.Id}`, null, token);

        if (!error) {
            fetchData();
            toast.error(`${data.message}`, { position: "top-center", autoClose: 2500 })
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
        setDeleteUser({ Id: 0, IsConfirmed: false })
    }

    const statusChange = async (Id, Status) => {
        let { data, error, status } = await postAPIData(`/changeExerciseStatus`, {
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
            <Button variant="primary" className="my-2" onClick={() => navigate('/admin/exercise/add')}>
                <FontAwesomeIcon icon={faPlus} /> Add New Exercise
            </Button>
            {exerciseData.length > 0 ?
                <PageTrafficTable
                    data={exerciseData}
                    handleModal={setShowModal}
                    setUser={setUpdateUser}
                    deleteUser={setDeleteUser}
                    statusChange={statusChange}
                /> : errormsg ? <h1>{errormsg}</h1> : <Spinner animation='border' variant='primary' style={{ height: 80, width: 80 }} className="position-absolute top-50 start-50" />}
            <Modal show={showModal} onHide={handleClose}>
                <Form onSubmit={handleSubmit(updateData)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Exercise</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <InputField
                            type="text"
                            label="Exercise Name"
                            placeholder="Enter exercise name"
                            defaultValue={updateUser?.Exercise_Name}
                            errors={errors['exerciseName']}
                            {...register('exerciseName', { required: "Exercise name is required." })}
                        />

                        <InputField
                            label="Exercise Time (in minutes)"
                            type="number"
                            placeholder="0"
                            min={0}
                            defaultValue={updateUser?.Exercise_Time}
                            {...register('exerciseTime')}
                        />

                        {/* <InputField
                            label="Exercise Image"
                            type="file"
                            errors={errors['image']}
                            {...register('image', { required: "Exercise image is required." })}
                        />

                        <InputField
                            label="Exercise Video"
                            type="file"
                            errors={errors['video']}
                            accept="video/mp4,video/x-m4v,video/*"
                            {...register('video', { required: "Exercise video is required." })}
                        /> */}

                        <InputField
                            label="Selected Image"
                            type="image"
                            defaultValue={updateUser?.Image}
                        />

                        <InputField
                            label="Selected Video"
                            type="video"
                            defaultValue={updateUser?.Video}
                        />

                        <InputField
                            type="rte"
                            label="Description"
                            setValue={setValue}
                            defaultValue={updateUser?.Description}
                            errors={errors['description']}
                            {...register('description', { required: "Description is required." })}
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
export default Exercise;