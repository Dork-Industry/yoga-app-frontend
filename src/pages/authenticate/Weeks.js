import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageTrafficTable } from "../../components/Tables";
import { getAPIData, postAPIData } from "../../utils/getAPIData";
import { Button, Form, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import InputField from "../../utils/InputField";

const Weeks = () => {


    const [weekData, setWeeksData] = useState([]);
    const [errormsg, setErrormsg] = useState("")
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const id = searchParams.get('challengesid');
    let token = localStorage.getItem('token');


    const fetchData = async () => {
        let { data, error, status } = await getAPIData(`/getWeeksByChallengesId/${id}`, token)
        // console.log("data", data)
        if (!error) {
            setWeeksData([]);
            if (data.weeks.length > 0) {
                data.weeks.map((item) => {
                    setWeeksData((prev) => [...prev, {
                        Id: item._id,
                        'Challenges Name': item.challenges_Id.challengesName,
                        'Week Name': item.weekName,
                        VIEW_DAYS: {
                            label: "View Days",
                            type: "Button",
                            navigateRoute: "/admin/weekdays",
                            queryparams: {
                                weekid : item._id,
                                challengesid : id,
                            },
                            
                        },
                        Action: 1
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

    const queryParams = new URLSearchParams({
        challengesid: id,
       
      }).toString();


    return (
        <React.Fragment>
            <Button variant="primary" className="my-2" onClick={() => navigate(`/admin/addweek?${queryParams}`)}>
                <FontAwesomeIcon icon={faPlus} /> Add New Week
            </Button>

            {weekData.length > 0 ? <PageTrafficTable
                data={weekData}
            // handleModal={setShowModal} 
            // setUser={setUpdateUser} 
            // deleteUser={setDeleteUser}
            /> : <h2>{errormsg}</h2>
            }
        </React.Fragment>
    )
};
export default Weeks;