import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { PageTrafficTable } from "../../components/Tables";
import InputField from "../../utils/InputField";
import { getAPIData, postAPIData } from "../../utils/getAPIData";
import { toast } from "react-toastify";

const Plan = () => {
    const [planListData, setPlanListData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [updatePlan, setUpdatePlan] = useState({});
    const [deletePlan, setDeletePlan] = useState({
        Id: 0,
        IsConfirmed: false
    });
    const [deactive, setDeactive] = useState(false);
    const [errormsg, setErrormsg] = useState('');
    const navigate = useNavigate();
    let token = localStorage.getItem('token');

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm();

    const handleClose = () => {
        setValue('planName');
        setValue('price');
        setValue('months');
        setValue('sku_id_android');
        setValue('sku_id_ios');
        setShowModal(false);
    }

    const fetchData = async () => {
        let { data, error, status } = await getAPIData('/plan', token);

        if (!error) {
            setPlanListData([]);
            if (data.plan.length > 0) {
                data.plan.map((item) => {
                    setPlanListData((prev) => [...prev, {
                        Id: item._id,
                        PlanName: item.plan_name,
                        Price: item.price,
                        Months: item.months,
                        SKU_ID_Android: item.sku_id_android,
                        SKU_ID_IOS: item.sku_id_ios,
                        Action: 1
                    }])
                })
            } else if (data.plan.length < 1) {
                setErrormsg(data.message);
            }
        } else {
            if (status === 401) {
                localStorage.removeItem('token');
                toast.error(`${data.message}`, { position: "top-center", autoClose: 2500 });
                navigate('/');
            } else {
                setErrormsg(' ');
                toast.error("Something went wrong.", { position: "top-center", autoClose: 2500 });
            }
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const updateData = async (values) => {
        let { data, error, status } = await postAPIData(`/updatePlan/${updatePlan.Id}`, values, token);

        if (!error) {
            toast.success("Update was successful!", { position: "top-center", autoClose: 2500 });
            fetchData();
        } else {
            if (status === 401) {
                localStorage.removeItem('token');
                toast.error(`${data.message}`, { position: "top-center", autoClose: 2500 });
                navigate('/');
            } else if (status === 400) {
                toast.error(`${data.message}`, { position: "top-center", autoClose: 2500 });
            } else {
                toast.error("Something went wrong.", { position: "top-center", autoClose: 2500 });
            }
        }
        handleClose();
    }

    const deleteData = async () => {
        setDeactive(true);
        let { data, error, status } = await postAPIData(`/deletePlan/${deletePlan.Id}`, null, token);

        if (!error) {
            fetchData();
            toast.error(`${data.message}`, { position: "top-center", autoClose: 2500 })
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
        setDeletePlan({ Id: 0, IsConfirmed: false })
    }

    return (
        <React.Fragment>
            <Button variant="primary" className="my-2" onClick={() => navigate('/admin/plan/add')}>
                <FontAwesomeIcon icon={faPlus} /> Add New Plan
            </Button>

            {planListData.length > 0 ?
                <PageTrafficTable
                    data={planListData}
                    handleModal={setShowModal}
                    setUser={setUpdatePlan}
                    deleteUser={setDeletePlan}
                /> : errormsg ? <h1>{errormsg}</h1> : <Spinner animation='border' variant='primary' style={{ height: 80, width: 80 }} className="position-absolute top-50 start-50" />}

            <Modal show={showModal} onHide={handleClose}>
                <Form onSubmit={handleSubmit(updateData)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Plan</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <InputField
                            type="text"
                            label="Plan Name"
                            placeholder="Plan Name"
                            defaultValue={updatePlan?.PlanName}
                            errors={errors['planName']}
                            {...register('planName', { required: "Plan is required." })}
                        />

                        <InputField
                            label="Price"
                            type="number"
                            placeholder="Price"
                            defaultValue={updatePlan?.Price}
                            errors={errors['price']}
                            {...register('price', { required: "Price is required." })}
                        />

                        <InputField
                            label="Months"
                            type="number"
                            placeholder="Months"
                            defaultValue={updatePlan?.Months}
                            errors={errors['months']}
                            {...register('months', { required: "Month is required." })}
                        />

                        <InputField
                            label="SKU ID Android"
                            type="text"
                            placeholder="SKU ID Android"
                            defaultValue={updatePlan?.SKU_ID_Android}
                            errors={errors['sku_id_android']}
                            {...register('sku_id_android', { required: "SKU ID - ANDROID is required." })}
                        />

                        <InputField
                            label="SKU ID IOS"
                            type="text"
                            placeholder="SKU ID IOSe"
                            defaultValue={updatePlan?.SKU_ID_IOS}
                            errors={errors['sku_id_ios']}
                            {...register('sku_id_ios', { required: "SKU ID - IOS is required." })}
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

            <Modal show={deletePlan.IsConfirmed} onHide={() => setDeletePlan({ Id: 0, IsConfirmed: false })}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Are you sure you want to delete?</h5>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setDeletePlan({ Id: 0, IsConfirmed: false })}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={deleteData} disabled={deactive}>
                        Confirm Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    )
};

export default Plan;