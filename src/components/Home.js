import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';


function Home(props) {

    const [players, setPlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [startClicked, setStartClicked] = useState(false)

    const url = 'https://s3-ap-southeast-1.amazonaws.com/he-public-data/bets7747a43.json';

    useEffect(() => {
        axios.get(url)
            .then((response) => {
                setPlayers(response.data)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    useEffect(() => {
        if (selectedPlayers.length > 3) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true)
        }
    }, [selectedPlayers])

    function handleCheckbox(event) {
        const { checked, name } = event.target;
        var checkedPlayer = null;

        if (checked) {
            for (let i = 0; i < players.length; i++) {
                if (players[i].Name === name) {
                    checkedPlayer = players[i];
                    break;
                }
            }

            setSelectedPlayers((prevValue) => {
                return [...prevValue, checkedPlayer]
            })
        } else {
            setSelectedPlayers((prevValue) => {
                return prevValue.filter((player) => {
                    return player.Name !== name;
                })
            })
        }
    }

    function handleStart() {
        setStartClicked(true);
    }

    if (startClicked) {
        return <Redirect to={{ pathname: '/winner', state: { selectedPlayers: selectedPlayers }}} />
    }

    return (
        <div className="row">
            <div className="col-4" style={{ backgroundColor: "lightgray" }}>
                <img style={{ height: "100px", width: "100px", display: "block" }} className="m-4 mx-auto" src="https://cdn.iconscout.com/icon/premium/png-256-thumb/dice-266-799783.png" alt="dice" />
                <div className="m-4">
                    <table className="table">
                        <tbody>
                            {selectedPlayers.map((player, index) => {
                                return <tr key={index}>
                                    <td>{player.Name}</td>
                                    <td><img src={player['Profile Image']} alt='Player Avatar' style={{ height: "20px", width: "20px" }} /></td>
                                    <td>{player.Bet} <span className="text-warning"><i className="fa fa-bullseye" aria-hidden="true"></i></span></td>
                                    <td>{player.Price} <span className="text-warning"><i className="fa fa-money" aria-hidden="true"></i></span></td>
                                </tr>
                            })}
                        </tbody>
                    </table>

                    <button onClick={handleStart} className="btn btn-block btn-dark" disabled={buttonDisabled} >START</button>
                </div>
            </div>

            <div className="col-8">
                <h3 className="text-dark m-3">Select Atleast 4 to Play</h3>
                <div className="m-4">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">SELECT</th>
                                <th scope="col">PLAYER NAME</th>
                                <th scope="col">AVATAR</th>
                                <th scope="col">BET</th>
                                <th scope="col">PRICE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.map((player, index) => {
                                return <tr key={index}>
                                    <td  ><input name={player.Name} type="checkbox" onChange={handleCheckbox}></input></td>
                                    <td>{player.Name}</td>
                                    <td><img src={player['Profile Image']} alt='Player Avatar' style={{ height: "30px", width: "30px" }} /></td>
                                    <td>{player.Bet} <span className="text-warning"><i className="fa fa-bullseye" aria-hidden="true"></i></span></td>
                                    <td>{player.Price} <span className="text-warning"><i className="fa fa-money" aria-hidden="true"></i></span></td>
                                </tr>
                            })}

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Home;