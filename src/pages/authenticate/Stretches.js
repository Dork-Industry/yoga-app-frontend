import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAPIData, postAPIData } from "../../utils/getAPIData";
import { Button, Form, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { PageTrafficTable } from "../../components/Tables";
import { useForm } from "react-hook-form";
import InputField from "../../utils/InputField";
import { toast } from "react-toastify";

const Stretches = () => {
    const [stretchesData, setStretchesData] = useState([]);
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
        setValue('stretchesName');
        setValue('description');
        setShowModal(false);
    }

    const fetchData = async () => {
        let { data, error, status } = await getAPIData('/stretches', token);

        if (!error) {
            setStretchesData([]);
            if (data.stretchess.length > 0) {
                data.stretchess.map((item) => {
                    setStretchesData((prev) => [...prev, {
                        Id: item._id,
                        Image: item.image,
                        Stretches: item.stretches,
                        Description: item.description,
                        View_Exercise: {
                            label: "View Exercise",
                            type: "Button",
                            navigateRoute: "/admin/StretchesExercise",
                            queryparams: {
                                stretchesid: item._id,
                            },
                        },
                        Pro: item.isActive,
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
        let { data, error, status } = await postAPIData(`/updateStretches/${updateUser.Id}`, values, token);

        if (!error) {
            toast.success("Update was successful!", { position: "top-center", autoClose: 2500 })
            fetchData();
        } else {
            if (status === 401 || status === 400) {
                localStorage.removeItem('token');
                
                navigate('/');
            }
        }
        setShowModal(false);
    }

    const deleteData = async () => {
        let { data, error, status } = await postAPIData(`/deleteStretches/${deleteUser.Id}`, null, token);
        
        if (!error) {
            fetchData();
            toast.error(`${data.message}`, { position: "top-center", autoClose: 2500 });
        } else {
            if (status === 401 || status === 400) {
                localStorage.removeItem('token');
                toast.error(`${data.message}`, { position: "top-center", autoClose: 2500 });
                navigate('/');
            }else{
                toast.error("Something went wrong.", { position: "top-center", autoClose: 2500 });
            }
        }
        setDeleteUser({ Id: 0, IsConfirmed: false })
    }

    const statusChange = async (Id, Status) => {
        let { data, error, status } = await postAPIData(`/changeStretchesStatus`, {
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
            <Button variant="primary" className="my-2" onClick={() => navigate('/admin/stretches/add')}>
                <FontAwesomeIcon icon={faPlus} /> Add New Stretches
            </Button>
            {stretchesData.length > 0 && <PageTrafficTable data={stretchesData} handleModal={setShowModal} setUser={setUpdateUser} deleteUser={setDeleteUser} statusChange={statusChange} />}

            <Modal show={showModal} onHide={handleClose}>
                <Form onSubmit={handleSubmit(updateData)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Stretches</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <InputField
                            type="text"
                            label="Stretches"
                            placeholder="Stretches"
                            defaultValue={updateUser?.Stretches}
                            {...register('stretchesName')}
                        />

                        <InputField
                            label="Description"
                            type="textarea"
                            row="3"
                            placeholder="Description"
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
export default Stretches;