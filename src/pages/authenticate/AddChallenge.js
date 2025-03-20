import React, { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import InputField from "../../utils/InputField";
import { postAPIData } from "../../utils/getAPIData";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddChallenge = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();
    const [deactive, setDeactive] = useState(false);
    const navigate = useNavigate();

    let token = localStorage.getItem("token");

    const submitData = async (values) => {
        const formData = new FormData();
        setDeactive(true);

        Object.entries(values).map((data) => {
            if (data[0] === "image") {
                formData.append(`${data[0]}`, data[1][0])
            } else {
                formData.append(`${data[0]}`, data[1])
            }
        })

        let { data, error, status } = await postAPIData("/addChallenges", formData, token);

        if (!error) {
            if (status === 201) {
                toast.success(`${data.message}`, { position: "top-center", autoClose: 2500 })
                navigate("/admin/challenges");
            }
        } else {
            if (status === 401) {
                localStorage.removeItem("token");
                toast.error(`${data.message}`, { position: "top-center", autoClose: 2500 });
                navigate("/");
            } else if (status === 400) {
                toast.error(`${data.message}`, { position: "top-center", autoClose: 2500 });
            } else {
                toast.error("Something went wrong.", { position: "top-center", autoClose: 2500 })
            }
        }
    };

    return (
        <Card border="light" className="bg-white shadow-sm mb-4">
            <Card.Body>
                <h5 className="mb-4">Add Challenges</h5>
                <Form onSubmit={handleSubmit(submitData)}>
                    <InputField
                        label="Challenges Name"
                        type="text"
                        placeholder="Enter your challenge name"
                        errors={errors['challengesName']}
                        {...register("challengesName", { required: "Challenge name is required." })}
                    />

                    <InputField
                        label="Challenges Image"
                        type="file"
                        errors={errors['image']}
                        {...register("image", { required: "Challenge image is required." })}
                    />

                    <InputField
                        label="Description"
                        type="textarea"
                        row="3"
                        placeholder="Description"
                        errors={errors['description']}
                        {...register("description", { required: "Description is required." })}
                    />

                    <Button variant="primary" type="submit" className="mt-4" disabled={deactive}>
                        Add Challenges
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};
export default AddChallenge;
