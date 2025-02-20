import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
// import { PageTrafficTable } from "../../components/Tables";
import { getAPIData, postAPIData } from "../../utils/getAPIData";
import { Button, Card, Form, Modal } from "react-bootstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import InputField from "../../utils/InputField";

const AddQuickWorkOutExercise = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [searchParams] = useSearchParams();
    const [exercisesData, setExercisesData] = useState([]);
    const [errormsg, setErrormsg] = useState("")
    const navigate = useNavigate();
    const id = searchParams.get('quickworkoutid');
    let token = localStorage.getItem('token');

    const fetchData = async () => {
        let { data, error, status } = await getAPIData(`/exercise`, token)
        // console.log("data", data)
        if (!error) {
            setExercisesData([]);
            if (data.exercises.length > 0) {
                data.exercises.map((item) => {
                    setExercisesData((prev) => [...prev, {
                        Id: item._id,
                        Exercise_Name: item.exerciseName,
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

    const submitData = async (values) => {

        const formData = {
            quickworkout_id: id,
            exercise_ids: values.exercise_ids
        }

        let { data, error, status } = await postAPIData("/addQuickworkoutexercises", formData, token);

        if (!error) {
            if (status === 201) {
                navigate("/admin/quickworkout");
            }
        } else {
            if (status === 401) {
                localStorage.removeItem("token");
                navigate("/");
            }
        }
    };

    return (
        <Card border="light" className="bg-white shadow-sm mb-4">
            <Card.Body>
                <h5 className="mb-4">Add QuickWorkOut Exercise</h5>
                <Form onSubmit={handleSubmit(submitData)}>
                    <InputField
                        label="Select exercise"
                        type="multiselect"
                        options={exercisesData}
                        {...register("exercise_ids")}
                    />

                    <Button variant="primary" type="submit" className="mt-4">
                        Add QuickWorkOut Exercise
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};
export default AddQuickWorkOutExercise;