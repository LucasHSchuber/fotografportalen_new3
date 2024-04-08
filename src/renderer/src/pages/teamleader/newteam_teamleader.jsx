import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import flash_black from "../../assets/images/flash_black.png";
import running_black from "../../assets/images/running_black.png";
import academic_black from "../../assets/images/academic_black.png";

import Sidemenu_teamleader from "../../components/teamleader/sidemenu_teamleader";

import '../../assets/css/teamleader/main_teamleader.css';


function Newteam_teamleader() {
    // Define states
    const [projectType, setProjectType] = useState({});
    const [formData, setFormData] = useState({
        teamname: '',
        amount: 0,
        protected_id: false,
        // named_photolink: false,
        portrait: false,
        crowd: false
    });
    const [project_id, setProject_id] = useState("");


    const navigate = useNavigate();


    const handleCancel = () => {
        let project_id = localStorage.getItem("project_id");
        setProject_id(project_id);
        navigate(`/portal_teamleader/${project_id}`);
    };

    useEffect(() => {
        let project_type = localStorage.getItem("project_type");
        setProjectType(project_type);
        let project_id = localStorage.getItem("project_id");
        setProject_id(project_id);
    }, []);


    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setFormData({ ...formData, [name]: newValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let project_id = localStorage.getItem("project_id");
        console.log(project_id);
        console.log(formData);
        console.log(projectType);

        const amountNumber = parseInt(formData.amount);
        console.log(amountNumber);

        // Set boolean values to 0 if not checked
        const portraitValue = formData.portrait ? 1 : 0;
        const crowdValue = formData.crowd ? 1 : 0;
        const protectedIdValue = formData.protected_id ? 1 : 0;
        // const namedPhotolinkValue = formData.named_photolink ? 1 : 0;


        //if class (school)
        if (projectType === "school") {
            try {
                const classData = await window.api.createNewClass({
                    ...formData,
                    amount: amountNumber,
                    project_id: project_id,
                    portrait: portraitValue, 
                    crowd: crowdValue, 
                    protected_id: protectedIdValue
                    // named_photolink: namedPhotolinkValue
                });
                console.log('Class response:', classData);
                navigate(`/portal_teamleader/${project_id}`);
            } catch (error) {
                console.error('Error adding class:', error);
            }
            //if team (sport)
        } else if (projectType === "sport") {
            // try {
            //     const teamData = await window.api.addInfoToTeam({
            //         ...formData,
            //         amount: amountNumber,
            //         project_id: project_id,
            //         portrait: portraitValue, 
            //         crowd: crowdValue, 
            //         protected_id: protectedIdValue,
            //         named_photolink: namedPhotolinkValue
            //     });
            //     console.log('Team response:', teamData);

            //     navigate(`/portal_teamleader/${project_id}`);
            // } catch (error) {
            //     console.error('Error adding class:', error);
            // }

            navigate(`/portal_teamleader/${project_id}`);

        } else {
            console.log("Project type is not defined");
        }
    };



    return (
        <div className="teamleader-wrapper">

            <div className="newteam-teamleader-content">

                <div className="header mb-4">
                    <h5>{projectType === "school" ? <img className="portal-title-img mr-3" src={academic_black} alt="academic" /> : <img className="portal-title-img mr-3" src={running_black} alt="running" />}{projectType === "school" ? "Create a new class" : "Create a new team"}</h5>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <div>
                            {/* <label htmlFor="teamName">New Team:</label> */}
                            <input
                                className="form-input-field"
                                type="text"
                                id="teamname"
                                name="teamname"
                                placeholder={projectType === "school" ? "Class name" : "Team name"}
                                value={formData.teamname}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            {/* <label htmlFor="amount">Amount:</label> */}
                            <input
                                className="form-input-field"
                                type="number"
                                id="amount"
                                name="amount"
                                placeholder={projectType === "school" ? "Amount of students" : "Amount of players"}
                                value={formData.amount}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="checkbox-container">
                        <label>
                            <input
                                className="checkmark mr-2"
                                type="checkbox"
                                name="portrait"
                                checked={formData.portrait}
                                onChange={handleChange}
                            />
                            I took portraits
                        </label>
                    </div>
                    <div className="checkbox-container">
                        <label>
                            <input
                                className="checkmark mr-2"
                                type="checkbox"
                                name="crowd"
                                checked={formData.crowd}
                                onChange={handleChange}
                            />
                            I took group photo
                        </label>
                    </div>
                    <div className="checkbox-container">
                        <label>
                            <input
                                className="checkmark mr-2"
                                type="checkbox"
                                name="protected_id"
                                checked={formData.protected_id}
                                onChange={handleChange}
                            />
                            There were people with protected ID
                        </label>
                    </div>
                    {/* <div className="checkbox-container">
                        <label>
                            <input
                                className="checkmark mr-2"
                                type="checkbox"
                                name="named_photolink"
                                checked={formData.named_photolink}
                                onChange={handleChange}
                            />
                            All people are named in photolink
                        </label>
                    </div> */}

                    <button className="button cancel fixed-width fixed-height mr-1" onClick={handleCancel}>Cancel</button>
                    <button className="button standard fixed-width fixed-height" type="submit">Save</button>
                </form>

            </div>

            <Sidemenu_teamleader />
        </div>
    );
}
export default Newteam_teamleader;