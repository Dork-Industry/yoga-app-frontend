import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { postAPIData } from "../../utils/getAPIData";
import { Button, Card, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import InputField from "../../utils/InputField";
import { toast } from "react-toastify";

const AddWeek = () => {
    const {
        register,
        handleSubmit
    } = useForm();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const id = searchParams.get('challengesid');
    let token = localStorage.getItem('token');

    const submitData = async (values) => {
        const formData = {
            weekName: values.weekName,
            challenges_id: id
        }

        let { data, error, status } = await postAPIData("/addWeek", formData, token);

        if (!error) {
            if (status === 201) {
                toast.success(`${data.message}`, { position: "top-center", autoClose: 2500 })
                navigate("/admin/challenges");
            }
        } else {
            if (status === 401 || status === 400) {
                localStorage.removeItem("token");
                toast.error(`${data.message}`, { position: "top-center", autoClose: 2500 })
                navigate("/");
            } else {
                toast.error("Something went wrong.", { position: "top-center", autoClose: 2500 })
            }
        }
    };

    return (
        <Card border="light" className="bg-white shadow-sm mb-4">
            <Card.Body>
                <h5 className="mb-4">Add Week</h5>
                <Form onSubmit={handleSubmit(submitData)}>
                    <InputField
                        label="Week Name"
                        type="text"
                        placeholder="Enter week name"
                        required={true}
                        {...register("weekName")}
                    />

                    <Button variant="primary" type="submit" className="mt-4">
                        Add Week
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};
export default AddWeek;