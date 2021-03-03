import React, { useState, useEffect, useReducer } from 'react';
import { Redirect } from 'react-router-dom';

function Winner(props) {

    const [dice, setDice] = useState("")
    const [selectedPlayers, setSelectedPlayers] = useState([])
    const [backClicked, setBackClicked] = useState(false);

    useEffect(() => {
        setDice(Math.floor(Math.random() * 10));
        setSelectedPlayers(props.location.state.selectedPlayers);
    }, [])



    function handleBack(){
        
        setSelectedPlayers((prevValue) => {
            prevValue.forEach((player) => {
                if(player.Bet === dice){
                    player.Price = player.Price * 2;
                }

                return player
            })
            setBackClicked(true);
        })

        
    }


    if (backClicked){
        props.location.state.handleChangedPlayers(selectedPlayers);
        return <Redirect to={{ pathname:'/home'}} />
    }

    return <div>
        <div>
            <div className="dice">{dice}</div>
            <div className="card-deck" >
                {selectedPlayers.map((player, index) => {
                    return <div key={index} className="card m-3 p-3" style={{ display: "inline-block", height: "230px", width: "150px" }}>
                        <img className="card-img-top" src={player['Profile Image']} alt="Card image cap" style={{ height: "70px", width: "70px" }} />
                        <div className="card-body">
                            <div className="card-text">{player.Name}</div>
                            <div className="card-text">{player.Bet} <span className="text-warning"><i className="fa fa-bullseye" aria-hidden="true"></i></span></div>
                            <div className="card-text">{player.Price} <span className="text-warning"><i className="fa fa-money" aria-hidden="true"></i></span></div>
                        </div>
                    </div>
                })}
            </div>
        </div>
        <button onClick={handleBack} className="btn btn-block btn-dark">BACK</button>
    </div>
}

export default Winner;