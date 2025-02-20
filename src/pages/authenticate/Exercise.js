import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAPIData, postAPIData } from "../../utils/getAPIData";
import { PageTrafficTable } from "../../components/Tables";
import { Button, Form, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import InputField from "../../utils/InputField";
import { useForm } from "react-hook-form";

const Exercise = () => {
    const [exerciseData, setExerciseData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [updateUser, setUpdateUser] = useState({});
    const [deleteUser, setDeleteUser] = useState({
        Id: 0,
        IsConfirmed: false
    });
    const navigate = useNavigate();
    let token = localStorage.getItem('token');

    const {
        register,
        handleSubmit,
        setValue
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
            }
        } else {
            if (status === 401) {
                localStorage.removeItem('token');
                navigate('/');
            }
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const updateData = async (values) => {
        let { data, error, status } = await postAPIData(`/updateExercise/${updateUser.Id}`, values, token);
        
        if (!error) {
            fetchData();
        } else {
            if (status === 401) {
                localStorage.removeItem('token');
                navigate('/');
            }
        }
        setShowModal(false);
    }

    const deleteData = async () => {
        let { data, error, status } = await postAPIData(`/deleteExercise/${deleteUser.Id}`, null, token);

        if (!error) {
            fetchData();
        } else {
            if (status === 401) {
                localStorage.removeItem('token');
                navigate('/');
            }
        }
        setDeleteUser({ Id: 0, IsConfirmed: false })
    }

    const statusChange = async (Id,Status) => {
        let {data, error, status} = await postAPIData(`/changeExerciseStatus`,{
            id: Id,
            status: Status ? 1 : 0
        }, token);

        if(!error){
            fetchData();
        }else{
            if (status === 401) {
                localStorage.removeItem('token');
                navigate('/');
            }
        }
    }

    return (
        <React.Fragment>
            <Button variant="primary" className="my-2" onClick={() => navigate('/admin/exercise/add')}>
                <FontAwesomeIcon icon={faPlus} /> Add New Exercise
            </Button>
            {exerciseData.length > 0 && <PageTrafficTable data={exerciseData} handleModal={setShowModal} setUser={setUpdateUser} deleteUser={setDeleteUser} statusChange={statusChange}/>}

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
                            {...register('exerciseName')}
                        />

                        <InputField
                            label="Exercise Time (in minutes)"
                            type="number"
                            placeholder="0"
                            defaultValue={updateUser?.Exercise_Time}
                            {...register('exerciseTime')}
                        />

                        <InputField
                            type="rte"
                            label="Description"
                            setValue={setValue}
                            defaultValue={updateUser?.Description}
                            {...register('description')}
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