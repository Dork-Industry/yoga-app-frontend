import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageTrafficTable } from "../../components/Tables";
import { getAPIData, postAPIData } from "../../utils/getAPIData";
import { Button, Form, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import InputField from "../../utils/InputField";
import { toast } from "react-toastify";

const ChallengesExercise = () => {
    const [searchParams] = useSearchParams();
    const daysid = searchParams.get('daysid');
    const week_id = searchParams.get('weekid');
    const challenges_id = searchParams.get('challengesid');
    const [challengesExerciseData, setchallengesExerciseData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [updateUser, setUpdateUser] = useState({});
    const [deleteUser, setDeleteUser] = useState({
        Id: 0,
        IsConfirmed: false
    });
    const [errormsg, setErrormsg] = useState("")

    const navigate = useNavigate();
    let token = localStorage.getItem('token');

    const {
        register,
        handleSubmit,
        setValue
    } = useForm();

    const handleClose = () => {
        setValue('challengesName');
        setValue('description');
        setShowModal(false);
    }

    const fetchData = async () => {
        let { data, error, status } = await getAPIData(`/getExerciseByDaysId/${daysid}`, token);

        if (!error) {
            setchallengesExerciseData([]);
            if (data.challengesexercises.length > 0) {
                data.challengesexercises.map((item) => {
                    setchallengesExerciseData((prev) => [...prev, {
                        Id: item._id,
                        Image: item.exercise_Id.image,
                        Exercise_Name: item.exercise_Id.exerciseName,
                        Description: item.exercise_Id.description,
                        Exercise_Time: item.exercise_Id.exerciseTime,
                        Pro: item.isActive,
                        Action: 2
                    }])
                })
            }
        } else {
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

    const updateData = async (values) => {
        let { data, error, status } = await postAPIData(`/updateChallenges/${updateUser.Id}`, values, token);

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
        let { data, error, status } = await postAPIData(`/deleteChallengesexercise/${deleteUser.Id}`, null, token);

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


    const queryParams = new URLSearchParams({
        daysid: daysid,
        weekid: week_id,
        challengesid: challenges_id

    }).toString();

    return (
        <React.Fragment>
            <Button variant="primary" className="my-2" onClick={() => navigate(`/admin/addchallengesexercise?${queryParams}`)}>
                <FontAwesomeIcon icon={faPlus} /> Add New Challenges Exercise
            </Button>
            {challengesExerciseData.length > 0 ? <PageTrafficTable
                data={challengesExerciseData}
                handleModal={setShowModal}
                setUser={setUpdateUser}
                deleteUser={setDeleteUser}
            />
                : <h2>{errormsg}</h2>}

            <Modal show={showModal} onHide={handleClose}>
                <Form onSubmit={handleSubmit(updateData)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Challenge</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <InputField
                            type="text"
                            label="Challenge"
                            placeholder="Challenge"
                            defaultValue={updateUser?.Challenges_Name}
                            {...register('challengesName')}
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
export default ChallengesExercise;