import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

function Winner(props) {

    const [dice, setDice] = useState(0);
    const [backClicked, setBackClicked] = useState(false);
    const [selectedPlayers, setSelectedPlayers] = useState([]);

    useEffect(() => {
        setDice(Math.floor(Math.random() * 9) + 1);
    }, [props.location.state.selectedPlayers])

    useEffect(() => {
        if (dice) {
            setSelectedPlayers(props.location.state.selectedPlayers.map((player) => {
                if (parseInt(player.Bet) === dice) {
                    player.Price = parseInt(player.Price) * 2;
                    player.Status = "WON";
                } else {
                    player.Status = "LOST";
                }

                return player
            }))
        }
    }, [dice, props.location.state.selectedPlayers])

    function handleBack() {
        setBackClicked(true);
    }

    const renderedPlayers = selectedPlayers.map((player, index) => {
        return <tr key={index}>
            <td>{player.Name}</td>
            <td><img src={player['Profile Image']} alt='Player Avatar' style={{ height: "30px", width: "30px" }} /></td>
            <td>{player.Bet} <span className="text-warning"><i className="fa fa-bullseye" aria-hidden="true"></i></span></td>
            <td>{player.Price} <span className="text-warning"><i className="fa fa-money" aria-hidden="true"></i></span></td>
            <td>{player.Status && player.Status}</td>
        </tr>
    })


    if (backClicked) {
        return <Redirect to={{ pathname: '/home', state: { selectedPlayers: selectedPlayers } }} />
    }

    return <div>
        <div>
            <div className="dice">{dice}</div>
            <div className="m-4">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">PLAYER NAME</th>
                            <th scope="col">AVATAR</th>
                            <th scope="col">BET</th>
                            <th scope="col">PRICE</th>
                            <th scope="col">STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderedPlayers}
                    </tbody>
                </table>
            </div>
        </div>
        <button onClick={handleBack} className="btn btn-block btn-dark">BACK</button>
    </div>
}

export default Winner;