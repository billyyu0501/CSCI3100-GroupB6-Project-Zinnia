import React, {useEffect, useState} from 'react';
import {Buffer} from 'buffer';
import "./Searchbar.css";
import {Alert} from 'reactstrap'

function Searchbar({placeholder, user_id}) {

    const userId = user_id;
    const [rawData, setRawData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [valueEntered, setValueEntered] = useState("");
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const fetchFriendlist = async () => {
        fetch(`http://localhost:8080/private/friendlist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            body: JSON.stringify({
                userId: userId})
        })
        .then(res => {
            return res.json();
        })
        .then(data => {
            console.log(data);
            if(data.length != 0)
                setRawData(data.friend);
        })
    }

    const handleFilter = (e) => {
        const keyword = e.target.value;
        setValueEntered(keyword);
        const newFilter = rawData.filter((value) => {
            return value.username.toLowerCase().includes(keyword.toLowerCase());
        });
        if (keyword === "") {
            setFilteredData([]);
        } else {
            setFilteredData(newFilter)
        }       
    }

    const clearInput = () => {
        setFilteredData([]);
        setValueEntered("");
    }

    const createChat = async (user_id) => {
        fetch(`http://localhost:8080/private/createChat`, {
            method: 'POST', headers: {'Content-Type': 'application/json',},
            mode: 'cors', body: JSON.stringify({user1: userId, user2: user_id})
        })
        .then(res => {
            if (!res.ok)
                return res.json();
            return null;
        })
        .then(data => {
            if(data) {
                setAlertMessage(data.msg)
                showAlert();
            } else clearInput();
        });
    }

    const showAlert = () => {
        setAlertVisible(true);
    }

    useEffect(() => {
        window.setTimeout(() => {
            setAlertVisible(false);
        }, 3500)
    },[alertVisible])

    useEffect(() => {
        fetchFriendlist();
    },[])

  return (
    <div className="search">
        <div className="search-input">
            <input type="text" id="searchbar" placeholder={placeholder} value={valueEntered} onChange={handleFilter}/>
            <input type="submit" id="clear-button" onClick={clearInput}/>
        </div>
        {filteredData.length !== 0 && (
            <div className="search-results" >
                {filteredData.map((data) => {
                    return <div className="data-item" onClick={() => {createChat(data.userId)}} key={data.userId}>
                            <img alt="" 
                                height="40" 
                                width="40" 
                                src={data.photo.data.length==0?"/img/blankProfilePic.png":Buffer.from(data.photo,"base64").toString("ascii")}/>
                            <p>{data.username && data.username}</p>
                        </div>;
                })}
            </div>
        )}
        <Alert color="danger" isOpen={alertVisible}>
               {/* The chat already exists */}
               {alertMessage != "" && alertMessage}
        </Alert>
    </div>
  )
}

export default Searchbar;