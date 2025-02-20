import React from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import InputField from "../../utils/InputField";
import { postAPIData } from "../../utils/getAPIData";
import { useNavigate } from "react-router-dom";

const AddWorkout = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();
    const navigate = useNavigate();

    let token = localStorage.getItem('token');

    const submitData = async (values) => {
        const formData = new FormData();

        Object.entries(values).map((data)=>{
            if(data[0] === "image"){                
                formData.append(`${data[0]}`, data[1][0])
            }else{
                formData.append(`${data[0]}`, data[1])
            }
        })

        let { data, error, status } = await postAPIData('/addQuickworkout', formData, token);

        if (!error) {
            if (status === 201) {
                navigate('/admin/workout');
            }
        } else {
            if (status === 401) {
                localStorage.removeItem('token');
                navigate('/');
            }
        }
    }

    return (
        <Card border="light" className="bg-white shadow-sm mb-4">
            <Card.Body>
                <h5 className="mb-4">Add New Workout</h5>
                <Form onSubmit={handleSubmit(submitData)}>
                    <InputField
                        label="Workout"
                        type="text"
                        placeholder="Workout"
                        required={true}
                        {...register('quickworkoutName')}
                    />

                    <InputField
                        label="Workout Image"
                        type="file"
                        required={true}
                        {...register('image')}
                    />

                    <InputField
                        label="Description"
                        type="textarea"
                        row="3"
                        placeholder="Description"
                        required={true}
                        {...register('description')}
                    />

                    <Button variant="primary" type="submit" className="mt-4">
                        Add Workout
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    )
};
export default AddWorkout;