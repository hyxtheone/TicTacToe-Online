import React, {useRef} from "react";
import "./home.css";
import {useNavigate} from "react-router-dom";
import {socket} from "../../services/socket";

export default function home() {
    const navigate = useNavigate();
    const channelRef = useRef();

    const handleConnection = () => {
        const channel = channelRef.current.value;
        if (!channel.trim()) return;
        socket.emit('set_channel', channel)
        navigate("/online");
    };

    return (
        <div className="tudao">
            <div className="main">
                <div>
                    <h1 className="title">Play</h1>
                </div>
                <div className="input">
                    <input
                        ref={channelRef}
                        type="number"
                        placeholder="Digite uma sala"
                    />
                </div>
                <div>
                    <button className="reset" onClick={handleConnection}>Connect</button>
                </div>
                <div>
                    <button className="reset" onClick={() => {
                        navigate("/play")
                    }}>Play Offline
                    </button>
                </div>
            </div>
        </div>
    );
}
