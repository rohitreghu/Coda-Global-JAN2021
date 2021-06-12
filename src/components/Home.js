import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';


function Home(props) {

    const [players, setPlayers] = useState([]);
    const [displayedPlayers, setDisplayedPlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [startClicked, setStartClicked] = useState(false)
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBet, setSortBet] = useState(null);
    const [sortPrice, setSortPrice] = useState(null);

    const arrowUp = "fa fa-arrow-up";
    const arrowDown = "fa fa-arrow-down";

    const [betArrow, setBetArrow] = useState("bi bi-arrow-down-up");
    const [priceArrow, setPriceArrow] = useState("bi bi-arrow-down-up");

    const url = 'https://s3-ap-southeast-1.amazonaws.com/he-public-data/bets7747a43.json';

    useEffect(() => {
        if (props.location.state) {
            const playersFromWinner = props.location.state.selectedPlayers;
            axios.get(url)
                .then((response) => {
                    setPlayers(response.data.map((player) => {
                        for (var i = 0; i < playersFromWinner.length; i++) {
                            if (player.Name === playersFromWinner[i].Name) {
                                console.log(playersFromWinner[i].Price);
                                player.Price = playersFromWinner[i].Price
                                break
                            }
                        }
                        return player;
                    }))
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            axios.get(url)
                .then((response) => {
                    setPlayers(response.data)
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }, [props.location.state])

    useEffect(() => {
        if (selectedPlayers.length > 3) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true)
        }
    }, [selectedPlayers])

    useEffect(() => {
        setDisplayedPlayers(players);
    }, [players])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm) {
                setDisplayedPlayers(players.filter((player) => {
                    return player.Name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase());
                }));
            } else {
                setDisplayedPlayers(players)
            }
        }, 500)

        return () => {
            clearTimeout(timeoutId);
        }
    }, [searchTerm, players])

    function handleCheckbox(event) {
        const { checked, name } = event.target;
        var checkedPlayer = null;

        if (checked) {
            for (let i = 0; i < displayedPlayers.length; i++) {
                if (players[i].Name === name) {
                    checkedPlayer = displayedPlayers[i];
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

    const handleSort = (e) => {

        const { id } = e.target;

        if (id === "Bet") {
            if (sortBet) {
                setSortBet(false);
                setDisplayedPlayers(prevValue => prevValue.sort((a, b) => a.Bet - b.Bet))
                setBetArrow(arrowDown);
            } else {
                setSortBet(true);
                setDisplayedPlayers(prevValue => prevValue.sort((a, b) => b.Bet - a.Bet))
                setBetArrow(arrowUp);
            }
            setPriceArrow("bi bi-arrow-down-up")
        } else {
            if (sortPrice) {
                setSortPrice(false);
                setDisplayedPlayers(prevValue => prevValue.sort((a, b) => a.Price - b.Price))
                setPriceArrow(arrowDown);
            } else {
                setSortPrice(true);
                setDisplayedPlayers(prevValue => prevValue.sort((a, b) => b.Price - a.Price))
                setPriceArrow(arrowUp);
            }
            setBetArrow("bi bi-arrow-down-up")
        }
    }


    if (startClicked) {
        return <Redirect to={{ pathname: '/winner', state: { selectedPlayers: selectedPlayers } }} />
    }

    return (
        <div className="container-fluid">
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

                    <div className="form-group m-3">
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="m-4">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">SELECT</th>
                                    <th scope="col">PLAYER NAME</th>
                                    <th scope="col">AVATAR</th>
                                    <th
                                        scope="col"
                                        id="Bet"
                                        onClick={e => handleSort(e)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <i className={betArrow} ></i>
                                        BET
                                    </th>
                                    <th
                                        scope="col"
                                        id="Price"
                                        onClick={e => handleSort(e)}
                                        style={{ cursor: "pointer" }}
                                    >
                                    <i className={`fa ${priceArrow}`} ></i>
                                        PRICE
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedPlayers.map((player, index) => {
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
        </div>

    );
}

export default Home;