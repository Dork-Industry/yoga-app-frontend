import React, { useEffect, useState } from "react";
import { getAPIData, postAPIData } from "../../utils/getAPIData";
import { useNavigate } from "react-router-dom";
import { PageTrafficTable } from "../../components/Tables";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import InputField from "../../utils/InputField";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const Categories = () => {
    const [categoriesData, setCategoriesData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [updateUser, setUpdateUser] = useState({});
    const [deleteUser, setDeleteUser] = useState({
        Id: 0,
        IsConfirmed: false
    });
    const [errormsg, setErrormsg] = useState('');
    const [deactive, setDeactive] = useState(false);
    const navigate = useNavigate();
    let token = localStorage.getItem('token');

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm();

    const handleClose = () => {
        setValue('categoryName');
        setValue('description');
        setShowModal(false);
    }

    const fetchData = async () => {
        let { data, error, status } = await getAPIData('/category', token);

        if (!error) {
            setCategoriesData([]);
            if (data.categories.length > 0) {
                data.categories.map((item) => {
                    setCategoriesData((prev) => [...prev, {
                        Id: item._id,
                        Image: item.image,
                        'Meditation Styles': item.category,
                        Description: item.description,
                        View_Exercise: {
                            label: "View Exercise",
                            type: "Button",
                            navigateRoute: "/admin/categoryexercise",
                            queryparams: {
                                categoriesid: item._id,
                            },
                        },
                        Pro: item.isPro,
                        Action: 1
                    }])
                })
            } else if (data.categories.length < 1) {
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
        let { data, error, status } = await postAPIData(`/updateCategory/${updateUser.Id}`, values, token);

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
        let { data, error, status } = await postAPIData(`/deleteCategory/${deleteUser.Id}`, null, token);

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
        setDeleteUser({ Id: 0, IsConfirmed: false })
    }

    const statusChange = async (Id, Status) => {
        let { data, error, status } = await postAPIData(`/changeCategoryStatus`, {
            id: Id,
            status: Status ? 1 : 0
        }, token);

        if (!error) {
            fetchData();
        } else {
            if (status === 401) {
                localStorage.removeItem('token');
                navigate('/');
            }
        }
    }

    return (
        <React.Fragment>
            <Button variant="primary" className="my-2" onClick={() => navigate('/admin/category/add')}>
                {/* <FontAwesomeIcon icon={faPlus} /> Add New Category */}
                <FontAwesomeIcon icon={faPlus} /> Add New Meditation Styles
            </Button>
            {categoriesData.length > 0 ?
                <PageTrafficTable
                    data={categoriesData}
                    handleModal={setShowModal}
                    setUser={setUpdateUser}
                    deleteUser={setDeleteUser}
                    statusChange={statusChange}
                /> : errormsg ? <h1>{errormsg}</h1> : <Spinner animation='border' variant='primary' style={{ height: 80, width: 80 }} className="position-absolute top-50 start-50" />}

            <Modal show={showModal} onHide={handleClose}>
                <Form onSubmit={handleSubmit(updateData)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Category</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <InputField
                            type="text"
                            label="Categoty"
                            placeholder="Categoty"
                            defaultValue={updateUser?.Category}
                            errors={errors['categoryName']}
                            {...register('categoryName', { required: "Category is required." })}
                        />

                        <InputField
                            label="Description"
                            type="textarea"
                            row="3"
                            placeholder="Description"
                            defaultValue={updateUser?.Description}
                            errors={errors['description']}
                            {...register('description', { required: "Description is required." })}
                        />

                        <InputField
                            label="Category Image"
                            type="file"
                            errors={errors['image']}
                            {...register('image', {
                                required: "Category image is required.", validate: (file) => {
                                    const image = file[0];
                                    if (image.size > 100 * 1024) {
                                        return "File size must be less than 100 KB";
                                    }
                                    return true;
                                }
                            })}
                        />

                        <InputField
                            label="Selected Image"
                            type="image"
                            defaultValue={updateUser?.Image}
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
                    <Button variant="primary" onClick={deleteData} disabled={deactive}>
                        Confirm Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    )
};
export default Categories;