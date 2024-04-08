import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import more_black from "../../assets/images/more_black.png";
import running from "../../assets/images/running.png";
import academic from "../../assets/images/academic.png";

import NewProjectModal from "../../components/teamleader/newprojectModal";
import Sidemenu_teamleader from "../../components/teamleader/sidemenu_teamleader";


import fetchProjectsByLang from '../../assets/js/fetchProjectsByLang';

import '../../assets/css/teamleader/main_teamleader.css';


function Newproject_teamleader() {
    // Define states
    const [projectName, setProjectName] = useState('');
    const [type, setType] = useState('');
    const [project_uuid, setProject_uuid] = useState('');

    const [isSelectedType1, setIsSelectedType1] = useState(false);
    const [isSelectedType2, setIsSelectedType2] = useState(false);

    const [_projects, set_Projects] = useState([]);


    const navigate = useNavigate();



    //fetch all projects from big(express-bild) database - if not working, fetch from  sqlite table 
    useEffect(() => {
        const fetchData = async () => {
            const user_lang = localStorage.getItem("user_lang");
            console.log(user_lang);

            try {

                const projects = await fetchProjectsByLang(user_lang);
                set_Projects(projects.result);
                console.log('Projects:', projects.result);

            } catch (error) {
                console.error('Error fetching projects by language from big database:', error);

                const response = await window.api.get_Projects(user_lang);
                console.log('Create Projects Response:', response);

                if (response.statusCode === 1) {
                    if (response.projects.length > 0) {
                        set_Projects(response.projects);
                        console.log('Projects fetched successfully');
                    } else {
                        console.log('No projects found for the specified language.');
                    }
                } else {
                    console.error('Error fetching projects:', response.errorMessage);
                }

            }
        };

        fetchData();
    }, []);




    const handleProjectChange = (value) => {
        setProjectName(value);
        console.log(projectName);

    };


    const findUuid = (projectName) => {
        const selectedProject = _projects.find(project => project.projectname === projectName);
        if (selectedProject) {
            let _uuid = selectedProject.project_uuid;
            setProject_uuid(_uuid);
        }
    }

    const handleSubmit = (e) => {

        e.preventDefault();

        findUuid(projectName)

        console.log('Selected project:', projectName);
        console.log('Selected type:', type);
        console.log('Selected project uuid:', project_uuid);

        const confirmationMessage = `Create new project: ${projectName}\n\n`;

        if (window.confirm(confirmationMessage)) {
            CreateNewProject();

        } else {
            // Handle cancellation here
            console.log('Creation canceled.');
        }
    };


    const CreateNewProject = async () => {
        try {

            if (!projectName || !type || !project_uuid) {
                throw new Error('Project name, type, and project_uuid are required.');
            }

            const response = await window.api.checkProjectExists(project_uuid);
            console.log('Project already exists - response:', response);

            if (response && response.statusCode === 1) {
                console.log('Project exists:', response.projectname);
                return true; // Project exists
            } else {
                console.log('Project does not exist.');

                let user_id = localStorage.getItem("user_id");
                const args = {
                    projectname: projectName,
                    type: type,
                    project_uuid: project_uuid,
                    user_id: user_id
                };

                const response = await window.api.createNewProject(args);
                console.log('Create New Projects Response:', response);

                if (response && response.success) {
                    console.log('Project created successfully');

                    //get latest tuppel in projects-table
                    const latestProjectResponse = await window.api.getLatestProject(project_uuid);
                    console.log('Check Latest Project Response:', latestProjectResponse);
                    //store the project_id in session_storage
                    sessionStorage.setItem("project_id", latestProjectResponse.project_id);
                    navigate(`/portal_teamleader/${latestProjectResponse.project_id}`);
                    
                } else {
                    console.error('Error creating project:', response?.error || 'Unknown error');
                }


            }
        } catch (error) {
            console.error('Error checking project existence:', error);
            return false; // Error occurred, assume project doesn't exist
        }
        // try {
        //     if (!projectName || !type || !project_uuid) {
        //         throw new Error('Project name, type, and uuid are required.');
        //     }

        //     // Check if a project with the given project_uuid already exists
        //     const response = await window.api.checkProjectExists(project_uuid);
        //     console.log('Check Project Exists Response:', response);

        //     if (!exists) {
        //         let user_id = localStorage.getItem("user_id");
        //         const args = {
        //             projectname: projectName,
        //             type: type,
        //             project_uuid: project_uuid,
        //             user_id: user_id
        //         };
        //         console.log(args);

        //         const response = await window.api.createNewProject(args);
        //         console.log('Create New Projects Response:', response);

        //         if (response && response.success) {
        //             // Handle success case
        //             console.log('Project created successfully');
        //             // navigate("/");
        //         } else {
        //             // Handle error case
        //             console.error('Error creating project:', response?.error || 'Unknown error');
        //             // Show an error message to the user
        //         }
        //     } else {
        //         console.log('Project already exists, skipping creation.');
        //     }

        // } catch (error) {
        //     console.error('Error creating project:', error.message);
        //     // Show an error message to the user
        // }
    }

    const handleProjectType = (projectType) => {
        setType(projectType);
        if (projectType === "Sport") {
            setIsSelectedType1(true);
            setIsSelectedType2(false);
        } else {
            setIsSelectedType1(false);
            setIsSelectedType2(true);
        }
        console.log(projectType);

    };


    return (
        <div className="teamleader-wrapper">
            <div className="newproject-teamleader-content">

                <div className="header">
                    <h4><img className="title-img" src={more_black} alt="more" /> New project</h4>
                    <p>Create a new school or sport photography</p>
                </div>


                <form className="newproject-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        list="projects"
                        value={projectName}
                        onChange={(e) => handleProjectChange(e.target.value)}
                        placeholder="Search projects..."
                        style={{ maxWidth: '100%', overflowX: 'auto' }}
                        className="datalist-input"
                    />
                    <datalist
                        id="projects"
                    >
                        {_projects.map(project => (
                            <option className="datalist-option" key={project.project_uuid} value={project.projectname} />
                        ))}
                        <option value="search_for_more">Search for more...</option>
                    </datalist>
                    <div className="my-2">
                        <button className={`work-type-button ${isSelectedType1 ? 'selected-type' : ''}`}
                            type="button" onClick={() => handleProjectType("Sport")}>
                            <img className="type-img" src={running} alt="running"></img>
                            <p>
                                Sport Photography
                            </p>
                        </button>
                        <button className={`work-type-button ${isSelectedType2 ? 'selected-type' : ''}`}
                            type="button" onClick={() => handleProjectType("School")}>
                            <img className="type-img" src={academic} alt="academic"></img>
                            <p>
                                School Photography
                            </p>
                        </button>
                    </div>

                    <button type="submit" className="button standard">Create new project</button>
                </form>

            </div>

            <Sidemenu_teamleader />
        </div>
    );
}
export default Newproject_teamleader;