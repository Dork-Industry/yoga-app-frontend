import React from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import InputField from "../../utils/InputField";
import { postAPIData } from "../../utils/getAPIData";
import { useNavigate } from "react-router-dom";

const AddExercise = () => {
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
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

        let { data, error, status } = await postAPIData('/addexercise', formData, token);

        if (!error) {
            if (status === 201) {
                navigate('/admin/exercise');
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
                <h5 className="mb-4">Add Exercise</h5>
                <Form onSubmit={handleSubmit(submitData)}>
                    <InputField
                        label="Exercise Name"
                        type="text"
                        placeholder="Enter your exercise name"
                        required={true}
                        {...register('exerciseName')}
                    />

                    <InputField
                        label="Exercise Image"
                        type="file"
                        required={true}
                        {...register('image')}
                    />

                    <InputField
                        label="Exercise Time (in minutes)"
                        type="number"
                        placeholder="0"
                        min={0}
                        required={true}
                        {...register('exerciseTime')}
                    />

                    <InputField
                        label="Description"
                        type="rte"
                        required={true}
                        setValue={setValue}
                        {...register('description')}
                    />

                    <Button variant="primary" type="submit" className="mt-4">
                        Add Exercise
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    )
};
export default AddExercise;