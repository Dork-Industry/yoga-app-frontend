import { Button, Card, Form } from "react-bootstrap";
import InputField from "../../utils/InputField";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postAPIData } from "../../utils/getAPIData";
import { toast } from "react-toastify";

const AddPlan = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();
    const [deactive, setDeactive] = useState(false);
    const navigate = useNavigate();

    let token = localStorage.getItem('token');

    const submitData = async (values) => {
        setDeactive(true);
        let { data, error, status } = await postAPIData('/addplan', values, token);

        if (!error) {
            if (status === 201) {
                toast.success(`${data.message}`, { position: "top-center", autoClose: 2500 })
                navigate('/admin/plan');
            }
        } else {
            if (status === 401) {
                localStorage.removeItem('token');
                toast.error(`${data.message}`, { position: "top-center", autoClose: 2500 })
                navigate('/');
            } else if (status === 400) {
                toast.error(`${data.message}`, { position: "top-center", autoClose: 2500 })
            } else {
                toast.error("Something went wrong.", { position: "top-center", autoClose: 2500 })
            }
        }
    }

    return (
        <Card border="light" className="bg-white shadow-sm mb-4">
            <Card.Body>
                <h5 className="mb-4">Add New Plan</h5>
                <Form onSubmit={handleSubmit(submitData)}>
                    <InputField
                        label="Plan Name"
                        type="text"
                        placeholder="Plan Name"
                        errors={errors['planName']}
                        {...register('planName', { required: "Plan is required." })}
                    />

                    <InputField
                        label="Price"
                        type="number"
                        placeholder="Price"
                        errors={errors['price']}
                        {...register('price', { required: "Price is required." })}
                    />

                    <InputField
                        label="Months"
                        type="number"
                        placeholder="Months"
                        errors={errors['months']}
                        {...register('months', { required: "Month is required." })}
                    />

                    <InputField
                        label="SKU ID Android"
                        type="text"
                        placeholder="SKU ID Android"
                        errors={errors['sku_id_android']}
                        {...register('sku_id_android', { required: "SKU ID - ANDROID is required." })}
                    />

                    <InputField
                        label="SKU ID IOS"
                        type="text"
                        placeholder="SKU ID IOS"
                        errors={errors['sku_id_ios']}
                        {...register('sku_id_ios', { required: "SKU ID - IOS is required." })}
                    />
                    <Button variant="primary" type="submit" className="mt-4" disabled={deactive}>
                        Add Plan
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    )
};

export default AddPlan;