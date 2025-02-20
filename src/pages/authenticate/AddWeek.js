import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
// import { PageTrafficTable } from "../../components/Tables";
import { postAPIData } from "../../utils/getAPIData";
import { Button, Card, Form, Modal } from "react-bootstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import InputField from "../../utils/InputField";

const AddWeek = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
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
                navigate("/admin/challenges");
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