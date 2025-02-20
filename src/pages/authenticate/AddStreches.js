import React from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import InputField from "../../utils/InputField";
import { postAPIData } from "../../utils/getAPIData";
import { useNavigate } from "react-router-dom";

const AddStretches = () => {
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

        let { data, error, status } = await postAPIData('/addStretches', formData, token);

        if (!error) {
            if (status === 201) {
                navigate('/admin/stretches');
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
                <h5 className="mb-4">Add New Stretches</h5>
                <Form onSubmit={handleSubmit(submitData)}>
                    <InputField
                        label="Stretches"
                        type="text"
                        placeholder="Stretches"
                        required={true}
                        {...register('stretchesName')}
                    />

                    <InputField
                        label="Stretches Image"
                        type="file"
                        required={true}
                        {...register('image')}
                    />

                    <InputField
                        label="Description"
                        type="textarea"
                        row="5"
                        placeholder="Description..."
                        required={true}
                        {...register('description')}
                    />

                    <Button variant="primary" type="submit" className="mt-4">
                        Add Stretches
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    )
};
export default AddStretches;